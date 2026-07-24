import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const ragApiUrl = process.env.RAG_API_URL || "http://localhost:6060";

  try {
    const backendRes = await fetch(`${ragApiUrl}/documents/${fileId}`, {
      method: "GET",
    });

    if (!backendRes.ok) {
      return NextResponse.json({ error: "File not found" }, { status: backendRes.status });
    }

    const contentType = backendRes.headers.get("Content-Type") || "application/octet-stream";
    const body = await backendRes.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch file stream" }, { status: 503 });
  }
}
