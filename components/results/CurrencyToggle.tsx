"use client";

import React from "react";

interface Props {
  localLabel: string;
  displayCurrency: "local" | "inr";
  onChange: (mode: "local" | "inr") => void;
}

export function CurrencyToggle({ localLabel, displayCurrency, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden" style={{ border: "1px solid var(--neutral-200)" }}>
      <button
        onClick={() => onChange("local")}
        className="px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
        style={{
          background: displayCurrency === "local" ? "var(--primary-700)" : "white",
          color: displayCurrency === "local" ? "white" : "var(--neutral-600)",
        }}
      >
        {localLabel}
      </button>
      <button
        onClick={() => onChange("inr")}
        className="px-3 py-1 text-xs font-medium transition-colors cursor-pointer"
        style={{
          background: displayCurrency === "inr" ? "var(--primary-700)" : "white",
          color: displayCurrency === "inr" ? "white" : "var(--neutral-600)",
          borderLeft: "1px solid var(--neutral-200)",
        }}
      >
        INR
      </button>
    </div>
  );
}
