"use client";

import type { TaxBreakdown } from "@/lib/calc/uk/taxCalculator";
import { formatGbp, formatInr } from "@/lib/calc/uk/taxCalculator";

interface Props {
  breakdown: TaxBreakdown;
  liveRate: number;
}

export function TakeHomeCard({ breakdown, liveRate }: Props) {
  const monthlyInr = Math.round(breakdown.netMonthly * liveRate);

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--primary-900)", border: "1px solid var(--primary-700)" }}
    >
      <h2 className="text-lg font-bold mb-1 text-white">Monthly Take-Home</h2>
      <p className="text-sm mb-6" style={{ color: "var(--primary-200)" }}>
        After Income Tax, NI{breakdown.nhsPension > 0 ? " & NHS Pension" : ""}
      </p>

      <div className="space-y-1 mb-6">
        <p className="text-4xl font-bold tabular-nums text-white">
          {formatGbp(breakdown.netMonthly)}
        </p>
        <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent-400)" }}>
          {formatInr(monthlyInr)}
        </p>
      </div>

      <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--primary-200)" }}>Annual take-home</span>
          <span className="tabular-nums text-white">{formatGbp(breakdown.netAnnual)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--primary-200)" }}>Total deductions</span>
          <span className="tabular-nums" style={{ color: "#ff9999" }}>{formatGbp(breakdown.totalDeductions)}</span>
        </div>
      </div>
    </div>
  );
}
