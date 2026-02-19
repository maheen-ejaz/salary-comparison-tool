import type { TaxRule, MigrationCosts } from "@/lib/data/types";

// Re-export shared formatters from UK calculator (INR / months formatting is country-agnostic)
export { formatInr, formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";

export interface AuTaxBreakdown {
  grossAnnual: number;
  incomeTax: number;
  medicareLevy: number;
  superannuationEmployer: number; // employer-paid — NOT deducted from take-home
  totalDeductions: number; // incomeTax + medicareLevy
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
}

export interface AuSavingsResult {
  monthlyTakeHomeAud: number;
  monthlyTakeHomeInr: number;
  monthlyCostAud: number;
  monthlySavingsAud: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

/**
 * Calculate Australian take-home pay.
 *
 * Take-home = Gross - Income Tax - Medicare Levy
 * Superannuation is employer-paid on top of gross — shown for info only.
 */
export function calculateAuTakeHome(
  grossAnnual: number,
  taxRules: TaxRule[]
): AuTaxBreakdown {
  // --- Income Tax (marginal brackets) ---
  const itRules = taxRules
    .filter((r) => r.taxType === "Income Tax" && r.ratePercent >= 0)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let incomeTax = 0;
  for (const rule of itRules) {
    if (rule.ratePercent === 0) continue;
    const taxableInBracket =
      Math.min(grossAnnual, rule.bracketUpper) -
      Math.min(grossAnnual, rule.bracketLower);
    if (taxableInBracket > 0) {
      incomeTax += taxableInBracket * (rule.ratePercent / 100);
    }
  }

  // --- Medicare Levy (special phase-in logic — NOT standard marginal) ---
  // Below threshold ($26,000): $0
  // Phase-in zone ($26,001–$32,500): levy = 10% × (income - threshold)
  // Above ceiling ($32,500+): levy = 2% of total taxable income
  const mlRules = taxRules
    .filter((r) => r.taxType === "Medicare Levy")
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let medicareLevy = 0;
  if (mlRules.length >= 3) {
    const thresholdRule = mlRules[0]; // 0% below threshold
    const phaseInRule = mlRules[1]; // 10% shade-in
    const fullRule = mlRules[2]; // 2% flat

    const threshold = thresholdRule.bracketUpper; // $26,000
    const ceiling = phaseInRule.bracketUpper; // $32,500

    if (grossAnnual <= threshold) {
      medicareLevy = 0;
    } else if (grossAnnual <= ceiling) {
      // Phase-in: 10% of (income - threshold)
      medicareLevy =
        (grossAnnual - threshold) * (phaseInRule.ratePercent / 100);
    } else {
      // Full levy: 2% of total taxable income
      medicareLevy = grossAnnual * (fullRule.ratePercent / 100);
    }
  }

  // --- Superannuation (employer-paid, NOT deducted) ---
  const superRule = taxRules.find(
    (r) => r.taxType === "Superannuation Guarantee"
  );
  const superRate = superRule ? superRule.ratePercent / 100 : 0.12;
  const superannuationEmployer = Math.round(grossAnnual * superRate);

  const totalDeductions = incomeTax + medicareLevy;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveTaxRate =
    grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
      : 0;

  return {
    grossAnnual,
    incomeTax: Math.round(incomeTax),
    medicareLevy: Math.round(medicareLevy),
    superannuationEmployer,
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    effectiveTaxRate,
  };
}

export function calculateAuSavings(
  netMonthly: number,
  monthlyCost: number,
  audToInr: number,
  migrationCosts: MigrationCosts
): AuSavingsResult {
  const monthlySavingsAud = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsAud * audToInr;
  const monthlyTakeHomeInr = netMonthly * audToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeAud: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostAud: monthlyCost,
    monthlySavingsAud: Math.round(monthlySavingsAud),
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

export function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}
