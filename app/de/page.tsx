import { loadCountryData } from "@/lib/data/loader";
import { getCountry, COUNTRIES } from "@/lib/config/countries";
import { getLiveRate } from "@/lib/data/exchangeRates";
import { DePageClient } from "./DePageClient";
import type { CountryData } from "@/lib/data/types";

export default async function DePage() {
  // Load data for all available countries
  const availableCodes = COUNTRIES.filter((c) => c.available).map((c) => c.code);
  const allCountryData: Record<string, CountryData> = {};
  for (const code of availableCodes) {
    allCountryData[code] = loadCountryData(code);
  }

  const config = getCountry("de")!;

  // Fetch live exchange rates for all available countries in parallel
  const rateResults = await Promise.all(
    availableCodes.map(async (code) => {
      const currency = COUNTRIES.find((c) => c.code === code)!.currency;
      const fallback = allCountryData[code].currencyRate.rateToInr;
      const result = await getLiveRate(currency, fallback);
      return { code, ...result };
    }),
  );

  const allRates: Record<string, number> = {};
  let deRate = { rate: 0, isLive: false, date: "" };
  for (const r of rateResults) {
    allRates[r.code] = r.rate;
    if (r.code === "de") {
      deRate = { rate: r.rate, isLive: r.isLive, date: r.date };
    }
  }

  return (
    <DePageClient
      data={allCountryData["de"]}
      config={config}
      liveRate={deRate.rate}
      rateIsLive={deRate.isLive}
      rateDate={deRate.date}
      allCountryData={allCountryData}
      allRates={allRates}
    />
  );
}
