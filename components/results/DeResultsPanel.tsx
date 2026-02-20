"use client";

import React, { useState, useMemo } from "react";
import type { CountryData, SalaryBand, CostOfLivingRow, LifestyleLevel, RentType } from "@/lib/data/types";
import type { CountryConfig } from "@/lib/config/countries";
import {
  calculateDeTakeHome,
  calculateDeSavings,
  formatEur,
  formatInr,
  formatInrLakh,
} from "@/lib/calc/de/taxCalculator";
import { MigrationTimelineCard } from "./MigrationTimelineCard";
import { CountryComparisonTable } from "./CountryComparisonTable";
import { computeComparisonRows } from "@/lib/calc/comparisonCalculator";
import Link from "next/link";
import { ArrowLeft, Info, TrendingUp, TrendingDown, AlertTriangle, MapPin, Coins, Wallet, Crown, Users, Home, Building2 } from "lucide-react";
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
  Premium: "Family, high quality — 2-3 bed, private supplementary insurance",
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

  // Tax breakdown rows
  const taxRows = [
    { label: "Gross Annual Salary", value: taxBreakdown.grossAnnual, isGross: true },
    { label: "Income Tax (Einkommensteuer)", value: -taxBreakdown.incomeTax, isDeduction: true },
    ...(taxBreakdown.solidaritySurcharge > 0 ? [{ label: "Solidarity Surcharge (Soli)", value: -taxBreakdown.solidaritySurcharge, isDeduction: true }] : []),
    { label: "Health Insurance (Krankenversicherung)", value: -taxBreakdown.healthInsurance, isDeduction: true },
    { label: "Pension Insurance (Rentenversicherung)", value: -taxBreakdown.pensionInsurance, isDeduction: true },
    { label: "Unemployment Insurance", value: -taxBreakdown.unemploymentInsurance, isDeduction: true },
    { label: "Long-term Care (Pflegeversicherung)", value: -taxBreakdown.longTermCareInsurance, isDeduction: true },
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
              Budget 6-12 months and &#8377;1-3 lakh for language preparation before you can begin working.
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
          Exchange rate: &euro;1 = &#8377;{liveRate.toFixed(2)} ({rateIsLive ? "live" : `data from ${rateDate}`})
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
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all text-center cursor-pointer"
                      style={{
                        background: salaryPoint === point ? "var(--primary-700)" : "var(--neutral-100)",
                        color: salaryPoint === point ? "white" : "var(--neutral-600)",
                        border: salaryPoint === point ? "1.5px solid var(--primary-700)" : "1.5px solid var(--neutral-200)",
                      }}
                    >
                      <div>{labels[point]}</div>
                      <div className="text-xs tabular-nums font-normal opacity-80">{formatEur(values[point])}</div>
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
                  {formatEur(grossAnnual)}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 mt-2 text-xs"
              style={{ color: "var(--neutral-500)" }}
            >
              <Info size={11} />
              <span>
                {selectedBand.sector === "Public (TV-Ärzte Collective Agreement)"
                  ? "Based on TV-Ärzte/VKA 2024-25 collective agreement (Tarifvertrag)."
                  : "Based on market estimates for private hospital chains."}
              </span>
            </div>
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

        {/* ============ 2. TAX BREAKDOWN + 3. TAKE-HOME ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tax Breakdown */}
          <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
            <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
              2. Tax & Social Contributions
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
                    {row.isDeduction ? "\u2212" : ""}{formatEur(Math.abs(row.value))}
                  </span>
                </div>
              ))}

              {/* Net */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold" style={{ color: "var(--neutral-900)" }}>Net Annual</span>
                <span className="font-bold text-lg tabular-nums" style={{ color: "var(--success-600)" }}>
                  {formatEur(taxBreakdown.netAnnual)}
                </span>
              </div>
            </div>

            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{ background: "var(--neutral-100)", color: "var(--neutral-600)" }}
            >
              Effective tax rate: <strong>{taxBreakdown.effectiveTaxRate}%</strong> of gross salary
            </div>

            {/* Church tax note */}
            <div
              className="mt-3 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{ background: "var(--neutral-100)", color: "var(--neutral-500)" }}
            >
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>{taxBreakdown.churchTaxNote}</span>
            </div>

            {/* Steuerklasse note */}
            <div
              className="mt-2 flex items-start gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{ background: "var(--neutral-100)", color: "var(--neutral-500)" }}
            >
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>Assumes Steuerklasse I (single, no children). Married couples (Klasse III/V) or with children pay less. Long-term care includes 0.6% childless surcharge.</span>
            </div>
          </div>

          {/* Take-Home Card */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "var(--primary-900)", border: "1px solid var(--primary-700)" }}
          >
            <h2 className="text-lg font-bold mb-1 text-white">Monthly Take-Home</h2>
            <p className="text-sm mb-6" style={{ color: "var(--primary-200)" }}>
              After Income Tax, Soli & Social Contributions
            </p>

            <div className="space-y-1 mb-6">
              <p className="text-4xl font-bold tabular-nums text-white">
                {formatEur(taxBreakdown.netMonthly)}
              </p>
              <p className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent-400)" }}>
                {formatInr(monthlyInr)}
              </p>
            </div>

            <div className="space-y-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Annual take-home</span>
                <span className="tabular-nums text-white">{formatEur(taxBreakdown.netAnnual)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Total deductions</span>
                <span className="tabular-nums" style={{ color: "#ff9999" }}>{formatEur(taxBreakdown.totalDeductions)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--primary-200)" }}>Social contributions</span>
                <span className="tabular-nums" style={{ color: "#ff9999" }}>{formatEur(taxBreakdown.totalSocialContributions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ 3. COST OF LIVING ============ */}
        <div className="rounded-2xl p-8 bg-white" style={{ border: "1px solid var(--neutral-200)" }}>
          <h2 className="text-lg font-bold mb-6" style={{ color: "var(--primary-900)" }}>
            3. Cost of Living
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

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--neutral-100)" }}>
            {colBreakdown.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-2.5 text-sm"
                style={{ background: i % 2 === 0 ? "var(--neutral-50)" : "white" }}
              >
                <span style={{ color: "var(--neutral-600)" }}>{item.label}</span>
                <span className="tabular-nums font-medium" style={{ color: "var(--neutral-900)" }}>
                  {formatEur(item.value)}
                </span>
              </div>
            ))}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: "var(--primary-50)", borderTop: "1.5px solid var(--primary-100)" }}
            >
              <span className="font-semibold" style={{ color: "var(--primary-900)" }}>Total Monthly Cost</span>
              <span className="font-bold tabular-nums text-lg" style={{ color: "var(--primary-900)" }}>
                {formatEur(selectedCoL.totalMonthlyCost)}
              </span>
            </div>
          </div>
        </div>

        {/* ============ 4. SAVINGS + MIGRATION ============ */}
        {/* Savings Card */}
        <div
          className="rounded-2xl p-8"
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
                {formatEur(savings.monthlySavingsEur)}
              </p>
              <p className="text-sm mt-3 font-medium" style={{ color: "var(--error-600)" }}>
                At this lifestyle + city combination, expenses exceed take-home pay. Consider a different city or accommodation type.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-4xl font-bold tabular-nums" style={{ color: "var(--success-600)" }}>
                {formatEur(savings.monthlySavingsEur)}
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

        {/* Country Comparison */}
        <CountryComparisonTable
          rows={comparisonRows}
          currentCountryCode="de"
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
              "For planning purposes only. Actual take-home depends on Steuerklasse (tax class), church membership, number of children, and individual deductions (Werbungskosten, Sonderausgaben).",
              "Church tax (Kirchensteuer) is NOT included. If you register with a church, add 8-9% of your income tax to total deductions.",
              "Public sector pay is based on TV-Ärzte/VKA 2024-25 collective agreement. University hospitals (TV-Ärzte/TdL) and private chains may differ.",
              "Private hospital salary figures are market estimates. Actual compensation varies by hospital chain, specialty, and region.",
              "Chefarzt compensation is individually negotiated and varies enormously. Figures shown are broad market estimates.",
              "Social contributions assume GKV (statutory health insurance). Opting for PKV (private health insurance) changes contribution amounts.",
              "Solidarity surcharge (Soli) is 5.5% of income tax but only applies above a threshold (~€18,130 tax). Most junior doctors pay zero Soli.",
              "Cost of living figures reflect city-wide averages. Munich is significantly more expensive than other German cities.",
              "German B2 + Fachsprachprüfung are MANDATORY for medical practice. This is the single biggest barrier and cost for Indian doctors.",
              "A Berufserlaubnis (temporary license) may be available while awaiting full Approbation, allowing supervised practice.",
              "Currency exchange rates change daily. All INR figures use the rate shown at the top of the page.",
              "Data verified February 2026. Consult a qualified immigration lawyer (Rechtsanwalt für Ausländerrecht) before making decisions.",
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
