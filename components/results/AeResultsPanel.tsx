"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateAeTakeHome,
  calculateAeSavings,
  formatAed,
  formatInr,
} from "@/lib/calc/ae/taxCalculator";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import Link from "next/link";
import { ArrowLeft, Info, TrendingUp, TrendingDown, AlertTriangle, DollarSign, MapPin, Coins, Wallet, Crown, Users, Home, Building2 } from "lucide-react";
import { ChipSelect, getDisabledOptions } from "./ChipSelect";

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

export function AeResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Medical Officer" && b.sector === "Private Hospital"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Dubai" && r.lifestyleLevel === "Basic" && r.rentType === "Shared Accommodation"
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
    () => calculateAeTakeHome(grossAnnual),
    [grossAnnual]
  );

  const savings = useMemo(
    () =>
      calculateAeSavings(
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
        currentCountry: "ae",
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

  const disabledSectors = useMemo(
    () => getDisabledOptions(data.salaryBands, "careerStage", selectedBand.careerStage, config.sectors),
    [data.salaryBands, selectedBand.careerStage, config.sectors],
  );
  const disabledCareerStages = useMemo(
    () => getDisabledOptions(data.salaryBands, "sector", selectedBand.sector, careerStages),
    [data.salaryBands, selectedBand.sector, careerStages],
  );

  const handleCareerChange = (stage: string) => {
    const band = data.salaryBands.find((b) => b.careerStage === stage && b.sector === selectedBand.sector);
    if (band) {
      setSelectedBand(band);
    } else {
      const fallback = data.salaryBands.find((b) => b.careerStage === stage);
      if (fallback) setSelectedBand(fallback);
    }
  };

  const handleSectorChange = (sector: string) => {
    const band = data.salaryBands.find((b) => b.careerStage === selectedBand.careerStage && b.sector === sector);
    if (band) {
      setSelectedBand(band);
    } else {
      const fallback = data.salaryBands.find((b) => b.sector === sector);
      if (fallback) setSelectedBand(fallback);
    }
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
            <span className="text-white font-semibold text-lg">Salary Comparison Tool by GooCampus World</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-white bg-white/15 hover:bg-white/25 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your UAE breakdown` : "Your UAE Salary Breakdown"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
            Adjust the options below to match your situation. Everything updates instantly.
          </p>
        </div>

        {/* Zero Tax Benefit Banner */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "var(--success-100)", border: "1px solid var(--success-200)" }}
        >
          <DollarSign size={18} className="mt-0.5 shrink-0" style={{ color: "var(--success-600)" }} />
          <div className="text-sm" style={{ color: "var(--success-600)" }}>
            <p className="font-semibold mb-1">Tax-Free Income</p>
            <p>
              UAE levies no personal income tax on expatriates — your gross salary is your take-home salary.
              This unique benefit makes UAE one of the most attractive destinations for doctors seeking to maximize savings.
            </p>
          </div>
        </div>

        {/* Housing Allowance Warning */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "var(--warning-100)", border: "1px solid var(--warning-200)" }}
        >
          <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--warning-600)" }} />
          <div className="text-sm" style={{ color: "var(--warning-600)" }}>
            <p className="font-semibold mb-1">Housing Allowance Not Included in Salary Figures</p>
            <p>
              Salaries shown are base pay only. Most hospitals provide housing allowance (20-40% of base) or
              free accommodation separately. Total compensation packages are typically 120-150% of the stated salary.
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
          Exchange rate: AED 1 = &#8377;{liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
        </div>

        {/* ============ 1. SALARY SELECTOR ============ */}
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            1. Your Salary
          </h2>

          <div className="space-y-4 mb-4">
            <ChipSelect
              label="Career Stage"
              options={careerStages.map((stage) => ({ value: stage, label: stage }))}
              selected={selectedBand.careerStage}
              onChange={handleCareerChange}
              disabledValues={disabledCareerStages}
            />

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
                    className="px-4 py-2 text-xs font-medium rounded-full transition-all"
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
              {formatAed(grossAnnual)}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
              {formatInr(grossAnnual * liveRate)} per year
            </p>
          </div>
        </div>

        {/* IMG Earnings Note */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "var(--primary-100)", border: "1px solid var(--primary-200)" }}
        >
          <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--primary-600)" }} />
          <p className="text-sm" style={{ color: "var(--primary-600)" }}>
            <span className="font-semibold">Note:</span> IMGs have the opportunity to earn more by doing locums, on-calls, night-shifts, and overtime. The figures shown represent base salary only.
          </p>
        </div>

        {/* ============ 2. TAX BREAKDOWN (ZERO TAX) ============ */}
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            2. Tax & Deductions
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Gross Annual Salary
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--success-600)" }}>
                {formatAed(taxBreakdown.grossAnnual)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                Income Tax
              </span>
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                AED 0
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                Social Security Contributions
              </span>
              <span className="text-sm" style={{ color: "var(--neutral-600)" }}>
                AED 0
              </span>
            </div>
            <div className="h-px" style={{ background: "var(--neutral-200)" }} />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Net Annual Salary
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--success-600)" }}>
                {formatAed(taxBreakdown.netAnnual)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "var(--success-50)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--success-600)" }}>
              Effective Tax Rate: 0% — No deductions
            </p>
          </div>
        </div>

        {/* ============ 3. TAKE-HOME PAY ============ */}
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            3. Your Take-Home Pay
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ background: "var(--primary-50)" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "var(--neutral-600)" }}>
                Monthly (AED)
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--primary-900)" }}>
                {formatAed(taxBreakdown.netMonthly)}
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
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            4. Cost of Living
          </h2>

          <div className="space-y-4 mb-5">
            <ChipSelect
              label="City"
              options={config.cities.map((city) => ({ value: city, label: city, icon: <MapPin size={14} /> }))}
              selected={selectedCoL.city}
              onChange={(city) => handleColChange(city, selectedCoL.lifestyleLevel, selectedCoL.rentType)}
            />

            <ChipSelect
              label="Lifestyle"
              options={config.lifestyleLevels.map((level) => ({ value: level, label: level, icon: LIFESTYLE_ICONS[level] }))}
              selected={selectedCoL.lifestyleLevel}
              onChange={(level) => handleColChange(selectedCoL.city, level as LifestyleLevel, selectedCoL.rentType)}
              description={LIFESTYLE_DESCRIPTIONS[selectedCoL.lifestyleLevel]}
            />

            <ChipSelect
              label="Accommodation"
              options={config.rentTypes.map((type) => ({ value: type, label: type, icon: RENT_ICONS[type] }))}
              selected={selectedCoL.rentType}
              onChange={(rent) => handleColChange(selectedCoL.city, selectedCoL.lifestyleLevel, rent as RentType)}
            />
          </div>

          {/* CoL Breakdown */}
          <div className="space-y-2">
            {colBreakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1.5">
                <span className="text-sm" style={{ color: "var(--neutral-700)" }}>{item.label}</span>
                <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                  {formatAed(item.value)}
                </span>
              </div>
            ))}
            <div className="h-px mt-2" style={{ background: "var(--neutral-200)" }} />
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold" style={{ color: "var(--neutral-900)" }}>
                Total Monthly Cost
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--primary-900)" }}>
                {formatAed(selectedCoL.totalMonthlyCost)}
              </span>
            </div>
          </div>
        </div>

        {/* ============ 5. SAVINGS ============ */}
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
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
                {formatAed(Math.abs(savings.monthlySavingsAed))} /month
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
        <CountryComparisonTable rows={comparisonRows} currentCountryCode="ae" />

        {/* Disclaimer */}
        <div className="text-xs p-4 rounded-lg" style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}>
          <p className="font-semibold mb-1" style={{ color: "var(--neutral-700)" }}>
            Disclaimer
          </p>
          <p>
            This tool provides general estimates for planning purposes only. Actual salaries, costs, taxes, and migration timelines vary
            significantly by hospital, emirate, licensing body (DHA/DOH/MOH), specialty, and individual circumstances. Always consult official sources
            (DHA, DOH, MOH websites) and financial advisors before making migration decisions.
          </p>
        </div>
      </div>
    </main>
  );
}
