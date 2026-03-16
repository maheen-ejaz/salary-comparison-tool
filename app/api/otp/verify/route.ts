import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCorsHeaders, optionsHandler } from "@/lib/api/cors";
import { checkRateLimit, getClientIp } from "@/lib/api/rate-limit";

// ─── Validation ───────────────────────────────────────────────
const verifySchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit Indian mobile number"),
  otp: z.string().regex(/^\d{6}$/, "Must be a 6-digit OTP"),
});

// ─── Preflight ────────────────────────────────────────────────
export async function OPTIONS(request: NextRequest) {
  return optionsHandler(request);
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

    // Rate limit: 5 verify attempts per IP per 5 minutes
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit("otp-verify", ip, 5, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { verified: false, error: "Too many attempts. Please wait a few minutes." },
        { status: 429, headers: corsHeaders },
      );
    }

    const raw = await request.json();
    const result = verifySchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { verified: false, error: "Invalid OTP format" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { phone, otp } = result.data;

    const authKey = process.env.MSG91_AUTH_KEY;
    if (!authKey) {
      console.warn("MSG91 credentials not configured.");
      return NextResponse.json(
        { verified: false, error: "OTP service is temporarily unavailable" },
        { status: 503, headers: corsHeaders },
      );
    }

    // Verify OTP via MSG91
    const msg91Res = await fetch(
      `https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`,
      {
        method: "GET",
        headers: { "authkey": authKey },
      },
    );

    const msg91Data = await msg91Res.json();

    if (msg91Data.type === "success") {
      return NextResponse.json({ verified: true }, { headers: corsHeaders });
    }

    // Don't reveal whether OTP was wrong vs expired
    return NextResponse.json(
      { verified: false, error: "Invalid or expired OTP. Please try again." },
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error("OTP verify: unexpected error", err);
    return NextResponse.json(
      { verified: false, error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders },
    );
  }
}
