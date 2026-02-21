import type { TaxRule, MigrationCosts } from "@/lib/data/types";

// Re-export shared formatters from UK calculator (INR / months formatting is country-agnostic)
export { formatInr, formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";

export interface NzTaxBreakdown {
  grossAnnual: number;
  incomeTax: number;
  accLevy: number;
  kiwisaver: number; // optional employee contribution (3%)
  totalDeductions: number; // incomeTax + accLevy + kiwisaver
  netAnnual: number;
  netMonthly: number;
  effectiveTaxRate: number;
}

export interface NzSavingsResult {
  monthlyTakeHomeNzd: number;
  monthlyTakeHomeInr: number;
  monthlyCostNzd: number;
  monthlySavingsNzd: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

/**
 * Calculate New Zealand take-home pay.
 *
 * Take-home = Gross - Income Tax - ACC Levy - KiwiSaver (3% optional)
 *
 * NZ has:
 * - Progressive income tax (5 brackets: 10.5%, 17.5%, 30%, 33%, 39%)
 * - ACC Earners' Levy (~1.67% capped at NZ$152,790)
 * - KiwiSaver (optional 3% minimum - we include by default for doctors)
 */
export function calculateNzTakeHome(
  grossAnnual: number,
  taxRules: TaxRule[],
  includeKiwisaver: boolean = true
): NzTaxBreakdown {
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

  // --- ACC Earners' Levy (flat rate capped at maximum liable earnings) ---
  const accRule = taxRules.find((r) => r.taxType === "ACC Earners Levy");
  let accLevy = 0;
  if (accRule) {
    const maxLiableEarnings = accRule.bracketUpper; // NZ$152,790
    const accRate = accRule.ratePercent / 100; // 1.67%
    const taxableForAcc = Math.min(grossAnnual, maxLiableEarnings);
    accLevy = taxableForAcc * accRate;
  }

  // --- KiwiSaver (optional 3% minimum employee contribution) ---
  const kiwisaverRule = taxRules.find((r) => r.taxType === "KiwiSaver");
  let kiwisaver = 0;
  if (includeKiwisaver && kiwisaverRule) {
    const ksRate = kiwisaverRule.ratePercent / 100; // 3%
    kiwisaver = grossAnnual * ksRate;
  }

  const totalDeductions = incomeTax + accLevy + kiwisaver;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveTaxRate =
    grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
      : 0;

  return {
    grossAnnual,
    incomeTax: Math.round(incomeTax),
    accLevy: Math.round(accLevy),
    kiwisaver: Math.round(kiwisaver),
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    effectiveTaxRate,
  };
}

export function calculateNzSavings(
  netMonthly: number,
  monthlyCost: number,
  nzdToInr: number,
  migrationCosts: MigrationCosts
): NzSavingsResult {
  const monthlySavingsNzd = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsNzd * nzdToInr;
  const monthlyTakeHomeInr = netMonthly * nzdToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeNzd: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostNzd: monthlyCost,
    monthlySavingsNzd: Math.round(monthlySavingsNzd),
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

export function formatNzd(amount: number): string {
  return new Intl.NumberFormat("en-NZ", {
    style: "currency",
    currency: "NZD",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(amount);
}
