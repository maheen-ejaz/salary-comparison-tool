"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateAuTakeHome,
  calculateAuSavings,
  formatAud,
} from "@/lib/calc/au/taxCalculator";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import { CurrencyToggle } from "./CurrencyToggle";
import { formatInr } from "@/lib/calc/uk/taxCalculator";
import { SalarySelector } from "./SalarySelector";
import { TaxBreakdownCard } from "./TaxBreakdownCard";
import type { TaxRow } from "./TaxBreakdownCard";
import { TakeHomeCard } from "./TakeHomeCard";
import { CostOfLivingSelector } from "./CostOfLivingSelector";
import type { CostBreakdownItem } from "./CostOfLivingSelector";
import { SavingsCard } from "./SavingsCard";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { SectionNav } from "./SectionNav";
import type { NavSection } from "./SectionNav";
import Link from "next/link";
import { ArrowLeft, Info, AlertTriangle } from "lucide-react";
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
  Premium: "Family, high quality — 2-3 bed, private health insurance",
};

export function AuResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Intern (PGY1)" && b.sector === "Public (State Health)"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Sydney" && r.lifestyleLevel === "Basic" && r.rentType === "Shared Accommodation"
  )!;

  const [selectedBand, setSelectedBand] = useState<SalaryBand>(defaultBand);
  const [salaryPoint, setSalaryPoint] = useState<"min" | "typical" | "max">("typical");
  const [selectedCoL, setSelectedCoL] = useState<CostOfLivingRow>(defaultCoL);
  const [displayCurrency, setDisplayCurrency] = useState<"local" | "inr">("local");

  const displayFormat = displayCurrency === "inr"
    ? (amount: number) => formatInr(Math.round(amount * liveRate))
    : formatAud;

  const grossAnnual =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  const taxBreakdown = useMemo(
    () => calculateAuTakeHome(grossAnnual, data.taxRules),
    [grossAnnual, data.taxRules]
  );

  const savings = useMemo(
    () =>
      calculateAuSavings(
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
        currentCountry: "au",
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

  const monthlyInr = Math.round(taxBreakdown.netMonthly * liveRate);

  // Build tax rows
  const taxRows: TaxRow[] = [
    { label: "Gross Annual Salary", value: taxBreakdown.grossAnnual, isGross: true },
    { label: "Income Tax", value: -taxBreakdown.incomeTax, isDeduction: true },
    { label: "Medicare Levy (2%)", value: -taxBreakdown.medicareLevy, isDeduction: true },
    { label: "Superannuation (employer-paid)", value: taxBreakdown.superannuationEmployer, isInfo: true },
  ];

  const donutSlices: DonutSlice[] = [
    { label: "Income Tax", value: taxBreakdown.incomeTax, color: "var(--error-600)" },
    ...(taxBreakdown.medicareLevy > 0 ? [{ label: "Medicare Levy", value: taxBreakdown.medicareLevy, color: "var(--warning-600)" }] : []),
    { label: "Take-Home", value: taxBreakdown.netAnnual, color: "var(--success-600)" },
  ];

  // Build CoL breakdown items
  const colBreakdown: CostBreakdownItem[] = [
    { label: "Rent", value: selectedCoL.monthlyRent },
    { label: "Utilities & Rates", value: selectedCoL.monthlyUtilities },
    { label: "Transport", value: selectedCoL.monthlyTransport },
    { label: "Groceries", value: selectedCoL.monthlyGroceries },
    { label: "Dining Out", value: selectedCoL.monthlyDining },
    { label: "Healthcare", value: selectedCoL.monthlyHealthcare },
    { label: "Miscellaneous", value: selectedCoL.monthlyMisc },
  ].filter((item) => item.value > 0);

  // Build CoL warnings
  const colWarnings: React.ReactNode[] = [];
  if (selectedCoL.lifestyleLevel === "Premium" && selectedCoL.rentType === "Family (2-3 BHK)") {
    colWarnings.push(
      <div className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg" style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}>
        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
        <span>Private school fees (AUD 600–AUD 2,500/month) are not included above. Public school = AUD 0.</span>
      </div>
    );
  }

  // Gross display extra: super info
  const superInfo = (
    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--neutral-500)" }}>
      <Info size={11} />
      <span>
        Your employer contributes {formatAud(taxBreakdown.superannuationEmployer)}/yr to super on top of your salary (12% SG)
      </span>
    </div>
  );

  const SECTIONS: NavSection[] = [
    { id: "section-salary", label: "1. Salary", shortLabel: "Salary" },
    { id: "section-tax", label: "2. Tax", shortLabel: "Tax" },
    { id: "section-col", label: "3. Living Costs", shortLabel: "CoL" },
    { id: "section-savings", label: "4. Savings", shortLabel: "Savings" },
    { id: "section-migration", label: "5. Migration", shortLabel: "Migration" },
    { id: "section-comparison", label: "6. Comparison", shortLabel: "Compare" },
  ];

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
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your Australia breakdown` : "Your Australia Salary Breakdown"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
            Adjust the options below to match your situation. Everything updates instantly.
          </p>
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
            Exchange rate: AUD 1 = INR {liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
          </div>
          <CurrencyToggle localLabel="AUD" displayCurrency={displayCurrency} onChange={setDisplayCurrency} />
        </div>
        <p className="text-[10px] mt-1" style={{ color: "var(--neutral-400)" }}>
          Rates change daily. All INR figures use this rate.
        </p>

        <SectionNav sections={SECTIONS} />

        {/* Salary Selector */}
        <div id="section-salary">
          <SalarySelector
            bands={data.salaryBands}
            config={config}
            selectedBand={selectedBand}
            salaryPoint={salaryPoint}
            onBandChange={setSelectedBand}
            onSalaryPointChange={setSalaryPoint}
            formatCurrency={displayFormat}
            grossDisplayExtra={superInfo}
          />

          {/* IMG Earnings Note */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl mt-6"
            style={{ background: "var(--primary-100)", border: "1px solid var(--primary-200)" }}
          >
            <Info size={18} className="mt-0.5 shrink-0" style={{ color: "var(--primary-600)" }} />
            <p className="text-sm" style={{ color: "var(--primary-600)" }}>
              <span className="font-semibold">Note:</span> IMGs have the opportunity to earn more by doing locums, on-calls, night-shifts, and overtime. The figures shown represent base salary only.
            </p>
          </div>
        </div>

        {/* Tax + Take-Home row */}
        <div id="section-tax">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TaxBreakdownCard
              rows={taxRows}
              netAnnual={taxBreakdown.netAnnual}
              grossAnnual={taxBreakdown.grossAnnual}
              effectiveTaxRate={taxBreakdown.effectiveTaxRate}
              donutSlices={donutSlices}
              donutCenterValue={displayFormat(taxBreakdown.netAnnual)}
              formatCurrency={displayFormat}
            />
            <TakeHomeCard
              subtitle="After Income Tax & Medicare Levy"
              netMonthly={taxBreakdown.netMonthly}
              netMonthlyInr={monthlyInr}
              netAnnual={taxBreakdown.netAnnual}
              totalDeductions={taxBreakdown.totalDeductions}
              formatCurrency={displayFormat}
              extraRows={[
                {
                  label: "Super (employer-paid, on top)",
                  value: `+${formatAud(Math.round(taxBreakdown.superannuationEmployer / 12))}/mo`,
                  color: "var(--primary-200)",
                },
              ]}
            />
          </div>
        </div>

        {/* CoL Selector */}
        <div id="section-col">
          <CostOfLivingSelector
            rows={data.costOfLiving}
            config={config}
            selected={selectedCoL}
            onChange={setSelectedCoL}
            formatCurrency={displayFormat}
            breakdownItems={colBreakdown}
            lifestyleDescriptions={LIFESTYLE_DESCRIPTIONS}
            warnings={colWarnings}
            netMonthly={taxBreakdown.netMonthly}
          />
        </div>

        {/* Savings + Timeline */}
        <div id="section-savings" className="space-y-6">
          <SavingsCard
            monthlySavingsLocal={savings.monthlySavingsAud}
            monthlySavingsInr={savings.monthlySavingsInr}
            monthlyTakeHomeLocal={savings.monthlyTakeHomeAud}
            monthlyCostLocal={savings.monthlyCostAud}
            isNegativeSavings={savings.isNegativeSavings}
            formatCurrency={displayFormat}
          />
        </div>
        <div id="section-migration">
          <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <div id="section-comparison">
          <CountryComparisonTable rows={comparisonRows} currentCountryCode="au" />
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
