"use client";

import React from "react";
import type { CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { formatGbp } from "@/lib/calc/uk/taxCalculator";
import { AlertTriangle, MapPin, Coins, Wallet, Crown, Users, Home, Building2 } from "lucide-react";
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

interface Props {
  rows: CostOfLivingRow[];
  config: CountryConfig;
  selected: CostOfLivingRow;
  onChange: (row: CostOfLivingRow) => void;
}

const LIFESTYLE_DESCRIPTIONS: Record<LifestyleLevel, string> = {
  Basic: "Single, max savings — shared room, budget supermarkets",
  Moderate: "Settled, comfortable — 1BHK flat, mid-range spending",
  Premium: "Family, high quality — 2-3 bed, private health insurance",
};

export function CostOfLivingSelector({ rows, config, selected, onChange }: Props) {
  const handleChange = (city: string, lifestyle: LifestyleLevel, rent: RentType) => {
    const row = rows.find(
      (r) => r.city === city && r.lifestyleLevel === lifestyle && r.rentType === rent
    );
    if (row) onChange(row);
  };

  const breakdown = [
    { label: "Rent", value: selected.monthlyRent },
    { label: "Utilities & Council Tax", value: selected.monthlyUtilities },
    { label: "Transport", value: selected.monthlyTransport },
    { label: "Groceries", value: selected.monthlyGroceries },
    { label: "Dining Out", value: selected.monthlyDining },
    { label: "Healthcare", value: selected.monthlyHealthcare },
    { label: "Miscellaneous", value: selected.monthlyMisc },
  ].filter((item) => item.value > 0);

  return (
    <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
        3. Cost of Living
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
          description={LIFESTYLE_DESCRIPTIONS[selected.lifestyleLevel]}
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
        {breakdown.map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between px-4 py-2.5 text-sm"
            style={{ background: i % 2 === 0 ? "var(--neutral-50)" : "white" }}
          >
            <span style={{ color: "var(--neutral-600)" }}>{item.label}</span>
            <span className="tabular-nums font-medium" style={{ color: "var(--neutral-900)" }}>
              {formatGbp(item.value)}
            </span>
          </div>
        ))}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: "var(--primary-50)", borderTop: "1.5px solid var(--primary-100)" }}
        >
          <span className="font-semibold" style={{ color: "var(--primary-900)" }}>Total Monthly Cost</span>
          <span className="font-bold tabular-nums text-lg" style={{ color: "var(--primary-900)" }}>
            {formatGbp(selected.totalMonthlyCost)}
          </span>
        </div>
      </div>

      {/* Contextual warnings */}
      {selected.lifestyleLevel === "Premium" && selected.rentType === "Family (2-3 BHK)" && (
        <div
          className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
          style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
        >
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>Private school fees (£800–£2,000/month) are not included above. State school = £0.</span>
        </div>
      )}

      {selected.city === "Edinburgh" && (
        <div
          className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
          style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
        >
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>Edinburgh is in Scotland. Scottish Income Tax rates apply and differ from rUK rates shown in the tax breakdown above.</span>
        </div>
      )}
    </div>
  );
}
