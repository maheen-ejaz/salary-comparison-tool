"use client";

import type { SavingsWaterfallChartProps } from "./types";

export function SavingsWaterfallChart({
  netMonthly,
  totalMonthlyCost,
  monthlySavings,
  isNegativeSavings,
  formatCurrency,
}: SavingsWaterfallChartProps) {
  if (netMonthly <= 0) return null;

  const expensesPct = Math.min((totalMonthlyCost / netMonthly) * 100, 100);
  const savingsPct = isNegativeSavings ? 0 : 100 - expensesPct;

  return (
    <div className="mt-5">
      <p className="text-xs font-medium mb-2" style={{ color: "var(--neutral-500)" }}>
        Income Breakdown
      </p>

      {/* Stacked bar */}
      <div
        className="w-full h-8 rounded-lg overflow-hidden flex"
        style={{ background: "var(--neutral-100)" }}
      >
        {/* Expenses segment */}
        <div
          className="h-full flex items-center justify-center text-xs font-semibold transition-all"
          style={{
            width: `${expensesPct}%`,
            background: isNegativeSavings ? "var(--error-600)" : "var(--warning-600)",
            color: "white",
            minWidth: expensesPct > 0 ? "40px" : 0,
          }}
        >
          {expensesPct >= 15 && formatCurrency(totalMonthlyCost)}
        </div>

        {/* Savings segment */}
        {savingsPct > 0 && (
          <div
            className="h-full flex items-center justify-center text-xs font-semibold transition-all"
            style={{
              width: `${savingsPct}%`,
              background: "var(--success-600)",
              color: "white",
              minWidth: savingsPct > 0 ? "40px" : 0,
            }}
          >
            {savingsPct >= 15 && formatCurrency(monthlySavings)}
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: isNegativeSavings ? "var(--error-600)" : "var(--warning-600)" }}
          />
          <span style={{ color: "var(--neutral-600)" }}>
            Expenses {isNegativeSavings && "(exceeds income)"}
          </span>
        </div>
        {!isNegativeSavings && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--success-600)" }}
            />
            <span style={{ color: "var(--neutral-600)" }}>
              Savings ({Math.round(savingsPct)}%)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
