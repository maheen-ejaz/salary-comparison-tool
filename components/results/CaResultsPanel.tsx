"use client";

import { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateCaTakeHome,
  calculateCaSavings,
  formatCad,
  formatInr,
  formatInrLakh,
  CITY_TO_PROVINCE,
} from "@/lib/calc/ca/taxCalculator";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import Link from "next/link";
import { ArrowLeft, Info, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

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
  Premium: "Family, high quality — 2-3 bed, private health + dental",
};

const PROVINCE_NAMES: Record<string, string> = {
  ON: "Ontario",
  BC: "British Columbia",
  AB: "Alberta",
  QC: "Quebec",
  MB: "Manitoba",
};

export function CaResultsPanel({ data, config, leadName, liveRate, rateIsLive, rateDate, allCountryData, allRates }: Props) {
  const defaultBand = data.salaryBands.find(
    (b) => b.careerStage === "Resident (PGY1)" && b.sector === "Public (Provincial Health)"
  )!;
  const defaultCoL = data.costOfLiving.find(
    (r) => r.city === "Toronto" && r.lifestyleLevel === "Moderate" && r.rentType === "1BHK"
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

  const province = CITY_TO_PROVINCE[selectedCoL.city] ?? "ON";

  const taxBreakdown = useMemo(
    () => calculateCaTakeHome(grossAnnual, data.taxRules, province),
    [grossAnnual, data.taxRules, province]
  );

  const savings = useMemo(
    () =>
      calculateCaSavings(
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
        currentCountry: "ca",
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
    { label: "Utilities & Rates", value: selectedCoL.monthlyUtilities },
    { label: "Transport", value: selectedCoL.monthlyTransport },
    { label: "Groceries", value: selectedCoL.monthlyGroceries },
    ...(selectedCoL.monthlySchoolFees > 0 ? [{ label: "School Fees", value: selectedCoL.monthlySchoolFees }] : []),
    { label: "Dining Out", value: selectedCoL.monthlyDining },
    { label: "Healthcare", value: selectedCoL.monthlyHealthcare },
    { label: "Miscellaneous", value: selectedCoL.monthlyMisc },
  ].filter((item) => item.value > 0);

  // Tax breakdown rows
  const taxRows = [
    { label: "Gross Annual Salary", value: taxBreakdown.grossAnnual, isGross: true },
    { label: "Federal Income Tax", value: -taxBreakdown.federalTax, isDeduction: true },
    { label: `Provincial Tax (${PROVINCE_NAMES[province] ?? province})`, value: -taxBreakdown.provincialTax, isDeduction: true },
    ...(taxBreakdown.ontarioHealthPremium > 0 ? [{ label: "Ontario Health Premium", value: -taxBreakdown.ontarioHealthPremium, isDeduction: true }] : []),
    { label: taxBreakdown.isQuebec ? "QPP Contribution" : "CPP Contribution", value: -taxBreakdown.cppContribution, isDeduction: true },
    { label: "EI Premium", value: -taxBreakdown.eiContribution, isDeduction: true },
  ];

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
            {leadName ? `Hi Dr. ${leadName.split(" ")[0]}, here's your Canada breakdown` : "Your Canada Salary Breakdown"}
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
          Exchange rate: C$1 = ₹{liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
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
              {selectedBand.estimationFlag && (
                <p className="mt-1 text-xs flex items-center gap-1" style={{ color: "var(--warning-600)" }}>
                  <Info size={11} />
                  Fee-for-service figures are gross billings — 25-40% goes to overhead costs
                </p>
              )}
            </div>
          </div>

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
                      onClick={() => setSalaryPoint(point)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all text-center"
                      style={{
                        background: salaryPoint === point ? "var(--primary-700)" : "var(--neutral-100)",
                        color: salaryPoint === point ? "white" : "var(--neutral-600)",
                        border: salaryPoint === point ? "1.5px solid var(--primary-700)" : "1.5px solid var(--neutral-200)",
                      }}
                    >
                      <div>{labels[point]}</div>
                      <div className="text-xs tabular-nums font-normal opacity-80">{formatCad(values[point])}</div>
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
                  {formatCad(grossAnnual)}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 mt-2 text-xs"
              style={{ color: "var(--neutral-500)" }}
            >
              <Info size={11} />
              <span>
                Tax computed for {PROVINCE_NAMES[province] ?? province} ({province}). Change city below to see other provinces.
              </span>
            </div>
          </div>
        </div>

        {/* ============ 2. TAX BREAKDOWN + 3. TAKE-HOME ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tax Breakdown */}
          <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
            <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
              2. Tax Breakdown ({province})
            </h2>

            <div className="space-y-2 mb-4">
              {taxRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--neutral-100)" }}>
                  <span className="text-sm" style={{ color: row.isGross ? "var(--neutral-900)" : "var(--neutral-600)" }}>
                    {row.label}
                  </span>
                  <span
                    className="text-sm font-semibold tabular-nums"
                    style={{ color: row.isDeduction ? "var(--error-600)" : "var(--neutral-900)" }}
                  >
                    {row.isDeduction ? "−" : ""}{formatCad(Math.abs(row.value))}
                  </span>
                </div>
              ))}

              {/* Net */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold" style={{ color: "var(--neutral-900)" }}>Net Annual</span>
                <span className="font-bold text-lg tabular-nums" style={{ color: "var(--success-600)" }}>
                  {formatCad(taxBreakdown.netAnnual)}
                </span>
              </div>
            </div>

            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
            >
              Effective tax rate: <strong>{taxBreakdown.effectiveTaxRate}%</strong> of gross salary
            </div>

            {taxBreakdown.isQuebec && (
              <div
                className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
                style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
              >
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>Quebec uses QPP (6.4%) instead of CPP (5.95%) and has a 16.5% federal tax abatement. Provincial rates are higher but offset partially by the abatement.</span>
              </div>
            )}
          </div>

          {/* Take-Home Card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--primary-900)", border: "1px solid var(--primary-700)" }}
          >
            <h2 className="text-lg font-bold mb-1 text-white">Monthly Take-Home</h2>
            <p className="text-sm mb-6" style={{ color: "var(--primary-200)" }}>
              After Federal Tax, Provincial Tax, CPP & EI
            </p>

            <div className="space-y-1 mb-6">
              <p className="text-4xl font-bold tabular-nums text-white">
                {formatCad(taxBreakdown.netMonthly)}
              </p>
              <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent-400)" }}>
                {formatInr(monthlyInr)}
              </p>
            </div>

            <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Annual take-home</span>
                <span className="tabular-nums text-white">{formatCad(taxBreakdown.netAnnual)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Total deductions</span>
                <span className="tabular-nums" style={{ color: "#ff9999" }}>{formatCad(taxBreakdown.totalDeductions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Province</span>
                <span className="tabular-nums text-white">{PROVINCE_NAMES[province]} ({province})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ 3. COST OF LIVING ============ */}
        <div className="rounded-2xl p-6 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-5" style={{ color: "var(--primary-900)" }}>
            3. Cost of Living
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>City</label>
              <select
                value={selectedCoL.city}
                onChange={(e) => handleColChange(e.target.value, selectedCoL.lifestyleLevel, selectedCoL.rentType)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)", color: "var(--neutral-900)" }}
              >
                {config.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>Lifestyle</label>
              <select
                value={selectedCoL.lifestyleLevel}
                onChange={(e) => handleColChange(selectedCoL.city, e.target.value as LifestyleLevel, selectedCoL.rentType)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)", color: "var(--neutral-900)" }}
              >
                {config.lifestyleLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <p className="mt-1 text-xs" style={{ color: "var(--neutral-400)" }}>
                {LIFESTYLE_DESCRIPTIONS[selectedCoL.lifestyleLevel]}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--neutral-700)" }}>Accommodation</label>
              <select
                value={selectedCoL.rentType}
                onChange={(e) => handleColChange(selectedCoL.city, selectedCoL.lifestyleLevel, e.target.value as RentType)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--neutral-200)", background: "var(--neutral-50)", color: "var(--neutral-900)" }}
              >
                {config.rentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quebec French warning */}
          {selectedCoL.city === "Montreal" && (
            <div
              className="mb-4 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
            >
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              <span>French proficiency is required to practice medicine in Quebec. The OQLF may require proof of French language ability for medical licensing.</span>
            </div>
          )}

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--neutral-100)" }}>
            {colBreakdown.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
                style={{ background: i % 2 === 0 ? "var(--neutral-50)" : "white" }}
              >
                <span style={{ color: "var(--neutral-600)" }}>{item.label}</span>
                <span className="tabular-nums font-medium" style={{ color: "var(--neutral-900)" }}>
                  {formatCad(item.value)}
                </span>
              </div>
            ))}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "var(--primary-50)", borderTop: "1.5px solid var(--primary-100)" }}
            >
              <span className="font-semibold" style={{ color: "var(--primary-900)" }}>Total Monthly Cost</span>
              <span className="font-bold tabular-nums text-lg" style={{ color: "var(--primary-900)" }}>
                {formatCad(selectedCoL.totalMonthlyCost)}
              </span>
            </div>
          </div>

          {selectedCoL.lifestyleLevel === "Premium" && selectedCoL.rentType === "Family (2-3 BHK)" && selectedCoL.monthlySchoolFees === 0 && (
            <div
              className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{ background: "var(--warning-100)", color: "var(--warning-600)" }}
            >
              <AlertTriangle size={13} className="mt-0.5 shrink-0" />
              <span>Private school fees (C$500–C$2,000/month) are not included above. Public school = C$0.</span>
            </div>
          )}
        </div>

        {/* ============ 4. SAVINGS + MIGRATION ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Savings Card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: isNeg ? "var(--error-100)" : "var(--success-100)",
              border: `1px solid ${isNeg ? "var(--error-600)" : "var(--success-600)"}`,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-lg font-bold" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)" }}>
                Monthly Savings
              </h2>
              {isNeg ? (
                <TrendingDown size={20} style={{ color: "var(--error-600)" }} />
              ) : (
                <TrendingUp size={20} style={{ color: "var(--success-600)" }} />
              )}
            </div>
            <p className="text-sm mb-5" style={{ color: isNeg ? "var(--error-600)" : "var(--success-600)", opacity: 0.8 }}>
              Take-home minus estimated living costs
            </p>

            {isNeg ? (
              <div>
                <p className="text-3xl font-bold tabular-nums" style={{ color: "var(--error-600)" }}>
                  {formatCad(savings.monthlySavingsCad)}
                </p>
                <p className="text-sm mt-3 font-medium" style={{ color: "var(--error-600)" }}>
                  At this lifestyle + city combination, expenses exceed take-home pay. Consider a different city or accommodation type.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-4xl font-bold tabular-nums" style={{ color: "var(--success-600)" }}>
                  {formatCad(savings.monthlySavingsCad)}
                </p>
                <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--neutral-700)" }}>
                  {formatInrLakh(savings.monthlySavingsInr)}
                </p>
                <p className="text-sm tabular-nums" style={{ color: "var(--neutral-500)" }}>
                  ({formatInr(savings.monthlySavingsInr)})
                </p>
              </div>
            )}

            {!isNeg && (
              <div className="mt-5 pt-4" style={{ borderTop: `1px solid rgba(26,122,74,0.15)` }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--neutral-600)" }}>Annual savings</span>
                  <span className="tabular-nums font-semibold" style={{ color: "var(--success-600)" }}>
                    {formatInrLakh(savings.monthlySavingsInr * 12)}/year
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Migration Timeline */}
          <MigrationTimelineCard savings={savings} migrationCosts={data.migrationCosts} />
        </div>

        {/* Country Comparison */}
        <CountryComparisonTable
          rows={comparisonRows}
          currentCountryCode="ca"
        />

        {/* ============ DISCLAIMER ============ */}
        <div
          className="rounded-2xl px-6 py-5 text-sm space-y-2"
          style={{
            background: "var(--neutral-100)",
            border: "1px solid var(--neutral-200)",
            color: "var(--neutral-600)",
          }}
        >
          <p className="font-semibold" style={{ color: "var(--neutral-700)" }}>Important Disclaimers</p>
          <ul className="space-y-1.5 list-none">
            {[
              "For planning purposes only. Actual take-home pay depends on your personal tax situation, RRSP contributions, and other individual circumstances.",
              "Fee-for-service salary figures are gross billings before overhead (25-40%). Net income after overhead is substantially lower.",
              "Tax calculations are based on 2025 CRA federal and provincial rates. CMPA fees are NOT included and vary by specialty ($3,000–$60,000+/year).",
              "CPP/QPP and EI premiums are mandatory payroll deductions. Quebec uses QPP (6.4%) instead of CPP (5.95%) with a 16.5% federal tax abatement.",
              "Cost of living figures reflect city-wide averages. Actual costs vary by neighbourhood and personal choices.",
              "Currency exchange rates change daily. All INR figures use the rate shown at the top of the page.",
              "Migration costs shown are estimates for the MCC Standard Pathway. Verify current MCC and CPSO/CPSBC fees at mcc.ca.",
              "CaRMS match rate for IMGs is approximately 30-35% in the first iteration — securing a residency position is competitive.",
              "Quebec requires French language proficiency for medical practice. Check OQLF requirements before choosing Montreal.",
              "Data verified February 2026. Consult a qualified financial adviser and registered immigration consultant (RCIC) before making decisions.",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "var(--neutral-400)" }} />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
