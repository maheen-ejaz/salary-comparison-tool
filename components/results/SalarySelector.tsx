"use client";

import React from "react";
import type { SalaryBand } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { Info } from "lucide-react";
import { useMemo } from "react";
import { ChipSelect, getDisabledOptions } from "./ChipSelect";

interface Props {
  bands: SalaryBand[];
  config: CountryConfig;
  selectedBand: SalaryBand;
  salaryPoint: "min" | "typical" | "max";
  onBandChange: (band: SalaryBand) => void;
  onSalaryPointChange: (point: "min" | "typical" | "max") => void;
  formatCurrency: (amount: number) => string;
  /** Extra content rendered below the gross salary display (e.g. pension toggle, super info) */
  grossDisplayExtra?: React.ReactNode;
}

export function SalarySelector({
  bands,
  config,
  selectedBand,
  salaryPoint,
  onBandChange,
  onSalaryPointChange,
  formatCurrency,
  grossDisplayExtra,
}: Props) {
  const careerStages = [...new Set(bands.map((b) => b.careerStage))];

  const disabledSectors = useMemo(
    () => getDisabledOptions(bands, "careerStage", selectedBand.careerStage, config.sectors),
    [bands, selectedBand.careerStage, config.sectors],
  );
  const disabledCareerStages = useMemo(
    () => getDisabledOptions(bands, "sector", selectedBand.sector, careerStages),
    [bands, selectedBand.sector, careerStages],
  );

  const handleCareerChange = (stage: string) => {
    const band = bands.find((b) => b.careerStage === stage && b.sector === selectedBand.sector);
    if (band) {
      onBandChange(band);
    } else {
      const fallback = bands.find((b) => b.careerStage === stage);
      if (fallback) onBandChange(fallback);
    }
  };

  const handleSectorChange = (sector: string) => {
    const band = bands.find((b) => b.careerStage === selectedBand.careerStage && b.sector === sector);
    if (band) {
      onBandChange(band);
    } else {
      const fallback = bands.find((b) => b.sector === sector);
      if (fallback) onBandChange(fallback);
    }
  };

  const grossSalary =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  // FY1/FY2 have a single nodal point — min = typical = max
  const isSinglePoint = selectedBand.grossAnnualMin === selectedBand.grossAnnualMax;

  return (
    <div
      className="rounded-2xl p-8 bg-white"
      style={{ border: "1px solid var(--neutral-200)" }}
    >
      <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
        1. Your Salary
      </h2>

      <div className="space-y-4 mb-4">
        {/* Career Stage */}
        <ChipSelect
          label="Career Stage"
          options={careerStages.map((stage) => ({ value: stage, label: stage }))}
          selected={selectedBand.careerStage}
          onChange={handleCareerChange}
          disabledValues={disabledCareerStages}
        />

        {/* Sector */}
        <div>
          <ChipSelect
            label="Sector"
            options={config.sectors.map((sector) => ({ value: sector, label: sector }))}
            selected={selectedBand.sector}
            onChange={handleSectorChange}
            disabledValues={disabledSectors}
          />
          {selectedBand.estimationFlag && (
            <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--warning-600)" }}>
              <Info size={11} />
              Private sector figures are estimates — actual earnings vary widely by specialty
            </p>
          )}
        </div>
      </div>

      {/* Salary Point */}
      {!isSinglePoint && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: "var(--neutral-700)" }}>
            Salary Scenario
          </label>
          <div className="flex gap-2">
            {(["min", "typical", "max"] as const).map((point) => {
              const labels = { min: "Conservative", typical: "Typical", max: "Optimistic" };
              const values = {
                min: selectedBand.grossAnnualMin,
                typical: selectedBand.grossAnnualTypical,
                max: selectedBand.grossAnnualMax,
              };
              const isActive = salaryPoint === point;
              const unselectedStyles: Record<string, { bg: string; color: string; border: string }> = {
                min: { bg: "var(--primary-100)", color: "var(--primary-700)", border: "var(--primary-200)" },
                typical: { bg: "var(--neutral-100)", color: "var(--neutral-600)", border: "var(--neutral-200)" },
                max: { bg: "var(--success-100)", color: "var(--success-600)", border: "var(--success-200)" },
              };
              const inactive = unselectedStyles[point];
              return (
                <button
                  key={point}
                  onClick={() => onSalaryPointChange(point)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all text-center cursor-pointer"
                  style={{
                    background: isActive ? "var(--primary-700)" : inactive.bg,
                    color: isActive ? "white" : inactive.color,
                    border: isActive ? "1.5px solid var(--primary-700)" : `1.5px solid ${inactive.border}`,
                  }}
                >
                  <div>{labels[point]}</div>
                  <div className="text-xs tabular-nums font-normal opacity-80">{formatCurrency(values[point])}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gross display */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--primary-50)", border: "1px solid var(--primary-100)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Gross Annual Salary</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--primary-900)" }}>
              {formatCurrency(grossSalary)}
            </p>
          </div>
        </div>
        {grossDisplayExtra}
        <p className="text-[10px] mt-2" style={{ color: "var(--neutral-400)" }}>
          Salary figures are estimates. Actual earnings vary by specialty and employer.
        </p>
      </div>
    </div>
  );
}
