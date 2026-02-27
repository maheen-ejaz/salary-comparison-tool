/**
 * Shared exchange-rate fetcher.
 * Queries open.er-api.com for a live CURRENCY→INR rate, with hourly revalidation.
 * Falls back to the CSV-sourced rate on any failure.
 */

const VALID_CURRENCIES = new Set(["GBP", "AUD", "CAD", "AED", "NZD", "EUR"]);

// Reasonable bounds for X→INR rates (current range ~23–110; 500 gives 5x headroom)
const RATE_LOWER_BOUND = 1;
const RATE_UPPER_BOUND = 500;

export async function getLiveRate(
  currency: string,
  fallback: number,
): Promise<{ rate: number; isLive: boolean; date: string }> {
  const today = new Date().toISOString().slice(0, 10);

  const upperCurrency = currency.toUpperCase();
  if (!VALID_CURRENCIES.has(upperCurrency)) {
    return { rate: fallback, isLive: false, date: today };
  }

  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${encodeURIComponent(upperCurrency)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    const rate = data?.rates?.INR;

    if (
      typeof rate === "number" &&
      rate > RATE_LOWER_BOUND &&
      rate < RATE_UPPER_BOUND
    ) {
      return { rate, isLive: true, date: today };
    }

    throw new Error("Rate out of bounds");
  } catch {
    return { rate: fallback, isLive: false, date: today };
  }
}
