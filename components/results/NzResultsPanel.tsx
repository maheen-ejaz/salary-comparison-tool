"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateNzTakeHome,
  calculateNzSavings,
  formatNzd,
  formatInr,
} from "@/lib/calc/nz/taxCalculator";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import { SalarySelector } from "./SalarySelector";
import { TaxBreakdownCard } from "./TaxBreakdownCard";
import type { TaxRow } from "./TaxBreakdownCard";
import { TakeHomeCard } from "./TakeHomeCard";
import { CostOfLivingSelector } from "./CostOfLivingSelector";
import type { CostBreakdownItem } from "./CostOfLivingSelector";
import { SavingsCard } from "./SavingsCard";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { CurrencyToggle } from "./CurrencyToggle";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { SectionNav } from "./SectionNav";
import type { NavSection } from "./SectionNav";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import type { DonutSlice } from "@/components/charts/types";
import type { LifestyleLevel } from "@/lib/data/types";

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

const SECTIONS: NavSection[] = [
  { id: "section-salary", label: "1. Salary", shortLabel: "Salary" },
  { id: "section-tax", label: "2. Tax", shortLabel: "Tax" },
  { id: "section-takehome", label: "3. Take-Home", shortLabel: "Pay" },
  { id: "section-col", label: "4. Living Costs", shortLabel: "CoL" },
  { id: "section-savings", label: "5. Savings", shortLabel: "Savings" },
  { id: "section-migration", label: "6. Migration", shortLabel: "Migration" },
  { id: "section-comparison", label: "7. Comparison", shortLabel: "Compare" },
];

