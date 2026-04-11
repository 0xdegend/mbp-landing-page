import { NextResponse } from "next/server";

/**
 * GET /api/coin
 *
 * Server-side proxy for the PandaSui coin endpoint.
 * Same pattern as /api/burn — the proxy handles CORS, caching,
 * and gives us a single place to shape errors or add auth later.
 *
 * Upstream URL is configured via PANDASUI_COIN_URL in .env
 */

// Cache the upstream response at the edge for 60s to avoid
// hammering PandaSui on every page view.
export const revalidate = 60;

export async function GET() {
  const upstreamUrl = process.env.PANDASUI_COIN_URL;

  if (!upstreamUrl) {
    return NextResponse.json(
      {
        error: "missing_config",
        message: "PANDASUI_COIN_URL is not set",
      },
      { status: 500 },
    );
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        {
          error: "upstream_error",
          status: upstream.status,
          statusText: upstream.statusText,
        },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "fetch_failed",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
