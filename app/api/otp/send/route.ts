import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCorsHeaders, optionsHandler } from "@/lib/api/cors";
import { checkRateLimit, getClientIp } from "@/lib/api/rate-limit";

// ─── Validation ───────────────────────────────────────────────
const sendSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit Indian mobile number"),
  email: z.string().email().max(254),
});

// ─── Preflight ────────────────────────────────────────────────
export async function OPTIONS(request: NextRequest) {
  return optionsHandler(request);
}

// ─── Email validation (Abstract API) ─────────────────────────
async function validateEmail(email: string): Promise<{ valid: boolean; reason?: string }> {
  const apiKey = process.env.ABSTRACT_EMAIL_API_KEY;
  if (!apiKey) return { valid: true }; // Skip if not configured

  try {
    const res = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
      { signal: AbortSignal.timeout(5000) },
    );

    if (!res.ok) return { valid: true }; // Graceful fallback

    const data = await res.json();

    if (data.is_valid_format?.value === false) {
      return { valid: false, reason: "Please enter a valid email address" };
    }
    if (data.deliverability === "UNDELIVERABLE") {
      return { valid: false, reason: "This email address appears to be invalid" };
    }
    if (data.is_disposable_email?.value === true) {
      return { valid: false, reason: "Please use a non-disposable email address" };
    }

    return { valid: true };
  } catch {
    // API down or timeout — don't block the user
    return { valid: true };
  }
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

    // Rate limit by IP: 3 sends per 5 minutes
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit("otp-send", ip, 3, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes." },
        { status: 429, headers: corsHeaders },
      );
    }

    const raw = await request.json();

    // Honeypot check — silently fake success for bots
    if (raw.website) {
      return NextResponse.json({ success: true }, { headers: corsHeaders });
    }

    const result = sendSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400, headers: corsHeaders },
      );
    }

    const { phone, email } = result.data;

    // Validate email before sending OTP
    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { error: emailCheck.reason },
        { status: 400, headers: corsHeaders },
      );
    }

    // Send OTP via MSG91
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    if (!authKey || !templateId) {
      console.warn("MSG91 credentials not configured. OTP not sent.");
      return NextResponse.json(
        { error: "OTP service is temporarily unavailable" },
        { status: 503, headers: corsHeaders },
      );
    }

    const msg91Res = await fetch("https://control.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        "authkey": authKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: `91${phone}`,
        template_id: templateId,
        otp_length: 6,
      }),
    });

    const msg91Data = await msg91Res.json();

    if (msg91Data.type === "error") {
      console.error("MSG91 send error:", msg91Data.message);
      return NextResponse.json(
        { error: "Failed to send OTP. Please try again." },
        { status: 500, headers: corsHeaders },
      );
    }

    // Always return success — don't reveal if number is valid/invalid
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error("OTP send: unexpected error", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders },
    );
  }
}
