"use client";

import React from "react";
import type { CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { Info, MapPin, Coins, Wallet, Crown, Users, Home, Building2 } from "lucide-react";
import { ChipSelect } from "./ChipSelect";

const LIFESTYLE_ICONS: Record<string, React.ReactNode> = {
  Basic: <Coins size={14} />,
  Moderate: <Wallet size={14} />,
  Premium: <Crown size={14} />,
};

const RENT_ICONS: Record<string, React.ReactNode> = {
  "Shared Accommodation": <Users size={14} />,
  "1BHK": <Home size={14} />,
  "Family (2-3 BHK)": <Building2 size={14} />,
};

const DEFAULT_LIFESTYLE_DESCRIPTIONS: Record<LifestyleLevel, string> = {
  Basic: "Single, max savings — shared room, budget supermarkets",
  Moderate: "Settled, comfortable — 1BHK flat, mid-range spending",
  Premium: "Family, high quality — 2-3 bed, private health insurance",
};

export interface CostBreakdownItem {
  label: string;
  value: number;
}

interface Props {
  title?: string;
  rows: CostOfLivingRow[];
  config: CountryConfig;
  selected: CostOfLivingRow;
  onChange: (row: CostOfLivingRow) => void;
  formatCurrency: (amount: number) => string;
  breakdownItems: CostBreakdownItem[];
  lifestyleDescriptions?: Record<LifestyleLevel, string>;
  warnings?: React.ReactNode[];
  netMonthly?: number;
}

export function CostOfLivingSelector({
  title = "3. Cost of Living",
  rows,
  config,
  selected,
  onChange,
  formatCurrency,
  breakdownItems,
  lifestyleDescriptions = DEFAULT_LIFESTYLE_DESCRIPTIONS,
  warnings,
  netMonthly,
}: Props) {
  const handleChange = (city: string, lifestyle: LifestyleLevel, rent: RentType) => {
    const row = rows.find(
      (r) => r.city === city && r.lifestyleLevel === lifestyle && r.rentType === rent
    );
    if (row) onChange(row);
  };

  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
        {title}
      </h2>

      <div className="space-y-4 mb-5">
        {/* City */}
        <ChipSelect
          label="City"
          options={config.cities.map((city) => ({ value: city, label: city, icon: <MapPin size={14} /> }))}
          selected={selected.city}
          onChange={(city) => handleChange(city, selected.lifestyleLevel, selected.rentType)}
        />

        {/* Lifestyle */}
        <ChipSelect
          label="Lifestyle"
          options={config.lifestyleLevels.map((level) => ({ value: level, label: level, icon: LIFESTYLE_ICONS[level] }))}
          selected={selected.lifestyleLevel}
          onChange={(level) => handleChange(selected.city, level as LifestyleLevel, selected.rentType)}
          description={lifestyleDescriptions[selected.lifestyleLevel]}
        />

        {/* Accommodation */}
        <ChipSelect
          label="Accommodation"
          options={config.rentTypes.map((type) => ({ value: type, label: type, icon: RENT_ICONS[type] }))}
          selected={selected.rentType}
          onChange={(rent) => handleChange(selected.city, selected.lifestyleLevel, rent as RentType)}
        />
      </div>

      {/* Cost breakdown */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--neutral-100)" }}>
        {breakdownItems.map((item, i) => {
          const pct = selected.totalMonthlyCost > 0 ? (item.value / selected.totalMonthlyCost) * 100 : 0;
          return (
            <div
              key={item.label}
              className="px-4 py-2.5 text-sm"
              style={{ background: i % 2 === 0 ? "var(--neutral-50)" : "white" }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--neutral-600)" }}>{item.label}</span>
                <span className="tabular-nums font-medium flex items-baseline gap-1.5" style={{ color: "var(--neutral-900)" }}>
                  {formatCurrency(item.value)}
                  <span className="text-xs font-normal" style={{ color: "var(--neutral-400)" }}>
                    ({Math.round(pct)}%)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-1 rounded-full" style={{ background: "var(--neutral-200)" }}>
                <div
                  className="h-1 rounded-full transition-all"
                  style={{ width: `${pct}%`, background: "var(--primary-500)" }}
                />
              </div>
            </div>
          );
        })}
        <div
          className="px-4 py-3"
          style={{ background: "var(--primary-50)", borderTop: "1.5px solid var(--primary-100)" }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ color: "var(--primary-900)" }}>Total Monthly Cost</span>
            <span className="font-bold tabular-nums text-lg" style={{ color: "var(--primary-900)" }}>
              {formatCurrency(selected.totalMonthlyCost)}
            </span>
          </div>
          {netMonthly != null && netMonthly > 0 && (
            <p
              className="text-xs mt-1 text-right"
              style={{
                color:
                  selected.totalMonthlyCost / netMonthly > 1
                    ? "var(--error-600)"
                    : selected.totalMonthlyCost / netMonthly > 0.8
                    ? "var(--warning-600)"
                    : "var(--neutral-500)",
              }}
            >
              {Math.round((selected.totalMonthlyCost / netMonthly) * 100)}% of take-home pay
            </p>
          )}
        </div>
      </div>

      {/* Country-specific warnings */}
      {warnings?.map((warning, i) => (
        <React.Fragment key={i}>{warning}</React.Fragment>
      ))}

      <div
        className="mt-4 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
        style={{ background: "var(--neutral-50)", color: "var(--neutral-500)" }}
      >
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>These figures are representational estimates based on city averages. Actual costs vary significantly depending on your specific city area, lifestyle choices, and accommodation. We recommend doing your own research for real-time figures before making any decisions.</span>
      </div>
    </div>
  );
}
