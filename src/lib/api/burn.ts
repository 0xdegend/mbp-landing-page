/**
 * Client-side fetcher for the $MBP burn data.
 *
 * Hits our own Next.js proxy route (/api/burn) rather than the
 * upstream PandaSui endpoint directly. The proxy handles CORS,
 * caching, and error shaping.
 *
 * Upstream response shape (confirmed 2026-04-11):
 *   {
 *     "wallet": "0x0000...0000",   // dead wallet receiving burns
 *     "coin_type": "MBP",
 *     "balance": 183342735.59670585 // burned token balance (raw units)
 *   }
 */

export type BurnResponse = {
  /** Dead wallet address holding the burned tokens */
  wallet: string;
  /** Coin type identifier, e.g. "MBP" */
  coin_type: string;
  /** Total tokens burned (sitting in the dead wallet) */
  balance: number;
};

export type BurnFetchResult =
  | { ok: true; data: BurnResponse }
  | { ok: false; error: string };

export async function fetchBurnData(
  signal?: AbortSignal,
): Promise<BurnFetchResult> {
  try {
    const res = await fetch("/api/burn", {
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

    const data = (await res.json()) as BurnResponse;
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
