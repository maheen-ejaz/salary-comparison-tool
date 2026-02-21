import type { TaxRule, MigrationCosts } from "@/lib/data/types";

// Re-export shared formatters from UK calculator (INR / months formatting is country-agnostic)
export { formatInr, formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";

export interface DeTaxBreakdown {
  grossAnnual: number;
  incomeTax: number;
  solidaritySurcharge: number;
  healthInsurance: number;
  pensionInsurance: number;
  unemploymentInsurance: number;
  longTermCareInsurance: number;
  totalSocialContributions: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
  churchTaxNote: string;
}

export interface DeSavingsResult {
  monthlyTakeHomeEur: number;
  monthlyTakeHomeInr: number;
  monthlyCostEur: number;
  monthlySavingsEur: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

/**
 * German income tax per §32a EStG (2025 parameters).
 *
 * Germany uses a formula-based progressive system, NOT simple marginal brackets.
 * The tax is computed using linear-progressive formulas within zones:
 *   Zone 1: €0–€11,784        → 0 (Grundfreibetrag)
 *   Zone 2: €11,785–€17,005   → (979.18 × y + 1400) × y
 *   Zone 3: €17,006–€66,760   → (192.59 × z + 2397) × z + 966.53
 *   Zone 4: €66,761–€277,825  → 0.42 × zvE − 10,636.31
 *   Zone 5: €277,826+         → 0.45 × zvE − 18,971.06
 *
 * Parameters from BMF Programmablaufplan (PAP) 2025.
 */
function computeGermanIncomeTax(zvE: number): number {
  if (zvE <= 11784) {
    return 0;
  }
  if (zvE <= 17005) {
    const y = (zvE - 11784) / 10000;
    return Math.floor((979.18 * y + 1400) * y);
  }
  if (zvE <= 66760) {
    const z = (zvE - 17005) / 10000;
    return Math.floor((192.59 * z + 2397) * z + 966.53);
  }
  if (zvE <= 277825) {
    return Math.floor(0.42 * zvE - 10636.31);
  }
  return Math.floor(0.45 * zvE - 18971.06);
}

/**
 * Solidarity surcharge (Solidaritätszuschlag).
 *
 * 5.5% of income tax, but with a Freigrenze (exemption threshold)
 * and a gliding zone (Milderungszone) to prevent a sharp cliff.
 *
 * - If income tax ≤ €18,130 → Soli = 0
 * - If income tax > €18,130 → Soli = min(5.5% × tax, 11.9% × (tax − €18,130))
 * - The 11.9% cap ensures smooth phase-in
 */
function computeSolidaritySurcharge(incomeTax: number): number {
  const FREIGRENZE = 18130;
  if (incomeTax <= FREIGRENZE) return 0;

  const fullSoli = incomeTax * 0.055;
  const maxSoliInGlidingZone = (incomeTax - FREIGRENZE) * 0.119;

  return Math.floor(Math.min(fullSoli, maxSoliInGlidingZone));
}

/**
 * Social insurance contributions (employee share only).
 * Each contribution has a flat rate up to an income cap (BBG = Beitragsbemessungsgrenze).
 * Rates and caps are read from the CSV tax rules.
 */
function computeSocialContributions(grossAnnual: number, taxRules: TaxRule[]) {
  const findRateAndCap = (taxType: string): { rate: number; cap: number } => {
    const rule = taxRules.find((r) => r.taxType === taxType);
    if (!rule) return { rate: 0, cap: Infinity };
    return { rate: rule.ratePercent / 100, cap: rule.bracketUpper };
  };

  const health = findRateAndCap("Health Insurance");
  const pension = findRateAndCap("Pension Insurance");
  const unemployment = findRateAndCap("Unemployment Insurance");
  const care = findRateAndCap("Long-term Care Insurance");

  return {
    healthInsurance: Math.round(Math.min(grossAnnual, health.cap) * health.rate),
    pensionInsurance: Math.round(Math.min(grossAnnual, pension.cap) * pension.rate),
    unemploymentInsurance: Math.round(Math.min(grossAnnual, unemployment.cap) * unemployment.rate),
    longTermCareInsurance: Math.round(Math.min(grossAnnual, care.cap) * care.rate),
  };
}

/**
 * Calculate German take-home pay.
 *
 * Deductions: Income Tax + Solidarity Surcharge + Social Contributions
 * (Health, Pension, Unemployment, Long-term Care)
 *
 * Church tax is EXCLUDED (informational note only).
 * Assumes Steuerklasse I (single, no children).
 */
export function calculateDeTakeHome(
  grossAnnual: number,
  taxRules: TaxRule[],
): DeTaxBreakdown {
  // 1. Social contributions
  const social = computeSocialContributions(grossAnnual, taxRules);
  const totalSocialContributions =
    social.healthInsurance +
    social.pensionInsurance +
    social.unemploymentInsurance +
    social.longTermCareInsurance;

  // 2. Income tax (§32a formula on gross — simplified; in practice,
  //    employee social contributions are partially deductible as Vorsorgeaufwendungen,
  //    but we compute on gross for transparency and note this in disclaimers)
  const incomeTax = computeGermanIncomeTax(Math.round(grossAnnual));

  // 3. Solidarity surcharge
  const solidaritySurcharge = computeSolidaritySurcharge(incomeTax);

  // 4. Church tax excluded
  const churchTaxNote =
    "Church tax (Kirchensteuer) is NOT included. If you are a registered church member, " +
    "add 8% (Bavaria/Baden-Württemberg) or 9% (all other states) of your income tax.";

  const totalDeductions = incomeTax + solidaritySurcharge + totalSocialContributions;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveTaxRate =
    grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
      : 0;

  return {
    grossAnnual,
    incomeTax: Math.round(incomeTax),
    solidaritySurcharge: Math.round(solidaritySurcharge),
    healthInsurance: social.healthInsurance,
    pensionInsurance: social.pensionInsurance,
    unemploymentInsurance: social.unemploymentInsurance,
    longTermCareInsurance: social.longTermCareInsurance,
    totalSocialContributions,
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    effectiveTaxRate,
    churchTaxNote,
  };
}

export function calculateDeSavings(
  netMonthly: number,
  monthlyCost: number,
  eurToInr: number,
  migrationCosts: MigrationCosts,
): DeSavingsResult {
  const monthlySavingsEur = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsEur * eurToInr;
  const monthlyTakeHomeInr = netMonthly * eurToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeEur: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostEur: monthlyCost,
    monthlySavingsEur: Math.round(monthlySavingsEur),
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

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(amount);
}
