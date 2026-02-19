import { loadCountryData } from "@/lib/data/loader";
import { getCountry, COUNTRIES } from "@/lib/config/countries";
import { getLiveRate } from "@/lib/data/exchangeRates";
import { NzPageClient } from "./NzPageClient";
import type { CountryData } from "@/lib/data/types";

export default async function NzPage() {
  // Load data for all available countries
  const availableCodes = COUNTRIES.filter((c) => c.available).map((c) => c.code);
  const allCountryData: Record<string, CountryData> = {};
  for (const code of availableCodes) {
    allCountryData[code] = loadCountryData(code);
  }

  const config = getCountry("nz")!;

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
  let nzRate = { rate: 0, isLive: false, date: "" };
  for (const r of rateResults) {
    allRates[r.code] = r.rate;
    if (r.code === "nz") {
      nzRate = { rate: r.rate, isLive: r.isLive, date: r.date };
    }
  }

  return (
    <NzPageClient
      data={allCountryData["nz"]}
      config={config}
      liveRate={nzRate.rate}
      rateIsLive={nzRate.isLive}
      rateDate={nzRate.date}
      allCountryData={allCountryData}
      allRates={allRates}
    />
  );
}
