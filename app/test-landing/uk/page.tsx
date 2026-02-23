import { loadCountryData } from "@/lib/data/loader";
import { getCountry, COUNTRIES } from "@/lib/config/countries";
import { getLiveRate } from "@/lib/data/exchangeRates";
import { UkPageClient } from "@/app/uk/UkPageClient";
import type { CountryData } from "@/lib/data/types";

const monoWarmGradient = `
  radial-gradient(ellipse 60% 50% at 25% 15%, rgba(217, 119, 6, 0.1) 0%, transparent 70%),
  radial-gradient(ellipse 55% 55% at 75% 25%, rgba(180, 83, 9, 0.07) 0%, transparent 65%),
  radial-gradient(ellipse 50% 45% at 40% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 60%),
  radial-gradient(ellipse 65% 40% at 80% 55%, rgba(194, 120, 3, 0.06) 0%, transparent 65%),
  radial-gradient(ellipse 55% 50% at 20% 80%, rgba(217, 119, 6, 0.08) 0%, transparent 70%),
  radial-gradient(ellipse 50% 40% at 70% 90%, rgba(245, 158, 11, 0.1) 0%, transparent 60%),
  #FDFBF7
`;

export default async function GlassUkPage() {
  const availableCodes = COUNTRIES.filter((c) => c.available).map((c) => c.code);
  const allCountryData: Record<string, CountryData> = {};
  for (const code of availableCodes) {
    allCountryData[code] = loadCountryData(code);
  }

  const config = getCountry("uk")!;

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
    <div className="glass-uk-theme" style={{ background: monoWarmGradient }}>
      <UkPageClient
        data={allCountryData["uk"]}
        config={config}
        liveRate={ukRate.rate}
        rateIsLive={ukRate.isLive}
        rateDate={ukRate.date}
        allCountryData={allCountryData}
        allRates={allRates}
      />
    </div>
  );
}
