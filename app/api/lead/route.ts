import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ─── Validation ───────────────────────────────────────────────
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().min(7).max(20).regex(/^[\d\s\-+().]+$/),
  educationStatus: z.enum([
    "MBBS Completed",
    "PG In Progress (MD/MS/DNB)",
    "PG Completed (MD/MS/DNB)",
    "Super-Specialty (DM/MCh/Fellowship)",
    "Other",
  ]),
  country: z.string().min(2).max(3).regex(/^[a-z]+$/),
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
    // Content-type guard
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 415, headers: corsHeaders },
      );
    }

    // Size guard (reject bodies over 2 KB)
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 2048) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413, headers: corsHeaders },
      );
    }

    // Parse and validate
    const raw = await request.json();

    // Honeypot: silently discard bot submissions
    if (raw.website) {
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    const result = leadSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed" },
        { status: 400, headers: corsHeaders },
      );
    }

    const body = result.data;

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      // Not configured — log without PII
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead not saved.");
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    // Forward validated fields only (no spread to prevent extra field injection)
    const webhookRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        educationStatus: body.educationStatus,
        country: body.country,
        source: "gcworld-salary-tool",
      }),
    });

    if (!webhookRes.ok) {
      console.warn(`Webhook returned status ${webhookRes.status}`);
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch {
    // Silently succeed — the user should see results even if lead capture fails
    console.error("Lead capture: unexpected error");
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  }
}
