"use client";

import type { SalaryBand } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { formatGbp } from "@/lib/calc/uk/taxCalculator";
import { Info } from "lucide-react";

interface Props {
  bands: SalaryBand[];
  config: CountryConfig;
  selectedBand: SalaryBand;
  salaryPoint: "min" | "typical" | "max";
  includeNhsPension: boolean;
  onBandChange: (band: SalaryBand) => void;
  onSalaryPointChange: (point: "min" | "typical" | "max") => void;
  onPensionToggle: (include: boolean) => void;
}

export function SalarySelector({
  bands,
  config,
  selectedBand,
  salaryPoint,
  includeNhsPension,
  onBandChange,
  onSalaryPointChange,
  onPensionToggle,
}: Props) {
  const careerStages = [...new Set(bands.map((b) => b.careerStage))];

  const handleCareerChange = (stage: string) => {
    const band = bands.find((b) => b.careerStage === stage && b.sector === selectedBand.sector);
    if (band) onBandChange(band);
  };

  const handleSectorChange = (sector: string) => {
    const band = bands.find((b) => b.careerStage === selectedBand.careerStage && b.sector === sector);
    if (band) onBandChange(band);
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
      className="rounded-2xl p-6 bg-white"
      style={{ border: "1px solid var(--neutral-200)" }}
    >
      <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
        1. Your Salary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Career Stage */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
            Career Stage
          </label>
          <select
            value={selectedBand.careerStage}
            onChange={(e) => handleCareerChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)", color: "var(--neutral-900)" }}
          >
            {careerStages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Sector */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
            Sector
          </label>
          <select
            value={selectedBand.sector}
            onChange={(e) => handleSectorChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
            style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)", color: "var(--neutral-900)" }}
          >
            {config.sectors.map((sector) => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
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
              return (
                <button
                  key={point}
                  onClick={() => onSalaryPointChange(point)}
                  className="flex-1 py-2 rounded-lg text-sm font-medium transition-all text-center"
                  style={{
                    background: salaryPoint === point ? "var(--primary-700)" : "var(--neutral-100)",
                    color: salaryPoint === point ? "white" : "var(--neutral-600)",
                    border: salaryPoint === point ? "1.5px solid var(--primary-700)" : "1.5px solid var(--neutral-200)",
                  }}
                >
                  <div>{labels[point]}</div>
                  <div className="text-xs tabular-nums font-normal opacity-80">{formatGbp(values[point])}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Gross display + pension toggle */}
      <div
        className="flex items-center justify-between rounded-xl px-4 py-3"
        style={{ background: "var(--primary-50)", border: "1px solid var(--primary-100)" }}
      >
        <div>
          <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Gross Annual Salary</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--primary-900)" }}>
            {formatGbp(grossSalary)}
          </p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--neutral-700)" }}>
          <span>Include NHS Pension</span>
          <div
            onClick={() => onPensionToggle(!includeNhsPension)}
            className="relative w-10 h-5.5 rounded-full cursor-pointer transition-colors"
            style={{ background: includeNhsPension ? "var(--primary-700)" : "var(--neutral-300)", width: 40, height: 22 }}
          >
            <div
              className="absolute top-0.5 rounded-full bg-white transition-transform shadow"
              style={{
                width: 18,
                height: 18,
                left: includeNhsPension ? 20 : 2,
                transition: "left 0.15s ease",
              }}
            />
          </div>
        </label>
      </div>
    </div>
  );
}
