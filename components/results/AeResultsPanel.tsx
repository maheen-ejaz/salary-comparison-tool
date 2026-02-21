"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateAeTakeHome,
  calculateAeSavings,
  formatAed,
  formatInr,
} from "@/lib/calc/ae/taxCalculator";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import { SalarySelector } from "./SalarySelector";
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
import { DonutChart } from "@/components/charts/DonutChart";
import type { DonutSlice } from "@/components/charts/types";
import { Info, DollarSign } from "lucide-react";
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
  const [displayCurrency, setDisplayCurrency] = useState<"local" | "inr">("local");

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

  const displayFormat = displayCurrency === "inr"
    ? (amount: number) => formatInr(Math.round(amount * liveRate))
    : formatAed;

  const monthlyInr = Math.round(taxBreakdown.netMonthly * liveRate);

  const donutSlices: DonutSlice[] = [
    ...(taxBreakdown.incomeTax > 0 ? [{ label: "Income Tax", value: taxBreakdown.incomeTax, color: "var(--error-600)" }] : []),
    ...(taxBreakdown.socialSecurity > 0 ? [{ label: "Social Security", value: taxBreakdown.socialSecurity, color: "var(--warning-600)" }] : []),
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

  // Gross display extra: INR per year
  const grossExtra = (
    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: "var(--neutral-500)" }}>
      <Info size={11} />
      <span>{formatInr(grossAnnual * liveRate)} per year</span>
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "var(--neutral-50)" }}>
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
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2"
            style={{
              background: rateIsLive ? "var(--success-100)" : "var(--warning-100)",
              color: rateIsLive ? "var(--success-600)" : "var(--warning-600)",
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rateIsLive ? "bg-green-500" : "bg-amber-500"}`} />
            Exchange rate: AED 1 = INR {liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
          </div>
          <CurrencyToggle localLabel="AED" displayCurrency={displayCurrency} onChange={setDisplayCurrency} />
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

        {/* Tax Breakdown (Zero Tax — kept inline for unique success styling) */}
        <div id="section-tax">
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            2. Tax & Deductions
          </h2>

          <DonutChart
            slices={donutSlices}
            grossTotal={taxBreakdown.grossAnnual}
            centerLabel="Tax-Free"
            centerValue={displayFormat(taxBreakdown.netAnnual)}
            formatValue={displayFormat}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-medium" style={{ color: "var(--neutral-900)" }}>
                Gross Annual Salary
              </span>
              <span className="text-sm font-bold" style={{ color: "var(--success-600)" }}>
                {displayFormat(taxBreakdown.grossAnnual)}
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
                {displayFormat(taxBreakdown.netAnnual)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg text-center" style={{ background: "var(--success-50)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--success-600)" }}>
              Effective Tax Rate: 0% — No deductions
            </p>
          </div>
        </div>
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
          currencyLabel="AED"
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
          monthlySavingsLocal={savings.monthlySavingsAed}
          monthlySavingsInr={savings.monthlySavingsInr}
          monthlyTakeHomeLocal={savings.monthlyTakeHomeAed}
          monthlyCostLocal={savings.monthlyCostAed}
          isNegativeSavings={savings.isNegativeSavings}
          formatCurrency={displayFormat}
        />
        </div>

        {/* Migration Timeline */}
        <div id="section-migration">
        <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <div id="section-comparison">
        <CountryComparisonTable rows={comparisonRows} currentCountryCode="ae" />
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
