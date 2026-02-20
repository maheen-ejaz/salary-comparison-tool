"use client";

import type { ReactNode } from "react";
import type { SalaryBand } from "@/lib/data/types";

export interface ChipOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface ChipSelectProps {
  label: string;
  options: ChipOption[];
  selected: string;
  onChange: (value: string) => void;
  description?: string;
  disabledValues?: Set<string>;
}

/**
 * Given salary bands and a fixed dimension value, returns the Set of
 * option values from the other dimension that have no matching band.
 */
export function getDisabledOptions(
  bands: SalaryBand[],
  fixedKey: "careerStage" | "sector",
  fixedValue: string,
  allOptions: string[],
): Set<string> {
  const otherKey = fixedKey === "careerStage" ? "sector" : "careerStage";
  const available = new Set(
    bands.filter((b) => b[fixedKey] === fixedValue).map((b) => b[otherKey]),
  );
  return new Set(allOptions.filter((opt) => !available.has(opt)));
}

export function ChipSelect({ label, options, selected, onChange, description, disabledValues = new Set() }: ChipSelectProps) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--neutral-700)" }}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === selected;
          const isDisabled = disabledValues.has(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !isDisabled && onChange(option.value)}
              disabled={isDisabled}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              style={{
                background: isDisabled ? "var(--neutral-100)" : isSelected ? "var(--primary-700)" : "var(--neutral-100)",
                color: isDisabled ? "var(--neutral-300)" : isSelected ? "white" : "var(--neutral-700)",
                border: isDisabled ? "1.5px solid var(--neutral-200)" : isSelected ? "1.5px solid var(--primary-700)" : "1.5px solid var(--neutral-200)",
                opacity: isDisabled ? 0.5 : 1,
              }}
              title={isDisabled ? "Not available for this career stage" : undefined}
            >
              {option.icon && <span className="shrink-0" style={{ opacity: isDisabled ? 0.3 : isSelected ? 1 : 0.7 }}>{option.icon}</span>}
              {option.label}
            </button>
          );
        })}
      </div>
      {description && (
        <p className="mt-1.5 text-xs" style={{ color: "var(--neutral-400)" }}>
          {description}
        </p>
      )}
    </div>
  );
}
