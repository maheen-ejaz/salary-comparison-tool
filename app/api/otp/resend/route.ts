import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCorsHeaders, optionsHandler } from "@/lib/api/cors";
import { checkRateLimit, getClientIp } from "@/lib/api/rate-limit";

// ─── Validation ───────────────────────────────────────────────
const resendSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit Indian mobile number"),
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

    // Rate limit: 2 resends per IP per 10 minutes
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit("otp-resend", ip, 2, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many resend attempts. Please wait before trying again." },
        { status: 429, headers: corsHeaders },
      );
    }

    const raw = await request.json();
    const result = resendSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { phone } = result.data;

    const authKey = process.env.MSG91_AUTH_KEY;
    if (!authKey) {
      console.warn("MSG91 credentials not configured.");
      return NextResponse.json(
        { error: "OTP service is temporarily unavailable" },
        { status: 503, headers: corsHeaders },
      );
    }

    // Resend OTP via MSG91
    const msg91Res = await fetch("https://control.msg91.com/api/v5/otp/retry", {
      method: "POST",
      headers: {
        "authkey": authKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: `91${phone}`,
        retrytype: "text",
      }),
    });

    const msg91Data = await msg91Res.json();

    if (msg91Data.type === "error") {
      console.error("MSG91 resend error:", msg91Data.message);
      return NextResponse.json(
        { error: "Failed to resend OTP. Please try again later." },
        { status: 500, headers: corsHeaders },
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error("OTP resend: unexpected error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders },
    );
  }
}
