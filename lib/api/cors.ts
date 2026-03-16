import { NextRequest, NextResponse } from "next/server";

const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  if (PRODUCTION_URL) origins.add(PRODUCTION_URL);
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
  }
  return origins;
}

export function getCorsHeaders(request: NextRequest): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  const allowed = getAllowedOrigins();
  if (allowed.size > 0 && allowed.has(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };
  }
  return {};
}

export function optionsHandler(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}
