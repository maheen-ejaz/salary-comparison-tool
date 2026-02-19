import { loadCountryData } from "@/lib/data/loader";
import { getCountry, COUNTRIES } from "@/lib/config/countries";
import { getLiveRate } from "@/lib/data/exchangeRates";
import { UkPageClient } from "./UkPageClient";
import type { CountryData } from "@/lib/data/types";

export default async function UkPage() {
  // Load data for all available countries
  const availableCodes = COUNTRIES.filter((c) => c.available).map((c) => c.code);
  const allCountryData: Record<string, CountryData> = {};
  for (const code of availableCodes) {
    allCountryData[code] = loadCountryData(code);
  }

  const config = getCountry("uk")!;

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
  let ukRate = { rate: 0, isLive: false, date: "" };
  for (const r of rateResults) {
    allRates[r.code] = r.rate;
    if (r.code === "uk") {
      ukRate = { rate: r.rate, isLive: r.isLive, date: r.date };
    }
  }

  return (
    <UkPageClient
      data={allCountryData["uk"]}
      config={config}
      liveRate={ukRate.rate}
      rateIsLive={ukRate.isLive}
      rateDate={ukRate.date}
      allCountryData={allCountryData}
      allRates={allRates}
    />
  );
}
