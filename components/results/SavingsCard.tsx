"use client";

import type { SavingsResult } from "@/lib/calc/uk/taxCalculator";
import { formatGbp, formatInr, formatInrLakh } from "@/lib/calc/uk/taxCalculator";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  savings: SavingsResult;
  liveRate: number;
}

export function SavingsCard({ savings }: Props) {
  const isNeg = savings.isNegativeSavings;

  return (
    <div
      className="rounded-2xl p-6"
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
            {formatGbp(savings.monthlySavingsGbp)}
          </p>
          <p className="text-sm mt-3 font-medium" style={{ color: "var(--error-600)" }}>
            At this lifestyle + city combination, expenses exceed take-home pay. Consider a different city or accommodation type.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-4xl font-bold tabular-nums" style={{ color: "var(--success-600)" }}>
            {formatGbp(savings.monthlySavingsGbp)}
          </p>
          <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--neutral-700)" }}>
            {formatInrLakh(savings.monthlySavingsInr)}
          </p>
          <p className="text-sm tabular-nums" style={{ color: "var(--neutral-500)" }}>
            ({formatInr(savings.monthlySavingsInr)})
          </p>
        </div>
      )}

      {!isNeg && (
        <div className="mt-5 pt-4" style={{ borderTop: `1px solid rgba(26,122,74,0.15)` }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: "var(--neutral-600)" }}>Annual savings</span>
            <span className="tabular-nums font-semibold" style={{ color: "var(--success-600)" }}>
              {formatInrLakh(savings.monthlySavingsInr * 12)}/year
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
