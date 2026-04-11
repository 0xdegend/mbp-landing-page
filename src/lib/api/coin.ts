/**
 * Client-side fetcher for the $MBP coin data.
 *
 * Hits our own Next.js proxy route (/api/coin) rather than the
 * upstream PandaSui endpoint directly. The proxy handles CORS,
 * caching, and error shaping.
 *
 * The response shape is intentionally permissive — we'll tighten
 * the types once we've confirmed the payload from the console.log
 * output during integration.
 */

export type CoinResponse = {
  // Known fields we expect to see — will be tightened after inspection
  coin_type?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  total_supply?: number | string;
  circulating_supply?: number | string;
  price?: number | string;
  holders?: number;
  // Anything else the upstream includes
  [key: string]: unknown;
};

export type CoinFetchResult =
  | { ok: true; data: CoinResponse }
  | { ok: false; error: string };

export async function fetchCoinData(
  signal?: AbortSignal,
): Promise<CoinFetchResult> {
  try {
    const res = await fetch("/api/coin", {
      method: "GET",
      headers: { accept: "application/json" },
      signal,
    });

    if (!res.ok) {
      return {
        ok: false,
        error: `HTTP ${res.status} ${res.statusText}`,
      };
    }

    const data = (await res.json()) as CoinResponse;
    return { ok: true, data };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "aborted" };
    }
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
