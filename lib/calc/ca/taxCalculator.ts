import type { TaxRule, MigrationCosts } from "@/lib/data/types";

export { formatInr, formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";

export const CITY_TO_PROVINCE: Record<string, string> = {
  Toronto: "ON",
  Vancouver: "BC",
  Calgary: "AB",
  Montreal: "QC",
  Ottawa: "ON",
  Winnipeg: "MB",
};

const FEDERAL_BPA = 16129;

const PROVINCIAL_BPA: Record<string, number> = {
  ON: 11865,
  BC: 12580,
  AB: 21003,
  QC: 18056,
  MB: 15780,
};

export interface CaTaxBreakdown {
  grossAnnual: number;
  federalTax: number;
  provincialTax: number;
  ontarioSurtax: number;
  ontarioHealthPremium: number;
  cppContribution: number;
  eiContribution: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
  province: string;
  isQuebec: boolean;
}

export interface CaSavingsResult {
  monthlyTakeHomeCad: number;
  monthlyTakeHomeInr: number;
  monthlyCostCad: number;
  monthlySavingsCad: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

/** Compute marginal tax from bracket rules */
function computeMarginalTax(gross: number, rules: TaxRule[]): number {
  let tax = 0;
  for (const rule of rules) {
    if (rule.ratePercent <= 0) continue;
    const taxable = Math.min(gross, rule.bracketUpper) - Math.min(gross, rule.bracketLower);
    if (taxable > 0) {
      tax += taxable * (rule.ratePercent / 100);
    }
  }
  return tax;
}

/** Ontario Health Premium — stepped formula */
function computeOntarioHealthPremium(income: number): number {
  if (income <= 20000) return 0;
  if (income <= 25000) return Math.min(0.06 * (income - 20000), 300);
  if (income <= 36000) return 300;
  if (income <= 38500) return 300 + Math.min(0.06 * (income - 36000), 150);
  if (income <= 48000) return 450;
  if (income <= 48600) return 450 + Math.min(0.25 * (income - 48000), 150);
  if (income <= 72000) return 600;
  if (income <= 72600) return 600 + Math.min(0.25 * (income - 72000), 150);
  if (income <= 200000) return 750;
  if (income <= 200600) return 750 + Math.min(0.25 * (income - 200000), 150);
  return 900;
}

/** Ontario Surtax — applied to basic provincial tax */
function computeOntarioSurtax(basicProvincialTax: number): number {
  let surtax = 0;
  if (basicProvincialTax > 4991) {
    surtax += 0.20 * (basicProvincialTax - 4991);
  }
  if (basicProvincialTax > 6387) {
    surtax += 0.36 * (basicProvincialTax - 6387);
  }
  return surtax;
}

export function calculateCaTakeHome(
  grossAnnual: number,
  taxRules: TaxRule[],
  province: string,
): CaTaxBreakdown {
  const isQuebec = province === "QC";

  // --- 1. CPP/QPP Contributions ---
  const cppType = isQuebec ? "QPP" : "CPP";
  const cppRules = taxRules
    .filter((r) => r.taxType === cppType)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let cppContribution = 0;
  for (const rule of cppRules) {
    if (rule.ratePercent <= 0) continue;
    const pensionable = Math.min(grossAnnual, rule.bracketUpper) - Math.min(grossAnnual, rule.bracketLower);
    if (pensionable > 0) {
      cppContribution += pensionable * (rule.ratePercent / 100);
    }
  }

  // CPP2/QPP2
  const cpp2Type = isQuebec ? "QPP2" : "CPP2";
  const cpp2Rules = taxRules.filter((r) => r.taxType === cpp2Type);
  for (const rule of cpp2Rules) {
    if (rule.ratePercent <= 0) continue;
    const pensionable = Math.min(grossAnnual, rule.bracketUpper) - Math.min(grossAnnual, rule.bracketLower);
    if (pensionable > 0) {
      cppContribution += pensionable * (rule.ratePercent / 100);
    }
  }

  // --- 2. EI Contributions ---
  const eiRules = taxRules
    .filter((r) => r.taxType === "EI" && (isQuebec ? r.region === "QC" : !r.region))
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let eiContribution = 0;
  for (const rule of eiRules) {
    if (rule.ratePercent <= 0) continue;
    const insurable = Math.min(grossAnnual, rule.bracketUpper) - Math.min(grossAnnual, rule.bracketLower);
    if (insurable > 0) {
      eiContribution += insurable * (rule.ratePercent / 100);
    }
  }

  // --- 3. Federal Income Tax ---
  const federalRules = taxRules
    .filter((r) => r.taxType === "Income Tax" && !r.region)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let grossFederalTax = computeMarginalTax(grossAnnual, federalRules);

  // Apply non-refundable credits
  const federalLowestRate = 0.15;
  const bpaCredit = federalLowestRate * FEDERAL_BPA;
  const cppCredit = federalLowestRate * cppContribution;
  const eiCredit = federalLowestRate * eiContribution;
  grossFederalTax = Math.max(0, grossFederalTax - bpaCredit - cppCredit - eiCredit);

  // Quebec federal abatement: 16.5% reduction
  if (isQuebec) {
    grossFederalTax = grossFederalTax * (1 - 0.165);
  }

  const federalTax = grossFederalTax;

  // --- 4. Provincial Income Tax ---
  const provincialRules = taxRules
    .filter((r) => r.taxType === "Provincial Income Tax" && r.region === province)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let basicProvincialTax = computeMarginalTax(grossAnnual, provincialRules);

  // Apply provincial BPA credit
  const provBPA = PROVINCIAL_BPA[province] ?? 11000;
  const provLowestRate = provincialRules.length > 0 ? provincialRules[0].ratePercent / 100 : 0.05;
  const provBpaCredit = provLowestRate * provBPA;
  const provCppCredit = provLowestRate * cppContribution;
  const provEiCredit = provLowestRate * eiContribution;
  basicProvincialTax = Math.max(0, basicProvincialTax - provBpaCredit - provCppCredit - provEiCredit);

  // --- 5. Ontario Surtax & Health Premium ---
  let ontarioSurtax = 0;
  let ontarioHealthPremium = 0;
  if (province === "ON") {
    ontarioSurtax = computeOntarioSurtax(basicProvincialTax);
    ontarioHealthPremium = computeOntarioHealthPremium(grossAnnual);
  }

  const provincialTax = basicProvincialTax + ontarioSurtax;

  // --- 6. Total ---
  const totalDeductions = federalTax + provincialTax + ontarioHealthPremium + cppContribution + eiContribution;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveTaxRate = grossAnnual > 0
    ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
    : 0;

  return {
    grossAnnual,
    federalTax: Math.round(federalTax),
    provincialTax: Math.round(provincialTax),
    ontarioSurtax: Math.round(ontarioSurtax),
    ontarioHealthPremium: Math.round(ontarioHealthPremium),
    cppContribution: Math.round(cppContribution),
    eiContribution: Math.round(eiContribution),
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    effectiveTaxRate,
    province,
    isQuebec,
  };
}

export function calculateCaSavings(
  netMonthly: number,
  monthlyCost: number,
  cadToInr: number,
  migrationCosts: MigrationCosts
): CaSavingsResult {
  const monthlySavingsCad = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsCad * cadToInr;
  const monthlyTakeHomeInr = netMonthly * cadToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeCad: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostCad: monthlyCost,
    monthlySavingsCad: Math.round(monthlySavingsCad),
    monthlySavingsInr: Math.round(monthlySavingsInr),
    isNegativeSavings,
    recoveryMonthsMin: isNegativeSavings
      ? Infinity
      : Math.ceil(migrationCosts.totalMin / safeMonthlyInr),
    recoveryMonthsTypical: isNegativeSavings
      ? Infinity
      : Math.ceil(migrationCosts.totalTypical / safeMonthlyInr),
    recoveryMonthsMax: isNegativeSavings
      ? Infinity
      : Math.ceil(migrationCosts.totalMax / safeMonthlyInr),
  };
}

export function formatCad(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(amount);
}
