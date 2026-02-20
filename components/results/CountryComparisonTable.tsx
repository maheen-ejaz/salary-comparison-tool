"use client";

import type { ComparisonRow } from "@/lib/calc/comparisonCalculator";
import { formatInrLakh, formatMonths } from "@/lib/calc/uk/taxCalculator";
import { COUNTRIES } from "@/lib/config/countries";
import { Lock } from "lucide-react";

interface Props {
  rows: ComparisonRow[];
  currentCountryCode: string;
}

function formatLocalCurrency(symbol: string, amount: number): string {
  return `${symbol}${Math.round(amount).toLocaleString("en")}`;
}

export function CountryComparisonTable({ rows, currentCountryCode }: Props) {
  // Merge available rows with unavailable countries (not in rows)
  const availableCodes = new Set(rows.filter((r) => r.available).map((r) => r.countryCode));
  const unavailableCountries = COUNTRIES.filter((c) => !c.available && !availableCodes.has(c.code));

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

      <div className="overflow-x-auto">
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
            {/* Available country rows with real data */}
            {rows
              .filter((r) => r.available)
              .sort((a, b) => (a.isCurrentCountry === b.isCurrentCountry ? 0 : a.isCurrentCountry ? -1 : 1))
              .map((row) => (
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
                        <div className="font-semibold" style={{ color: "var(--primary-900)" }}>
                          {row.countryName}
                          {row.isCurrentCountry && (
                            <span className="text-xs font-normal ml-1.5" style={{ color: "var(--neutral-500)" }}>
                              (your selection)
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

            {/* Unavailable "Coming Soon" rows */}
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
    </div>
  );
}
