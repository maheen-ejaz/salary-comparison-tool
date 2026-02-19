"use client";

import { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { calculateUkTakeHome, calculateSavings } from "@/lib/calc/uk/taxCalculator";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import { SalarySelector } from "./SalarySelector";
import { TaxBreakdownCard } from "./TaxBreakdownCard";
import { TakeHomeCard } from "./TakeHomeCard";
import { CostOfLivingSelector } from "./CostOfLivingSelector";
import { SavingsCard } from "./SavingsCard";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { DisclaimerBanner } from "./DisclaimerBanner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  data: CountryData;
  config: CountryConfig;
  leadName: string;
  liveRate: number;
  rateIsLive: boolean;
  rateDate: string;
  allCountryData: Record<string, CountryData>;
  allRates: Record<string, number>;
}

export function ResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  // User selections
  const [selectedBand, setSelectedBand] = useState<SalaryBand>(
    data.salaryBands.find((b) => b.careerStage === "Junior Doctor (FY1)" && b.sector === "Public (NHS)")!
  );
  const [salaryPoint, setSalaryPoint] = useState<"min" | "typical" | "max">("typical");
  const [includeNhsPension, setIncludeNhsPension] = useState(true);
  const [selectedCoL, setSelectedCoL] = useState<CostOfLivingRow>(
    data.costOfLiving.find(
      (r) => r.city === "London" && r.lifestyleLevel === "Moderate" && r.rentType === "1BHK"
    )!
  );

  const grossAnnual =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  const taxBreakdown = useMemo(
    () => calculateUkTakeHome({ grossAnnual, taxRules: data.taxRules, includeNhsPension }),
    [grossAnnual, data.taxRules, includeNhsPension]
  );

  const savings = useMemo(
    () =>
      calculateSavings(
        taxBreakdown.netMonthly,
        selectedCoL.totalMonthlyCost,
        liveRate,
        data.migrationCosts
      ),
    [taxBreakdown.netMonthly, selectedCoL.totalMonthlyCost, liveRate, data.migrationCosts]
  );

  const comparisonRows = useMemo(
    () =>
      computeComparisonRows({
        currentCountry: "uk",
        currentCareerStage: selectedBand.careerStage,
        currentSalaryPoint: salaryPoint,
        currentNetMonthly: taxBreakdown.netMonthly,
        currentMonthlyCost: selectedCoL.totalMonthlyCost,
        currentCity: selectedCoL.city,
        currentLifestyle: selectedCoL.lifestyleLevel,
        currentRentType: selectedCoL.rentType,
        allCountryData,
        allRates,
      }),
    [selectedBand.careerStage, salaryPoint, taxBreakdown.netMonthly, selectedCoL.totalMonthlyCost, selectedCoL.city, selectedCoL.lifestyleLevel, selectedCoL.rentType, allCountryData, allRates]
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-10" style={{ background: "var(--primary-900)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--accent-400)", color: "var(--primary-900)" }}
            >
              GC
            </div>
            <span className="text-white font-semibold text-lg">GCWorld Salary Comparison Tool</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Change country
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your UK breakdown` : "Your UK Salary Breakdown"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
            Adjust the options below to match your situation. Everything updates instantly.
          </p>
        </div>

        {/* Rate info */}
        <div
          className="text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2"
          style={{
            background: rateIsLive ? "var(--success-100)" : "var(--warning-100)",
            color: rateIsLive ? "var(--success-600)" : "var(--warning-600)",
          }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${rateIsLive ? "bg-green-500" : "bg-amber-500"}`} />
          Exchange rate: £1 = ₹{liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
        </div>

        {/* Salary Selector */}
        <SalarySelector
          bands={data.salaryBands}
          config={config}
          selectedBand={selectedBand}
          salaryPoint={salaryPoint}
          includeNhsPension={includeNhsPension}
          onBandChange={setSelectedBand}
          onSalaryPointChange={setSalaryPoint}
          onPensionToggle={setIncludeNhsPension}
        />

        {/* Tax + Take-Home row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaxBreakdownCard
            breakdown={taxBreakdown}
            selectedCity={selectedCoL.city}
          />
          <TakeHomeCard
            breakdown={taxBreakdown}
            liveRate={liveRate}
          />
        </div>

        {/* CoL Selector */}
        <CostOfLivingSelector
          rows={data.costOfLiving}
          config={config}
          selected={selectedCoL}
          onChange={setSelectedCoL}
        />

        {/* Savings + Timeline row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SavingsCard savings={savings} liveRate={liveRate} />
          <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <CountryComparisonTable
          rows={comparisonRows}
          currentCountryCode="uk"
        />

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
