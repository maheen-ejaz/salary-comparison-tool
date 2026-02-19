"use client";

import { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateNzTakeHome,
  calculateNzSavings,
  formatNzd,
  formatInr,
} from "@/lib/calc/nz/taxCalculator";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import Link from "next/link";
import { ArrowLeft, Info, TrendingUp, TrendingDown } from "lucide-react";

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

const LIFESTYLE_DESCRIPTIONS: Record<LifestyleLevel, string> = {
  Basic: "Single, max savings — shared room, budget supermarkets",
  Moderate: "Settled, comfortable — 1BHK flat, mid-range spending",
  Premium: "Family, high quality — 2-3 bed, premium amenities",
};

export function NzResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Medical Officer / PGY2-3" && b.sector === "Public (DHB/Te Whatu Ora)"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Auckland" && r.lifestyleLevel === "Moderate" && r.rentType === "1BHK"
  )!;

  const [selectedBand, setSelectedBand] = useState<SalaryBand>(defaultBand);
  const [salaryPoint, setSalaryPoint] = useState<"min" | "typical" | "max">("typical");
  const [selectedCoL, setSelectedCoL] = useState<CostOfLivingRow>(defaultCoL);

  const grossAnnual =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  const taxBreakdown = useMemo(
    () => calculateNzTakeHome(grossAnnual, data.taxRules, true),
    [grossAnnual, data.taxRules]
  );

  const savings = useMemo(
    () =>
      calculateNzSavings(
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
        currentCountry: "nz",
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

  // Salary selector helpers
  const careerStages = [...new Set(data.salaryBands.map((b) => b.careerStage))];

  const handleCareerChange = (stage: string) => {
    const band = data.salaryBands.find((b) => b.careerStage === stage && b.sector === selectedBand.sector);
    if (band) setSelectedBand(band);
  };

  const handleSectorChange = (sector: string) => {
    const band = data.salaryBands.find((b) => b.careerStage === selectedBand.careerStage && b.sector === sector);
    if (band) setSelectedBand(band);
  };

  const isSinglePoint = selectedBand.grossAnnualMin === selectedBand.grossAnnualMax;

  // CoL helpers
  const handleColChange = (city: string, lifestyle: LifestyleLevel, rent: RentType) => {
    const row = data.costOfLiving.find(
      (r) => r.city === city && r.lifestyleLevel === lifestyle && r.rentType === rent
    );
    if (row) setSelectedCoL(row);
  };

  const colBreakdown = [
    { label: "Rent", value: selectedCoL.monthlyRent },
    { label: "Utilities & Internet", value: selectedCoL.monthlyUtilities },
    { label: "Transport", value: selectedCoL.monthlyTransport },
    { label: "Groceries", value: selectedCoL.monthlyGroceries },
    ...(selectedCoL.monthlySchoolFees > 0 ? [{ label: "School Fees", value: selectedCoL.monthlySchoolFees }] : []),
    { label: "Dining Out", value: selectedCoL.monthlyDining },
    { label: "Healthcare", value: selectedCoL.monthlyHealthcare },
    { label: "Miscellaneous", value: selectedCoL.monthlyMisc },
  ].filter((item) => item.value > 0);

  const isNeg = savings.isNegativeSavings;
  const monthlyInr = Math.round(taxBreakdown.netMonthly * liveRate);

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
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your New Zealand breakdown` : "Your New Zealand Salary Breakdown"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
            Adjust the options below to match your situation. Everything updates instantly.
          </p>
        </div>

        {/* NZREX Info Banner */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "var(--primary-100)", border: "1px solid var(--primary-200)" }}
        >
          <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--primary-600)" }} />
          <div className="text-sm" style={{ color: "var(--primary-600)" }}>
            <p className="font-semibold mb-1">NZREX Route Required</p>
            <p>
              International medical graduates must pass the NZREX Clinical Examination (Part 1 & 2) and obtain
              provisional registration with the Medical Council of New Zealand (MCNZ). After 2 years of supervised
              practice, full registration is granted. Most doctors start in public DHB/Te Whatu Ora positions.
            </p>
          </div>
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
          Exchange rate: NZ$ 1 = &#8377;{liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
        </div>

        {/* ============ 1. SALARY SELECTOR ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            1. Your Salary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
            </div>
          </div>

          {/* Scenario buttons */}
          {!isSinglePoint && (
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--neutral-600)" }}>
                Salary Scenario
              </p>
              <div className="flex gap-2">
                {["min", "typical", "max"].map((point) => (
                  <button
                    key={point}
                    onClick={() => setSalaryPoint(point as "min" | "typical" | "max")}
                    className="px-4 py-2 text-xs font-medium rounded-lg transition-all"
                    style={{
                      background: salaryPoint === point ? "var(--primary-900)" : "var(--neutral-100)",
                      color: salaryPoint === point ? "white" : "var(--neutral-700)",
                      border: salaryPoint === point ? "1px solid var(--primary-900)" : "1px solid transparent",
                    }}
                  >
                    {point === "min" ? "Conservative" : point === "typical" ? "Typical" : "Optimistic"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Salary amount display */}
          <div className="mt-5 p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
              Annual Gross Salary
            </p>
            <p className="text-3xl font-bold" style={{ color: "var(--primary-900)" }}>
              {formatNzd(grossAnnual)}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
              {formatInr(grossAnnual * liveRate)} per year
            </p>
          </div>
        </div>

        {/* ============ 2. TAX BREAKDOWN ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            2. Tax & Deductions
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Gross Annual Salary
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--primary-900)" }}>
                {formatNzd(taxBreakdown.grossAnnual)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                Income Tax (PAYE)
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--warning-600)" }}>
                -{formatNzd(taxBreakdown.incomeTax)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                ACC Earners' Levy
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--warning-600)" }}>
                -{formatNzd(taxBreakdown.accLevy)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                KiwiSaver (3% employee)
              </span>
              <span className="text-sm font-medium" style={{ color: "var(--warning-600)" }}>
                -{formatNzd(taxBreakdown.kiwisaver)}
              </span>
            </div>
            <div className="h-px" style={{ background: "var(--neutral-200)" }} />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Total Deductions
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--warning-600)" }}>
                -{formatNzd(taxBreakdown.totalDeductions)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Net Annual Salary
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--success-600)" }}>
                {formatNzd(taxBreakdown.netAnnual)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "var(--primary-50)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--primary-600)" }}>
              Effective Tax Rate: {taxBreakdown.effectiveTaxRate}%
            </p>
          </div>

          <div className="mt-3 text-xs p-3 rounded-lg" style={{ background: "var(--neutral-50)", color: "var(--neutral-600)" }}>
            <p className="font-semibold mb-1">Note on KiwiSaver</p>
            <p>
              Employer contributes matching 3% (not deducted from your pay). Many doctors opt into KiwiSaver for
              retirement savings. You can increase employee contribution to 4%, 6%, 8%, or 10% if desired.
            </p>
          </div>
        </div>

        {/* ============ 3. TAKE-HOME PAY ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            3. Your Take-Home Pay
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
                Monthly (NZD)
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
                {formatNzd(taxBreakdown.netMonthly)}
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "var(--accent-50)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
                Monthly (INR)
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
                {formatInr(monthlyInr)}
              </p>
            </div>
          </div>
        </div>

        {/* ============ 4. COST OF LIVING ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            4. Cost of Living
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
                City
              </label>
              <select
                value={selectedCoL.city}
                onChange={(e) => handleColChange(e.target.value, selectedCoL.lifestyleLevel, selectedCoL.rentType)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)" }}
              >
                {config.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
                Lifestyle
              </label>
              <select
                value={selectedCoL.lifestyleLevel}
                onChange={(e) => handleColChange(selectedCoL.city, e.target.value as LifestyleLevel, selectedCoL.rentType)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)" }}
              >
                {config.lifestyleLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>
                Accommodation
              </label>
              <select
                value={selectedCoL.rentType}
                onChange={(e) => handleColChange(selectedCoL.city, selectedCoL.lifestyleLevel, e.target.value as RentType)}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)" }}
              >
                {config.rentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs mb-3" style={{ color: "var(--neutral-600)" }}>
            {LIFESTYLE_DESCRIPTIONS[selectedCoL.lifestyleLevel]}
          </p>

          {/* CoL Breakdown */}
          <div className="space-y-2">
            {colBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5">
                <span className="text-sm" style={{ color: "var(--neutral-700)" }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                  {formatNzd(item.value)}
                </span>
              </div>
            ))}
            <div className="h-px mt-2" style={{ background: "var(--neutral-200)" }} />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold" style={{ color: "var(--neutral-900)" }}>
                Total Monthly Cost
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--primary-900)" }}>
                {formatNzd(selectedCoL.totalMonthlyCost)}
              </span>
            </div>
          </div>
        </div>

        {/* ============ 5. SAVINGS ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            5. Savings Potential
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
                Monthly Savings
              </p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold ${isNeg ? "text-red-600" : ""}`} style={{ color: isNeg ? undefined : "var(--success-600)" }}>
                  {isNeg && <>-</>}
                  {formatInr(Math.abs(savings.monthlySavingsInr))}
                </p>
                {isNeg ? (
                  <TrendingDown size={20} className="text-red-600 mb-1" />
                ) : (
                  <TrendingUp size={20} style={{ color: "var(--success-600)" }} className="mb-1" />
                )}
              </div>
              <p className="text-sm mt-0.5" style={{ color: "var(--neutral-600)" }}>
                {formatNzd(Math.abs(savings.monthlySavingsNzd))} /month
              </p>
            </div>

            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
                Annual Savings Potential
              </p>
              <p className={`text-3xl font-bold ${isNeg ? "text-red-600" : ""}`} style={{ color: isNeg ? undefined : "var(--success-600)" }}>
                {isNeg && <>-</>}
                {formatInr(Math.abs(savings.monthlySavingsInr * 12))}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--neutral-600)" }}>
                &#8377;{Math.round(Math.abs(savings.monthlySavingsInr * 12) / 100000)}L per year
              </p>
            </div>
          </div>

          {!isNeg && (
            <div className="p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--neutral-700)" }}>
                Migration Cost Recovery Time
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Conservative</p>
                  <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                    {savings.recoveryMonthsMax >= 999 ? "N/A" : `${savings.recoveryMonthsMax}m`}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Typical</p>
                  <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                    {savings.recoveryMonthsTypical >= 999 ? "N/A" : `${savings.recoveryMonthsTypical}m`}
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--neutral-600)" }}>Optimistic</p>
                  <p className="text-lg font-bold mt-1" style={{ color: "var(--primary-900)" }}>
                    {savings.recoveryMonthsMin >= 999 ? "N/A" : `${savings.recoveryMonthsMin}m`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isNeg && (
            <div className="p-4 rounded-lg" style={{ background: "var(--warning-50)", border: "1px solid var(--warning-200)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--warning-600)" }}>
                Your selected cost of living exceeds your net salary. Consider adjusting your lifestyle or salary expectations.
              </p>
            </div>
          )}
        </div>

        {/* ============ 6. MIGRATION TIMELINE ============ */}
        <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />

        {/* ============ 7. COUNTRY COMPARISON ============ */}
        <CountryComparisonTable rows={comparisonRows} currentCountryCode="nz" />

        {/* Disclaimer */}
        <div className="text-xs p-4 rounded-lg" style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--neutral-700)" }}>
            Disclaimer
          </p>
          <p>
            This tool provides general estimates for planning purposes only. Actual salaries, costs, taxes, and migration timelines vary
            significantly by DHB/hospital, city, specialty, NZREX exam results, and individual circumstances. Always consult official sources
            (MCNZ, Immigration NZ, IRD) and financial advisors before making migration decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
