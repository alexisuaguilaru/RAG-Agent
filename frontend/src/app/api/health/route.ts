import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";

  try {
    // Fast HTTP ping with 1.5s abort timeout for instant health check
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(aegraUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok || res.status < 500) {
      return NextResponse.json({ connected: true, url: aegraUrl });
    }
  } catch {
    // Return disconnected status fast without delay
  }

  return NextResponse.json({
    connected: false,
    url: aegraUrl,
    error: "Unable to connect to Aegra / LangGraph server",
  });
}
