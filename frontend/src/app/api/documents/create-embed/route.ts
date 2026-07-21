import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ragApiUrl = process.env.RAG_API_URL || "http://localhost:8000";

  try {
    const formData = await req.formData();

    const backendRes = await fetch(`${ragApiUrl}/documents/create-embed`, {
      method: "POST",
      body: formData,
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { error: errorText || "Failed to embed document in RAG service" },
        { status: backendRes.status }
      );
    }

    const embeddingIds: string[] = await backendRes.json();
    return NextResponse.json({ embeddingIds });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unable to connect to RAG embedding API" },
      { status: 503 }
    );
  }
}
