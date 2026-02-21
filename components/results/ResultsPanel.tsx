"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import { calculateUkTakeHome, calculateSavings, formatGbp, formatInr } from "@/lib/calc/uk/taxCalculator";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import { SalarySelector } from "./SalarySelector";
import { TaxBreakdownCard } from "./TaxBreakdownCard";
import type { TaxRow } from "./TaxBreakdownCard";
import { TakeHomeCard } from "./TakeHomeCard";
import { CostOfLivingSelector } from "./CostOfLivingSelector";
import type { CostBreakdownItem } from "./CostOfLivingSelector";
import { SavingsCard } from "./SavingsCard";
import { CurrencyToggle } from "./CurrencyToggle";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { SectionNav } from "./SectionNav";
import type { NavSection } from "./SectionNav";
import { Info, AlertTriangle } from "lucide-react";
import type { DonutSlice } from "@/components/charts/types";

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

function tierLabel(rate: number): string {
  const tiers: Record<number, string> = { 5.2: "1", 6.5: "2", 8.3: "3", 9.8: "4", 10.7: "5", 12.5: "6" };
  return tiers[rate] ?? "?";
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
      (r) => r.city === "London" && r.lifestyleLevel === "Basic" && r.rentType === "Shared Accommodation"
    )!
  );
  const [displayCurrency, setDisplayCurrency] = useState<"local" | "inr">("local");

  const grossAnnual =
    salaryPoint === "min"
      ? selectedBand.grossAnnualMin
      : salaryPoint === "max"
      ? selectedBand.grossAnnualMax
      : selectedBand.grossAnnualTypical;

  const displayFormat = displayCurrency === "inr"
    ? (amount: number) => formatInr(Math.round(amount * liveRate))
    : formatGbp;

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

  const monthlyInr = Math.round(taxBreakdown.netMonthly * liveRate);

  // Build tax rows
  const taxRows: TaxRow[] = [
    { label: "Gross Annual Salary", value: taxBreakdown.grossAnnual, isGross: true },
    { label: "Income Tax", value: -taxBreakdown.incomeTax, isDeduction: true },
    { label: "National Insurance", value: -taxBreakdown.nationalInsurance, isDeduction: true },
    ...(taxBreakdown.nhsPension > 0
      ? [{ label: `NHS Pension (Tier ${tierLabel(taxBreakdown.nhsPensionTierRate)}, ${taxBreakdown.nhsPensionTierRate}%)`, value: -taxBreakdown.nhsPension, isDeduction: true }]
      : []),
  ];

  const donutSlices: DonutSlice[] = [
    { label: "Income Tax", value: taxBreakdown.incomeTax, color: "var(--error-600)" },
    { label: "National Insurance", value: taxBreakdown.nationalInsurance, color: "var(--warning-600)" },
    ...(taxBreakdown.nhsPension > 0
      ? [{ label: "NHS Pension", value: taxBreakdown.nhsPension, color: "var(--accent-600)" }]
      : []),
    { label: "Take-Home", value: taxBreakdown.netAnnual, color: "var(--success-600)" },
  ];

  // Build tax warnings
  const taxWarnings: React.ReactNode[] = [];
  if (taxBreakdown.isInPersonalAllowanceWithdrawalZone) {
    taxWarnings.push(
      <div className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg" style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}>
        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
        <span>Your salary is in the personal allowance withdrawal zone (GBP 100k–GBP 125,140). Effective marginal rate is 60% in this band.</span>
      </div>
    );
  }
  if (selectedCoL.city === "Edinburgh") {
    taxWarnings.push(
      <div className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg" style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}>
        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
        <span>Edinburgh doctors pay Scottish Income Tax rates, which differ from figures shown. Verify at <strong>mygov.scot</strong></span>
      </div>
    );
  }

  // Build CoL breakdown items
  const colBreakdown: CostBreakdownItem[] = [
    { label: "Rent", value: selectedCoL.monthlyRent },
    { label: "Utilities & Council Tax", value: selectedCoL.monthlyUtilities },
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
        <span>Private school fees (GBP 800–GBP 2,000/month) are not included above. State school = GBP 0.</span>
      </div>
    );
  }
  if (selectedCoL.city === "Edinburgh") {
    colWarnings.push(
      <div className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg" style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}>
        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
        <span>Edinburgh is in Scotland. Scottish Income Tax rates apply and differ from rUK rates shown in the tax breakdown above.</span>
      </div>
    );
  }

  // UK pension toggle as grossDisplayExtra
  const pensionToggle = (
    <label className="flex items-center gap-2 cursor-pointer text-sm mt-2" style={{ color: "var(--neutral-700)" }}>
      <span>Include NHS Pension</span>
      <div
        onClick={() => setIncludeNhsPension(!includeNhsPension)}
        className="relative rounded-full cursor-pointer transition-colors"
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
        <div className="flex items-center gap-3 flex-wrap">
          <div
            className="text-xs px-3 py-2 rounded-lg inline-flex items-center gap-2"
            style={{
              background: rateIsLive ? "var(--success-100)" : "var(--warning-100)",
              color: rateIsLive ? "var(--success-600)" : "var(--warning-600)",
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${rateIsLive ? "bg-green-500" : "bg-amber-500"}`} />
            Exchange rate: GBP 1 = INR {liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
          </div>
          <CurrencyToggle localLabel="GBP" displayCurrency={displayCurrency} onChange={setDisplayCurrency} />
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
            grossDisplayExtra={pensionToggle}
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
              warnings={taxWarnings}
            />
            <TakeHomeCard
              subtitle={`After Income Tax, NI${taxBreakdown.nhsPension > 0 ? " & NHS Pension" : ""}`}
              netMonthly={taxBreakdown.netMonthly}
              netMonthlyInr={monthlyInr}
              netAnnual={taxBreakdown.netAnnual}
              totalDeductions={taxBreakdown.totalDeductions}
              formatCurrency={displayFormat}
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
            warnings={colWarnings}
            netMonthly={taxBreakdown.netMonthly}
          />
        </div>

        {/* Savings + Timeline */}
        <div id="section-savings" className="space-y-6">
          <SavingsCard
            monthlySavingsLocal={savings.monthlySavingsGbp}
            monthlySavingsInr={savings.monthlySavingsInr}
            monthlyTakeHomeLocal={savings.monthlyTakeHomeGbp}
            monthlyCostLocal={savings.monthlyCostGbp}
            isNegativeSavings={savings.isNegativeSavings}
            formatCurrency={displayFormat}
          />
        </div>
        <div id="section-migration">
          <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <div id="section-comparison">
          <CountryComparisonTable
            rows={comparisonRows}
            currentCountryCode="uk"
          />
        </div>

        {/* Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
