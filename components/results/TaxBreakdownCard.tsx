"use client";

import React from "react";
import { DonutChart } from "@/components/charts/DonutChart";
import type { DonutSlice } from "@/components/charts/types";

export interface TaxRow {
  label: string;
  value: number; // negative for deductions
  isGross?: boolean;
  isDeduction?: boolean;
  isInfo?: boolean; // for rows like AU's "Superannuation (employer-paid)"
}

interface Props {
  title?: string;
  rows: TaxRow[];
  netAnnual: number;
  grossAnnual: number;
  effectiveTaxRate: number;
  donutSlices: DonutSlice[];
  donutCenterLabel?: string;
  donutCenterValue: string;
  formatCurrency: (amount: number) => string;
  warnings?: React.ReactNode[];
  infoNotes?: React.ReactNode[];
}

export function TaxBreakdownCard({
  title = "2. Tax Breakdown",
  rows,
  netAnnual,
  grossAnnual,
  effectiveTaxRate,
  donutSlices,
  donutCenterLabel = "Take-Home",
  donutCenterValue,
  formatCurrency,
  warnings,
  infoNotes,
}: Props) {
  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
        {title}
      </h2>

      <DonutChart
        slices={donutSlices}
        grossTotal={grossAnnual}
        centerLabel={donutCenterLabel}
        centerValue={donutCenterValue}
        formatValue={formatCurrency}
      />

      <div className="space-y-2 mb-4">
        {rows.map((row) => {
          const pctOfGross = row.isDeduction && grossAnnual > 0
            ? (Math.abs(row.value) / grossAnnual * 100).toFixed(1)
            : null;
          return (
            <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--neutral-100)" }}>
              <span className="text-sm" style={{ color: row.isGross ? "var(--neutral-900)" : row.isInfo ? "var(--neutral-400)" : "var(--neutral-600)" }}>
                {row.label}
                {row.isInfo && (
                  <span className="ml-1 inline-flex">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </span>
                )}
              </span>
              <span className="text-sm font-semibold tabular-nums flex items-baseline gap-1.5">
                <span style={{ color: row.isDeduction ? "var(--error-600)" : row.isInfo ? "var(--neutral-400)" : "var(--neutral-900)" }}>
                  {row.isDeduction ? "−" : row.isInfo ? "+" : ""}{formatCurrency(Math.abs(row.value))}
                </span>
                {pctOfGross && (
                  <span className="text-xs font-normal" style={{ color: "var(--neutral-400)" }}>
                    ({pctOfGross}%)
                  </span>
                )}
              </span>
            </div>
          );
        })}

        {/* Net */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold" style={{ color: "var(--neutral-900)" }}>Net Annual</span>
          <span className="font-bold text-lg tabular-nums" style={{ color: "var(--success-600)" }}>
            {formatCurrency(netAnnual)}
          </span>
        </div>
      </div>

      <div
        className="text-xs px-3 py-2 rounded-lg"
        style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
      >
        Effective tax rate: <strong>{effectiveTaxRate}%</strong> of gross salary
      </div>

      {/* Country-specific warnings */}
      {warnings?.map((warning, i) => (
        <React.Fragment key={i}>{warning}</React.Fragment>
      ))}

      {/* Country-specific info notes */}
      {infoNotes?.map((note, i) => (
        <React.Fragment key={i}>{note}</React.Fragment>
      ))}
    </div>
  );
}
