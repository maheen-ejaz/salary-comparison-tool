import type { MigrationCosts } from "@/lib/data/types";

// Re-export shared formatters from UK calculator
export { formatInr, formatMonths } from "../uk/taxCalculator";

/**
 * UAE Tax Breakdown
 * UAE has zero income tax for expatriates
 */
export interface AeTaxBreakdown {
  grossAnnual: number;
  incomeTax: number; // always 0
  socialSecurity: number; // always 0 (expats exempt)
  totalDeductions: number; // always 0
  netAnnual: number; // = grossAnnual
  netMonthly: number;
  effectiveTaxRate: number; // always 0
}

/**
 * UAE Savings Calculation Result
 */
export interface AeSavingsResult {
  monthlyTakeHomeAed: number;
  monthlyTakeHomeInr: number;
  monthlyCostAed: number;
  monthlySavingsAed: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

/**
 * Calculate UAE take-home salary
 * UAE has no personal income tax for expatriates, so gross = net
 */
export function calculateAeTakeHome(grossAnnual: number): AeTaxBreakdown {
  return {
    grossAnnual: Math.round(grossAnnual),
    incomeTax: 0,
    socialSecurity: 0,
    totalDeductions: 0,
    netAnnual: Math.round(grossAnnual),
    netMonthly: Math.round(grossAnnual / 12),
    effectiveTaxRate: 0,
  };
}

/**
 * Calculate savings potential in UAE
 */
export function calculateAeSavings(
  netMonthly: number,
  monthlyCost: number,
  aedToInr: number,
  migrationCosts: MigrationCosts
): AeSavingsResult {
  const monthlySavingsAed = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsAed * aedToInr;
  const monthlyTakeHomeInr = netMonthly * aedToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeAed: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostAed: monthlyCost,
    monthlySavingsAed: Math.round(monthlySavingsAed),
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

/**
 * Format AED currency for display
 */
export function formatAed(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(amount);
}