export function NzResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Medical Officer / PGY2-3" && b.sector === "Public (DHB/Te Whatu Ora)"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Auckland" && r.lifestyleLevel === "Basic" && r.rentType === "Shared Accommodation"
  )!;

  const [selectedBand, setSelectedBand] = useState<SalaryBand>(defaultBand);
  const [salaryPoint, setSalaryPoint] = useState<"min" | "typical" | "max">("typical");
  const [selectedCoL, setSelectedCoL] = useState<CostOfLivingRow>(defaultCoL);
  const [displayCurrency, setDisplayCurrency] = useState<"local" | "inr">("local");

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

  const displayFormat = displayCurrency === "inr"
    ? (amount: number) => formatInr(Math.round(amount * liveRate))
    : formatNzd;

  const monthlyInr = Math.round(taxBreakdown.netMonthly * liveRate);

  // Build tax rows
  const taxRows: TaxRow[] = [
    { label: "Gross Annual Salary", value: taxBreakdown.grossAnnual, isGross: true },
    { label: "Income Tax (PAYE)", value: -taxBreakdown.incomeTax, isDeduction: true },
    { label: "ACC Earners' Levy", value: -taxBreakdown.accLevy, isDeduction: true },
    { label: "KiwiSaver (3% employee)", value: -taxBreakdown.kiwisaver, isDeduction: true },
  ];

  const donutSlices: DonutSlice[] = [
    { label: "Income Tax", value: taxBreakdown.incomeTax, color: "var(--error-600)" },
    ...(taxBreakdown.accLevy > 0 ? [{ label: "ACC Levy", value: taxBreakdown.accLevy, color: "var(--warning-600)" }] : []),
    ...(taxBreakdown.kiwisaver > 0 ? [{ label: "KiwiSaver", value: taxBreakdown.kiwisaver, color: "var(--accent-600)" }] : []),
    { label: "Take-Home", value: taxBreakdown.netAnnual, color: "var(--success-600)" },
  ];

  // Build CoL breakdown items
  const colBreakdown: CostBreakdownItem[] = [
    { label: "Rent", value: selectedCoL.monthlyRent },
    { label: "Utilities & Internet", value: selectedCoL.monthlyUtilities },
    { label: "Transport", value: selectedCoL.monthlyTransport },
    { label: "Groceries", value: selectedCoL.monthlyGroceries },
    ...(selectedCoL.monthlySchoolFees > 0 ? [{ label: "School Fees", value: selectedCoL.monthlySchoolFees }] : []),
    { label: "Dining Out", value: selectedCoL.monthlyDining },
    { label: "Healthcare", value: selectedCoL.monthlyHealthcare },
    { label: "Miscellaneous", value: selectedCoL.monthlyMisc },
  ].filter((item) => item.value > 0);

  // KiwiSaver info note
  const taxInfoNotes: React.ReactNode[] = [
    <div
      key="kiwisaver"
      className="mt-3 text-xs p-3 rounded-lg"
      style={{ background: "var(--neutral-50)", color: "var(--neutral-600)" }}
    >
      <p className="font-semibold mb-1">Note on KiwiSaver</p>
      <p>
        Employer contributes matching 3% (not deducted from your pay). Many doctors opt into KiwiSaver for
        retirement savings. You can increase employee contribution to 4%, 6%, 8%, or 10% if desired.
      </p>
    </div>,
  ];

  // Gross display extra: INR per year
  const grossExtra = (
    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--neutral-500)" }}>
      <Info size={11} />
      <span>{formatInr(grossAnnual * liveRate)} per year</span>
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
      {/* Header */}
      <header className="px-6 py-4 sticky top-0 z-10" style={{ background: "var(--primary-900)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm">Salary Comparison Tool by</span>
            <img src="/goocampus-logo-white.png" alt="GooCampus World" className="h-6" />
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
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2"
            style={{
              background: rateIsLive ? "var(--success-100)" : "var(--warning-100)",
              color: rateIsLive ? "var(--success-600)" : "var(--warning-600)",
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rateIsLive ? "bg-green-500" : "bg-amber-500"}`} />
            Exchange rate: NZD 1 = INR {liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
          </div>
          <CurrencyToggle localLabel="NZD" displayCurrency={displayCurrency} onChange={setDisplayCurrency} />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "var(--neutral-400)" }}>
          Rates change daily. All INR figures use this rate.
        </p>

        <SectionNav sections={SECTIONS} />

        {/* Salary Selector */}
        <div id="section-salary" className="space-y-6">
        <SalarySelector
          bands={data.salaryBands}
          config={config}
          selectedBand={selectedBand}
          salaryPoint={salaryPoint}
          onBandChange={setSelectedBand}
          onSalaryPointChange={setSalaryPoint}
          formatCurrency={displayFormat}
          grossDisplayExtra={grossExtra}
        />

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
        </div>

        {/* Tax Breakdown */}
        <div id="section-tax">
        <TaxBreakdownCard
          title="2. Tax & Deductions"
          rows={taxRows}
          netAnnual={taxBreakdown.netAnnual}
          grossAnnual={taxBreakdown.grossAnnual}
          effectiveTaxRate={taxBreakdown.effectiveTaxRate}
          donutSlices={donutSlices}
          donutCenterValue={displayFormat(taxBreakdown.netAnnual)}
          formatCurrency={displayFormat}
          infoNotes={taxInfoNotes}
        />
        </div>

        {/* Take-Home Pay */}
        <div id="section-takehome">
        <TakeHomeCard
          title="3. Your Take-Home Pay"
          netMonthly={taxBreakdown.netMonthly}
          netMonthlyInr={monthlyInr}
          netAnnual={taxBreakdown.netAnnual}
          totalDeductions={taxBreakdown.totalDeductions}
          formatCurrency={displayFormat}
          variant="grid"
          currencyLabel="NZD"
        />
        </div>

        {/* Cost of Living */}
        <div id="section-col">
        <CostOfLivingSelector
          title="4. Cost of Living"
          rows={data.costOfLiving}
          config={config}
          selected={selectedCoL}
          onChange={setSelectedCoL}
          formatCurrency={displayFormat}
          breakdownItems={colBreakdown}
          lifestyleDescriptions={LIFESTYLE_DESCRIPTIONS}
          netMonthly={taxBreakdown.netMonthly}
        />
        </div>

        {/* Savings */}
        <div id="section-savings">
        <SavingsCard
          monthlySavingsLocal={savings.monthlySavingsNzd}
          monthlySavingsInr={savings.monthlySavingsInr}
          monthlyTakeHomeLocal={savings.monthlyTakeHomeNzd}
          monthlyCostLocal={savings.monthlyCostNzd}
          isNegativeSavings={savings.isNegativeSavings}
          formatCurrency={displayFormat}
          variant="grid"
          recoveryMonths={{
            min: savings.recoveryMonthsMin,
            typical: savings.recoveryMonthsTypical,
            max: savings.recoveryMonthsMax,
          }}
        />
        </div>

        {/* Migration Timeline */}
        <div id="section-migration">
        <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <div id="section-comparison">
        <CountryComparisonTable rows={comparisonRows} currentCountryCode="nz" />
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
