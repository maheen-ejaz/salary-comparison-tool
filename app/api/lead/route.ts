import { NextRequest, NextResponse } from "next/server";

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  educationStatus: string;
  country: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadPayload = await request.json();

    if (!body.email || !body.name) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 });
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      // Not configured — log server-side but don't block the user
      console.warn("GOOGLE_SHEETS_WEBHOOK_URL is not set. Lead not saved:", body.email);
      return NextResponse.json({ success: true });
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, source: "gcworld-salary-tool" }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently succeed — the user should see results even if lead capture fails
    console.error("Lead capture error:", error);
    return NextResponse.json({ success: true });
  }
}
