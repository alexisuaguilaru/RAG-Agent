import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const ragApiUrl = process.env.RAG_API_URL || "http://localhost:6060";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${ragApiUrl}/documents/`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }
    return NextResponse.json({ status: "error" }, { status: 503 });
  } catch {
    return NextResponse.json({ status: "down" }, { status: 503 });
  }
}
