import { NextResponse } from "next/server";

/**
 * GET /api/burn
 *
 * Server-side proxy for the PandaSui burn endpoint.
 * Proxying avoids browser CORS restrictions and gives us a single
 * place to apply caching, error shaping, and future auth/headers.
 *
 * Upstream URL is configured via PANDASUI_BURN_URL in .env
 */

// Cache the upstream response at the edge for 60s to avoid hammering
// the third-party API on every page view.
export const revalidate = 60;

export async function GET() {
  const upstreamUrl = process.env.PANDASUI_BURN_URL;

  if (!upstreamUrl) {
    return NextResponse.json(
      {
        error: "missing_config",
        message: "PANDASUI_BURN_URL is not set",
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
