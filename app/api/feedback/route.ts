import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────
const feedbackSchema = z.object({
  country: z.string().min(1).max(100),
  sentiment: z.enum(["Positive", "Neutral", "Negative"]),
});

// ─── CORS ─────────────────────────────────────────────────────
const PRODUCTION_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

function getAllowedOrigins(): Set<string> {
  const origins = new Set<string>();
  if (PRODUCTION_URL) origins.add(PRODUCTION_URL);
  if (process.env.NODE_ENV === "development") {
    origins.add("http://localhost:3000");
  }
  return origins;
}

function getCorsHeaders(request: NextRequest): Record<string, string> {
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

// ─── Preflight ────────────────────────────────────────────────
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// ─── POST handler ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 415, headers: corsHeaders },
      );
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 2048) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413, headers: corsHeaders },
      );
    }

    const raw = await request.json();
    const result = feedbackSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400, headers: corsHeaders },
      );
    }

    const body = result.data;

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Feedback not saved.");
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: body.country,
        sentiment: body.sentiment,
        source: "gcworld-salary-tool-survey",
      }),
    });

    if (!webhookRes.ok) {
      console.warn(`Feedback webhook returned status ${webhookRes.status}`);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch {
    console.error("Feedback capture: unexpected error");
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  }
}
