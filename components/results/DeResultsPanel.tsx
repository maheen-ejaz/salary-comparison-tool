"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateDeTakeHome,
  calculateDeSavings,
  formatEur,
} from "@/lib/calc/de/taxCalculator";
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
  Premium: "Family, high quality — 2-3 bed, private supplementary insurance",
};

export function DeResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Junior Resident \u2014 Assistenzarzt (Year 1-2)" && b.sector === "Public (TV-Ärzte Collective Agreement)"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Berlin" && r.lifestyleLevel === "Basic" && r.rentType === "Shared Accommodation"
  )!;

  const [selectedBand, setSelectedBand] = useState<SalaryBand>(defaultBand);
  const [salaryPoint, setSalaryPoint] = useState<"min" | "typical" | "max">("typical");
  const [selectedCoL, setSelectedCoL] = useState<CostOfLivingRow>(defaultCoL);
  const [displayCurrency, setDisplayCurrency] = useState<"local" | "inr">("local");

  const displayFormat = displayCurrency === "inr"
    ? (amount: number) => formatInr(Math.round(amount * liveRate))
    : formatEur;

  const grossAnnual =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  const taxBreakdown = useMemo(
    () => calculateDeTakeHome(grossAnnual, data.taxRules),
    [grossAnnual, data.taxRules]
  );

  const savings = useMemo(
    () =>
      calculateDeSavings(
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
        currentCountry: "de",
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
    { label: "Income Tax (Einkommensteuer)", value: -taxBreakdown.incomeTax, isDeduction: true },
    ...(taxBreakdown.solidaritySurcharge > 0 ? [{ label: "Solidarity Surcharge (Soli)", value: -taxBreakdown.solidaritySurcharge, isDeduction: true }] : []),
    { label: "Health Insurance (Krankenversicherung)", value: -taxBreakdown.healthInsurance, isDeduction: true },
    { label: "Pension Insurance (Rentenversicherung)", value: -taxBreakdown.pensionInsurance, isDeduction: true },
    { label: "Unemployment Insurance", value: -taxBreakdown.unemploymentInsurance, isDeduction: true },
    { label: "Long-term Care (Pflegeversicherung)", value: -taxBreakdown.longTermCareInsurance, isDeduction: true },
  ];

  const donutSlices: DonutSlice[] = [
    { label: "Income Tax", value: taxBreakdown.incomeTax, color: "var(--error-600)" },
    ...(taxBreakdown.solidaritySurcharge > 0 ? [{ label: "Solidarity", value: taxBreakdown.solidaritySurcharge, color: "var(--neutral-400)" }] : []),
    { label: "Health Insurance", value: taxBreakdown.healthInsurance, color: "var(--primary-500)" },
    { label: "Pension Insurance", value: taxBreakdown.pensionInsurance, color: "var(--accent-600)" },
    { label: "Unemployment", value: taxBreakdown.unemploymentInsurance, color: "var(--warning-600)" },
    { label: "Long-term Care", value: taxBreakdown.longTermCareInsurance, color: "var(--neutral-300)" },
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

  // Tax breakdown info notes
  const taxInfoNotes: React.ReactNode[] = [
    <div
      key="church-tax"
      className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
      style={{ background: "var(--neutral-100)", color: "var(--neutral-500)" }}
    >
      <Info size={13} className="mt-0.5 shrink-0" />
      <span>{taxBreakdown.churchTaxNote}</span>
    </div>,
    <div
      key="steuerklasse"
      className="mt-2 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
      style={{ background: "var(--neutral-100)", color: "var(--neutral-500)" }}
    >
      <Info size={13} className="mt-0.5 shrink-0" />
      <span>Assumes Steuerklasse I (single, no children). Married couples (Klasse III/V) or with children pay less. Long-term care includes 0.6% childless surcharge.</span>
    </div>,
  ];

  const SECTIONS: NavSection[] = [
    { id: "section-salary", label: "1. Salary", shortLabel: "Salary" },
    { id: "section-tax", label: "2. Tax", shortLabel: "Tax" },
    { id: "section-col", label: "3. Living Costs", shortLabel: "CoL" },
    { id: "section-savings", label: "4. Savings", shortLabel: "Savings" },
    { id: "section-migration", label: "5. Migration", shortLabel: "Migration" },
    { id: "section-comparison", label: "6. Comparison", shortLabel: "Compare" },
  ];

  // Gross display extra: TV-Ärzte info note based on sector
  const grossExtra = (
    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--neutral-500)" }}>
      <Info size={11} />
      <span>
        {selectedBand.sector === "Public (TV-Ärzte Collective Agreement)"
          ? "Based on TV-Ärzte/VKA 2024-25 collective agreement (Tarifvertrag)."
          : "Based on market estimates for private hospital chains."}
      </span>
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
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your Germany breakdown` : "Your Germany Salary Breakdown"}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
            Adjust the options below to match your situation. Everything updates instantly.
          </p>
        </div>

        {/* German Language Warning */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
          style={{ background: "var(--warning-100)", border: "1px solid var(--warning-200)" }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: "var(--warning-600)" }} />
          <div className="text-sm" style={{ color: "var(--warning-600)" }}>
            <p className="font-semibold mb-1">German Language Required</p>
            <p>
              Working as a doctor in Germany requires B2 German proficiency and passing the
              Fachsprachpr&uuml;fung (medical German C1 exam). This is a mandatory legal requirement.
              Budget 6-12 months and INR 1-3 lakh for language preparation before you can begin working.
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
            Exchange rate: EUR 1 = INR {liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
          </div>
          <CurrencyToggle localLabel="EUR" displayCurrency={displayCurrency} onChange={setDisplayCurrency} />
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

        {/* Tax + Take-Home row */}
        <div id="section-tax">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TaxBreakdownCard
            title="2. Tax & Social Contributions"
            rows={taxRows}
            netAnnual={taxBreakdown.netAnnual}
            grossAnnual={taxBreakdown.grossAnnual}
            effectiveTaxRate={taxBreakdown.effectiveTaxRate}
            donutSlices={donutSlices}
            donutCenterLabel="Net Annual"
            donutCenterValue={displayFormat(taxBreakdown.netAnnual)}
            formatCurrency={displayFormat}
            infoNotes={taxInfoNotes}
          />
          <TakeHomeCard
            subtitle="After Income Tax, Soli & Social Contributions"
            netMonthly={taxBreakdown.netMonthly}
            netMonthlyInr={monthlyInr}
            netAnnual={taxBreakdown.netAnnual}
            totalDeductions={taxBreakdown.totalDeductions}
            formatCurrency={displayFormat}
            extraRows={[
              {
                label: "Social contributions",
                value: formatEur(taxBreakdown.totalSocialContributions),
                color: "#ff9999",
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
          netMonthly={taxBreakdown.netMonthly}
        />
        </div>

        {/* Savings + Timeline */}
        <div id="section-savings">
        <SavingsCard
          monthlySavingsLocal={savings.monthlySavingsEur}
          monthlySavingsInr={savings.monthlySavingsInr}
          monthlyTakeHomeLocal={savings.monthlyTakeHomeEur}
          monthlyCostLocal={savings.monthlyCostEur}
          isNegativeSavings={savings.isNegativeSavings}
          formatCurrency={displayFormat}
        />
        </div>
        <div id="section-migration">
        <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <div id="section-comparison">
        <CountryComparisonTable rows={comparisonRows} currentCountryCode="de" />
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
