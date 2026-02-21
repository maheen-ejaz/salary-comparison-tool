"use client";

import React from "react";
import { formatInr } from "@/lib/calc/uk/taxCalculator";

interface ExtraRow {
  label: string;
  value: string;
  color?: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  netMonthly: number;
  netMonthlyInr: number;
  netAnnual: number;
  totalDeductions: number;
  formatCurrency: (amount: number) => string;
  extraRows?: ExtraRow[];
  variant?: "dark" | "grid";
  currencyLabel?: string; // e.g. "NZD", "AED" for grid variant header
}

export function TakeHomeCard({
  title = "Monthly Take-Home",
  subtitle,
  netMonthly,
  netMonthlyInr,
  netAnnual,
  totalDeductions,
  formatCurrency,
  extraRows,
  variant = "dark",
  currencyLabel,
}: Props) {
  if (variant === "grid") {
    return (
      <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
          {title}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
              Monthly ({currencyLabel ?? "Local"})
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
              {formatCurrency(netMonthly)}
            </p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "var(--accent-50)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
              Monthly (INR)
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
              {formatInr(netMonthlyInr)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: dark variant (UK/AU/CA/DE)
  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: "var(--primary-900)", border: "1px solid var(--primary-700)" }}
    >
      <h2 className="text-lg font-bold mb-1 text-white">{title}</h2>
      {subtitle && (
        <p className="text-sm mb-6" style={{ color: "var(--primary-200)" }}>
          {subtitle}
        </p>
      )}

      <div className="space-y-1 mb-6">
        <p className="text-4xl font-bold tabular-nums text-white">
          {formatCurrency(netMonthly)}
        </p>
        <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent-400)" }}>
          {formatInr(netMonthlyInr)}
        </p>
      </div>

      <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--primary-200)" }}>Annual take-home</span>
          <span className="tabular-nums text-white">{formatCurrency(netAnnual)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--primary-200)" }}>Total deductions</span>
          <span className="tabular-nums" style={{ color: "#ff9999" }}>{formatCurrency(totalDeductions)}</span>
        </div>
        {extraRows?.map((row) => (
          <div key={row.label} className="flex justify-between text-sm">
            <span style={{ color: "var(--primary-200)" }}>{row.label}</span>
            <span className="tabular-nums" style={{ color: row.color ?? "var(--primary-200)" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
