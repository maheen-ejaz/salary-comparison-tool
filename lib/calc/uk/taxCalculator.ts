import type { TaxRule, MigrationCosts } from "@/lib/data/types";

export interface TaxCalculationInput {
  grossAnnual: number;
  taxRules: TaxRule[];
  includeNhsPension: boolean;
}

export interface TaxBreakdown {
  grossAnnual: number;
  incomeTax: number;
  nationalInsurance: number;
  nhsPension: number;
  nhsPensionTierRate: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  isInPersonalAllowanceWithdrawalZone: boolean;
  effectiveTaxRate: number;
}

const PA_FULL = 12570;
const PA_WITHDRAWAL_START = 100000;
const PA_FULLY_WITHDRAWN_AT = 125140;

export function calculateUkTakeHome(input: TaxCalculationInput): TaxBreakdown {
  const { grossAnnual, taxRules, includeNhsPension } = input;

  // --- Personal Allowance (may be reduced for high earners) ---
  let effectivePA = PA_FULL;
  if (grossAnnual > PA_WITHDRAWAL_START) {
    const excess = Math.min(
      grossAnnual - PA_WITHDRAWAL_START,
      PA_FULLY_WITHDRAWN_AT - PA_WITHDRAWAL_START
    );
    effectivePA = Math.max(0, PA_FULL - Math.floor(excess / 2));
  }
  const isInPAWithdrawalZone =
    grossAnnual > PA_WITHDRAWAL_START && grossAnnual <= PA_FULLY_WITHDRAWN_AT;

  // --- Income Tax (marginal) ---
  // Tax is calculated on gross income; the 0% band corresponds to the PA.
  // We skip the 0% row and calculate tax on each bracket above PA.
  const itRules = taxRules
    .filter((r) => r.taxType === "Income Tax" && r.ratePercent > 0)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let incomeTax = 0;

  // Re-compute bracket boundaries based on effectivePA
  // The basic rate bracket starts at (PA_FULL in CSV) but we use effectivePA.
  for (const rule of itRules) {
    // For the basic rate band, shift the lower bound down by the PA reduction amount
    // so that taxable income above effectivePA is captured correctly.
    const paReduction = PA_FULL - effectivePA;
    const adjustedLower = rule.bracketLower - paReduction;
    const adjustedUpper = rule.bracketUpper - paReduction;

    const taxableInThisBracket =
      Math.min(grossAnnual, adjustedUpper) - Math.min(grossAnnual, adjustedLower);

    if (taxableInThisBracket > 0) {
      incomeTax += taxableInThisBracket * (rule.ratePercent / 100);
    }
  }

  // --- National Insurance (marginal) ---
  const niRules = taxRules
    .filter((r) => r.taxType === "National Insurance" && r.ratePercent > 0)
    .sort((a, b) => a.bracketLower - b.bracketLower);

  let nationalInsurance = 0;
  for (const rule of niRules) {
    const niInBracket =
      Math.min(grossAnnual, rule.bracketUpper) -
      Math.min(grossAnnual, rule.bracketLower);
    if (niInBracket > 0) {
      nationalInsurance += niInBracket * (rule.ratePercent / 100);
    }
  }

  // --- NHS Pension (flat-tier — NOT marginal) ---
  let nhsPension = 0;
  let nhsPensionTierRate = 0;
  if (includeNhsPension) {
    const pensionRules = taxRules
      .filter((r) => r.taxType === "NHS Pension")
      .sort((a, b) => a.bracketLower - b.bracketLower);

    // Find the single tier that contains the gross salary
    const tier = pensionRules.find(
      (r) => grossAnnual >= r.bracketLower && grossAnnual <= r.bracketUpper
    );
    if (tier) {
      nhsPensionTierRate = tier.ratePercent;
      nhsPension = grossAnnual * (tier.ratePercent / 100);
    }
  }

  const totalDeductions = incomeTax + nationalInsurance + nhsPension;
  const netAnnual = grossAnnual - totalDeductions;
  const netMonthly = netAnnual / 12;
  const effectiveTaxRate =
    grossAnnual > 0
      ? Math.round((totalDeductions / grossAnnual) * 1000) / 10
      : 0;

  return {
    grossAnnual,
    incomeTax: Math.round(incomeTax),
    nationalInsurance: Math.round(nationalInsurance),
    nhsPension: Math.round(nhsPension),
    nhsPensionTierRate,
    totalDeductions: Math.round(totalDeductions),
    netAnnual: Math.round(netAnnual),
    netMonthly: Math.round(netMonthly),
    isInPersonalAllowanceWithdrawalZone: isInPAWithdrawalZone,
    effectiveTaxRate,
  };
}

export interface SavingsResult {
  monthlyTakeHomeGbp: number;
  monthlyTakeHomeInr: number;
  monthlyCostGbp: number;
  monthlySavingsGbp: number;
  monthlySavingsInr: number;
  isNegativeSavings: boolean;
  recoveryMonthsMin: number;
  recoveryMonthsTypical: number;
  recoveryMonthsMax: number;
}

export function calculateSavings(
  netMonthly: number,
  monthlyCost: number,
  gbpToInr: number,
  migrationCosts: MigrationCosts
): SavingsResult {
  const monthlySavingsGbp = netMonthly - monthlyCost;
  const monthlySavingsInr = monthlySavingsGbp * gbpToInr;
  const monthlyTakeHomeInr = netMonthly * gbpToInr;
  const isNegativeSavings = monthlySavingsInr <= 0;
  const safeMonthlyInr = isNegativeSavings ? 1 : monthlySavingsInr;

  return {
    monthlyTakeHomeGbp: Math.round(netMonthly),
    monthlyTakeHomeInr: Math.round(monthlyTakeHomeInr),
    monthlyCostGbp: monthlyCost,
    monthlySavingsGbp: Math.round(monthlySavingsGbp),
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

// Formatting helpers used by multiple components
export function formatGbp(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",

    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatInrLakh(amount: number): string {
  const lakh = amount / 100000;
  return `₹${lakh.toFixed(2)}L`;
}

export function formatMonths(months: number): string {
  if (!isFinite(months)) return "N/A";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} month${rem !== 1 ? "s" : ""}`;
  if (rem === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years}y ${rem}m`;
}
