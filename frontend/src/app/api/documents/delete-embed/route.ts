import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function DELETE(req: NextRequest) {
  const ragApiUrl = process.env.RAG_API_URL || "http://localhost:8000";

  try {
    const body = await req.json();

    const backendRes = await fetch(`${ragApiUrl}/documents/delete-embed`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json(
        { error: errorText || "Failed to delete embeddings" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unable to connect to RAG embedding API" },
      { status: 503 }
    );
  }
}
