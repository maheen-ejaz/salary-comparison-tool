"use client";

import type { TaxBreakdown } from "@/lib/calc/uk/taxCalculator";
import { formatGbp } from "@/lib/calc/uk/taxCalculator";
import { AlertTriangle } from "lucide-react";

interface Props {
  breakdown: TaxBreakdown;
  selectedCity: string;
}

export function TaxBreakdownCard({ breakdown, selectedCity }: Props) {
  const rows = [
    { label: "Gross Annual Salary", value: breakdown.grossAnnual, isGross: true },
    { label: "Income Tax", value: -breakdown.incomeTax, isDeduction: true },
    { label: "National Insurance", value: -breakdown.nationalInsurance, isDeduction: true },
    ...(breakdown.nhsPension > 0
      ? [{ label: `NHS Pension (Tier ${tierLabel(breakdown.nhsPensionTierRate)}, ${breakdown.nhsPensionTierRate}%)`, value: -breakdown.nhsPension, isDeduction: true }]
      : []),
  ];

  return (
    <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
      <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
        2. Tax Breakdown
      </h2>

      <div className="space-y-2 mb-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--neutral-100)" }}>
            <span className="text-sm" style={{ color: row.isGross ? "var(--neutral-900)" : "var(--neutral-600)" }}>
              {row.label}
            </span>
            <span
              className="text-sm font-semibold tabular-nums"
              style={{ color: row.isDeduction ? "var(--error-600)" : "var(--neutral-900)" }}
            >
              {row.isDeduction ? "−" : ""}{formatGbp(Math.abs(row.value))}
            </span>
          </div>
        ))}

        {/* Net */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold" style={{ color: "var(--neutral-900)" }}>Net Annual</span>
          <span className="font-bold text-lg tabular-nums" style={{ color: "var(--success-600)" }}>
            {formatGbp(breakdown.netAnnual)}
          </span>
        </div>
      </div>

      <div
        className="text-xs px-3 py-2 rounded-lg"
        style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
      >
        Effective tax rate: <strong>{breakdown.effectiveTaxRate}%</strong> of gross salary
      </div>

      {/* Warnings */}
      {breakdown.isInPersonalAllowanceWithdrawalZone && (
        <div
          className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
          style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
        >
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>Your salary is in the personal allowance withdrawal zone (£100k–£125,140). Effective marginal rate is 60% in this band.</span>
        </div>
      )}

      {selectedCity === "Edinburgh" && (
        <div
          className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
          style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
        >
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>Edinburgh doctors pay Scottish Income Tax rates, which differ from figures shown. Verify at <strong>mygov.scot</strong></span>
        </div>
      )}
    </div>
  );
}

function tierLabel(rate: number): string {
  const tiers: Record<number, string> = { 5.2: "1", 6.5: "2", 8.3: "3", 9.8: "4", 10.7: "5", 12.5: "6" };
  return tiers[rate] ?? "?";
}
