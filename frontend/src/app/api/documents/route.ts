import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const ragApiUrl = process.env.RAG_API_URL || "http://localhost:6060";

  try {
    const res = await fetch(`${ragApiUrl}/documents/`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
