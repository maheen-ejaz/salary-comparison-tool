"use client";

import React from "react";
import { formatInr, formatInrLakh } from "@/lib/calc/uk/taxCalculator";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SavingsWaterfallChart } from "@/components/charts/SavingsWaterfallChart";

const INDIAN_PG_MONTHLY_INR = 70000;

interface Props {
  monthlySavingsLocal: number;
  monthlySavingsInr: number;
  monthlyTakeHomeLocal: number;
  monthlyCostLocal: number;
  isNegativeSavings: boolean;
  formatCurrency: (amount: number) => string;
  variant?: "standard" | "grid";
  /** Recovery time data for inline display in grid variant */
  recoveryMonths?: { min: number; typical: number; max: number };
}

export function SavingsCard({
  monthlySavingsLocal,
  monthlySavingsInr,
  monthlyTakeHomeLocal,
  monthlyCostLocal,
  isNegativeSavings,
  formatCurrency,
  variant = "standard",
  recoveryMonths,
}: Props) {
  const isNeg = isNegativeSavings;

  if (variant === "grid") {
    return (
      <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
          5. Savings Potential
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
              Monthly Savings
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)" }}>
                {isNeg && <>-</>}
                {formatInr(Math.abs(monthlySavingsInr))}
              </p>
              {isNeg ? (
                <TrendingDown size={20} style={{ color: "var(--error-600)" }} className="mb-1" />
              ) : (
                <TrendingUp size={20} style={{ color: "var(--success-600)" }} className="mb-1" />
              )}
            </div>
            <p className="text-sm mt-0.5" style={{ color: "var(--neutral-600)" }}>
              {formatCurrency(Math.abs(monthlySavingsLocal))} /month
            </p>
          </div>

          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
              Annual Savings Potential
            </p>
            <p className="text-3xl font-bold" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)" }}>
              {isNeg && <>-</>}
              {formatInr(Math.abs(monthlySavingsInr * 12))}
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--neutral-600)" }}>
              INR {Math.round(Math.abs(monthlySavingsInr * 12) / 100000)}L per year
            </p>
          </div>
        </div>

        {!isNeg && (
          <p className="text-xs text-center mb-4" style={{ color: "var(--neutral-500)" }}>
            Equivalent to ~{Math.max(1, Math.round(Math.abs(monthlySavingsInr * 12) / INDIAN_PG_MONTHLY_INR))} months of an Indian PG stipend (INR 70,000/mo)
          </p>
        )}

        <SavingsWaterfallChart
          netMonthly={monthlyTakeHomeLocal}
          totalMonthlyCost={monthlyCostLocal}
          monthlySavings={monthlyTakeHomeLocal - monthlyCostLocal}
          isNegativeSavings={isNeg}
          formatCurrency={formatCurrency}
        />

        {!isNeg && recoveryMonths && (
          <div className="p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "var(--neutral-700)" }}>
              Migration Cost Recovery Time
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Conservative</p>
                <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                  {recoveryMonths.max >= 999 ? "N/A" : `${recoveryMonths.max}m`}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Typical</p>
                <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                  {recoveryMonths.typical >= 999 ? "N/A" : `${recoveryMonths.typical}m`}
                </p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Optimistic</p>
                <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                  {recoveryMonths.min >= 999 ? "N/A" : `${recoveryMonths.min}m`}
                </p>
              </div>
            </div>
          </div>
        )}

        {isNeg && (
          <div className="p-4 rounded-lg" style={{ background: "var(--warning-50)", border: "1px solid var(--warning-200)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--warning-600)" }}>
              Your selected cost of living exceeds your net salary. Consider adjusting your lifestyle or salary expectations.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default: standard variant (UK/AU/CA/DE)
  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: isNeg ? "var(--error-100)" : "var(--success-100)",
        border: `1px solid ${isNeg ? "var(--error-600)" : "var(--success-600)"}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg font-bold" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)" }}>
          Monthly Savings
        </h2>
        {isNeg ? (
          <TrendingDown size={20} style={{ color: "var(--error-600)" }} />
        ) : (
          <TrendingUp size={20} style={{ color: "var(--success-600)" }} />
        )}
      </div>
      <p className="text-sm mb-5" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)", opacity: 0.8 }}>
        Take-home minus estimated living costs
      </p>

      {isNeg ? (
        <div>
          <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--error-600)" }}>
            {formatCurrency(monthlySavingsLocal)}
          </p>
          <p className="text-sm mt-3 font-medium" style={{ color: "var(--error-600)" }}>
            At this lifestyle + city combination, expenses exceed take-home pay. Consider a different city or accommodation type.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-4xl font-bold tabular-nums" style={{ color: "var(--success-600)" }}>
            {formatCurrency(monthlySavingsLocal)}
          </p>
          <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--neutral-700)" }}>
            {formatInrLakh(monthlySavingsInr)}
          </p>
          <p className="text-sm tabular-nums" style={{ color: "var(--neutral-500)" }}>
            ({formatInr(monthlySavingsInr)})
          </p>
        </div>
      )}

      <SavingsWaterfallChart
        netMonthly={monthlyTakeHomeLocal}
        totalMonthlyCost={monthlyCostLocal}
        monthlySavings={monthlySavingsLocal}
        isNegativeSavings={isNeg}
        formatCurrency={formatCurrency}
      />

      {!isNeg && (
        <div
          className="mt-5 p-4 rounded-xl text-center"
          style={{ background: "rgba(26,122,74,0.08)", border: "1px solid var(--success-600)" }}
        >
          <p className="text-xs font-medium mb-1" style={{ color: "var(--success-600)" }}>
            Annual Savings Potential
          </p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--success-600)" }}>
            {formatInrLakh(monthlySavingsInr * 12)}/year
          </p>
          <p className="text-sm tabular-nums mt-0.5" style={{ color: "var(--neutral-600)" }}>
            {formatCurrency(Math.abs(monthlySavingsLocal * 12))}/year
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--neutral-500)" }}>
            Equivalent to ~{Math.max(1, Math.round(Math.abs(monthlySavingsInr * 12) / INDIAN_PG_MONTHLY_INR))} months of an Indian PG stipend (INR 70,000/mo)
          </p>
        </div>
      )}
    </div>
  );
}
