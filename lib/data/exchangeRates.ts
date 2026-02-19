/**
 * Shared exchange-rate fetcher.
 * Queries open.er-api.com for a live CURRENCY→INR rate, with hourly revalidation.
 * Falls back to the CSV-sourced rate on any failure.
 */
export async function getLiveRate(
  currency: string,
  fallback: number,
): Promise<{ rate: number; isLive: boolean; date: string }> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const rate = data?.rates?.INR;
    if (typeof rate === "number" && rate > 0) {
      return { rate, isLive: true, date: new Date().toISOString().slice(0, 10) };
    }
    throw new Error("No INR rate");
  } catch {
    return { rate: fallback, isLive: false, date: new Date().toISOString().slice(0, 10) };
  }
}
