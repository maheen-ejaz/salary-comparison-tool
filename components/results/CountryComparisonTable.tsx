"use client";

import type { ComparisonRow } from "@/lib/calc/comparisonCalculator";
import { formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";
import { COUNTRIES } from "@/lib/config/countries";
import { Lock, Trophy, Zap } from "lucide-react";

interface Props {
  rows: ComparisonRow[];
  currentCountryCode: string;
}

function formatLocalCurrency(symbol: string, amount: number): string {
  return `${symbol}${Math.round(amount).toLocaleString("en")}`;
}

export function CountryComparisonTable({ rows, currentCountryCode }: Props) {
  const availableRows = rows.filter((r) => r.available && !r.dataUnavailable);
  const availableCodes = new Set(rows.filter((r) => r.available).map((r) => r.countryCode));
  const unavailableCountries = COUNTRIES.filter((c) => !c.available && !availableCodes.has(c.code));

  // Compute badges
  const positiveRows = availableRows.filter((r) => !r.isNegativeSavings);
  const bestSavingsCode = positiveRows.length > 0
    ? positiveRows.reduce((best, r) => (r.monthlySavingsInr > best.monthlySavingsInr ? r : best)).countryCode
    : null;
  const fastestRecoveryCode = positiveRows.length > 0
    ? positiveRows.reduce((best, r) => (r.recoveryMonthsTypical < best.recoveryMonthsTypical ? r : best)).countryCode
    : null;

  const allRows = rows.filter((r) => r.available).sort((a, b) => (a.isCurrentCountry === b.isCurrentCountry ? 0 : a.isCurrentCountry ? -1 : 1));

  return (
    <div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid var(--neutral-200)" }}>
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--neutral-100)" }}>
        <h2 className="text-lg font-bold" style={{ color: "var(--primary-900)" }}>
          Country Comparison
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--neutral-600)" }}>
          Same career level, moderate lifestyle, 1BHK in each country&apos;s major city.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--neutral-100)" }}>
              <th className="text-left px-6 py-3 font-medium" style={{ color: "var(--neutral-600)" }}>Country</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--neutral-600)" }}>Monthly Take-Home</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: "var(--neutral-600)" }}>Monthly Savings</th>
              <th className="text-right px-6 py-3 font-medium" style={{ color: "var(--neutral-600)" }}>Break-Even</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((row) => (
              <tr
                key={row.countryCode}
                style={{
                  borderBottom: "1px solid var(--neutral-100)",
                  background: row.isCurrentCountry ? "var(--primary-50)" : "white",
                }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{row.flag}</span>
                    <div>
                      <div className="font-semibold flex items-center gap-1.5 flex-wrap" style={{ color: "var(--primary-900)" }}>
                        {row.countryName}
                        {row.isCurrentCountry && (
                          <span className="text-xs font-normal" style={{ color: "var(--neutral-500)" }}>
                            (your selection)
                          </span>
                        )}
                        {!row.dataUnavailable && bestSavingsCode === row.countryCode && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: "var(--success-100)", color: "var(--success-600)" }}
                          >
                            <Trophy size={10} /> Best Savings
                          </span>
                        )}
                        {!row.dataUnavailable && fastestRecoveryCode === row.countryCode && fastestRecoveryCode !== bestSavingsCode && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}
                          >
                            <Zap size={10} /> Fastest Break-Even
                          </span>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: "var(--neutral-500)" }}>
                        {row.isCurrentCountry ? "Your selected lifestyle" : `${row.cityLabel} · ${row.lifestyleLabel} · ${row.rentTypeLabel}`}
                      </div>
                    </div>
                  </div>
                </td>
                {row.dataUnavailable ? (
                  <>
                    <td className="px-4 py-4 text-right" style={{ color: "var(--neutral-400)" }}>
                      <div className="text-xs">Data unavailable</div>
                    </td>
                    <td className="px-4 py-4 text-right" style={{ color: "var(--neutral-400)" }}>—</td>
                    <td className="px-6 py-4 text-right" style={{ color: "var(--neutral-400)" }}>—</td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-4 text-right tabular-nums">
                      <div className="font-semibold" style={{ color: "var(--neutral-900)" }}>
                        {formatLocalCurrency(row.currencySymbol, row.monthlyTakeHomeLocal)}
                      </div>
                      <div className="text-xs" style={{ color: "var(--neutral-500)" }}>
                        {formatInrLakh(row.monthlyTakeHomeInr)}/mo
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right tabular-nums">
                      <div
                        className="font-semibold"
                        style={{ color: row.isNegativeSavings ? "var(--error-600)" : "var(--success-600)" }}
                      >
                        {row.isNegativeSavings ? "−" : ""}{formatInrLakh(Math.abs(row.monthlySavingsInr))}/mo
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      <div className="font-semibold" style={{ color: "var(--primary-700)" }}>
                        {row.isNegativeSavings ? "N/A" : formatMonths(row.recoveryMonthsTypical)}
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {unavailableCountries.map((country) => (
              <tr key={country.code} style={{ borderBottom: "1px solid var(--neutral-100)", opacity: 0.5 }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ filter: "grayscale(1)" }}>{country.flag}</span>
                    <div>
                      <div className="font-medium" style={{ color: "var(--neutral-600)" }}>{country.name}</div>
                      <div className="text-xs flex items-center gap-1" style={{ color: "var(--neutral-400)" }}>
                        <Lock size={10} /> Coming Soon
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-right" style={{ color: "var(--neutral-300)" }}>—</td>
                <td className="px-4 py-4 text-right" style={{ color: "var(--neutral-300)" }}>—</td>
                <td className="px-6 py-4 text-right" style={{ color: "var(--neutral-300)" }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card stack */}
      <div className="md:hidden space-y-3 p-4">
        {allRows.map((row) => (
          <div
            key={row.countryCode}
            className="rounded-xl p-4"
            style={{
              border: row.isCurrentCountry ? "2px solid var(--primary-500)" : "1px solid var(--neutral-200)",
              background: row.isCurrentCountry ? "var(--primary-50)" : "white",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{row.flag}</span>
              <div>
                <div className="font-semibold flex items-center gap-1.5 flex-wrap" style={{ color: "var(--primary-900)" }}>
                  {row.countryName}
                  {row.isCurrentCountry && (
                    <span className="text-xs font-normal" style={{ color: "var(--neutral-500)" }}>(you)</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {!row.dataUnavailable && bestSavingsCode === row.countryCode && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--success-100)", color: "var(--success-600)" }}
                    >
                      <Trophy size={10} /> Best Savings
                    </span>
                  )}
                  {!row.dataUnavailable && fastestRecoveryCode === row.countryCode && fastestRecoveryCode !== bestSavingsCode && (
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ background: "var(--primary-100)", color: "var(--primary-700)" }}
                    >
                      <Zap size={10} /> Fastest Break-Even
                    </span>
                  )}
                </div>
              </div>
            </div>

            {row.dataUnavailable ? (
              <p className="text-xs" style={{ color: "var(--neutral-400)" }}>Data unavailable for this career stage</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--neutral-500)" }}>Take-Home</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: "var(--neutral-900)" }}>
                    {formatInrLakh(row.monthlyTakeHomeInr)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--neutral-500)" }}>Savings</p>
                  <p
                    className="text-sm font-bold tabular-nums"
                    style={{ color: row.isNegativeSavings ? "var(--error-600)" : "var(--success-600)" }}
                  >
                    {row.isNegativeSavings ? "−" : ""}{formatInrLakh(Math.abs(row.monthlySavingsInr))}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--neutral-500)" }}>Break-Even</p>
                  <p className="text-sm font-bold tabular-nums" style={{ color: "var(--primary-700)" }}>
                    {row.isNegativeSavings ? "N/A" : formatMonths(row.recoveryMonthsTypical)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {unavailableCountries.map((country) => (
          <div
            key={country.code}
            className="rounded-xl p-4 opacity-50"
            style={{ border: "1px solid var(--neutral-200)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl" style={{ filter: "grayscale(1)" }}>{country.flag}</span>
              <div>
                <div className="font-medium" style={{ color: "var(--neutral-600)" }}>{country.name}</div>
                <div className="text-xs flex items-center gap-1" style={{ color: "var(--neutral-400)" }}>
                  <Lock size={10} /> Coming Soon
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
