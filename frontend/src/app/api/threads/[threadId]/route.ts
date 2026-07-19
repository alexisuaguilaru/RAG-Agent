import { NextRequest, NextResponse } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    if (!threadId) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
    }

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const client = new Client({ apiUrl: aegraUrl });

    const state = await client.threads.getState(threadId);
    
    // Extract stored messages from state values
    const rawMessages = (state?.values as any)?.messages || [];

    const extractText = (msgContent: any): string => {
      if (typeof msgContent === "string") return msgContent;
      if (Array.isArray(msgContent)) {
        return msgContent
          .map((c) => (c && typeof c === "object" && "text" in c ? String(c.text) : ""))
          .join("");
      }
      return "";
    };

    const messages = rawMessages
      .map((msg: any) => {
        const role =
          msg.type === "human" || msg.type === "user" || msg.role === "user"
            ? "user"
            : "assistant";
        const content = extractText(msg.content || msg.text || "");
        return { role, content };
      })
      .filter((msg: any) => msg.content.trim().length > 0);

    return NextResponse.json({
      threadId,
      messages,
    });
  } catch (error: any) {
    console.error("Get thread state error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get thread history" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const { title } = await req.json();

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
    }
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const client = new Client({ apiUrl: aegraUrl });

    const threadsClient = client.threads as any;
    const updatedThread = typeof threadsClient.update === "function"
      ? await threadsClient.update(threadId, { metadata: { title: title.trim() } })
      : await threadsClient.patch(threadId, { metadata: { title: title.trim() } });

    return NextResponse.json({
      success: true,
      threadId,
      title: updatedThread.metadata?.title || title.trim(),
    });
  } catch (error: any) {
    console.error("Patch thread error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to rename thread" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    if (!threadId) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 });
    }

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const client = new Client({ apiUrl: aegraUrl });

    await client.threads.delete(threadId);

    return NextResponse.json({ success: true, threadId });
  } catch (error: any) {
    console.error("Delete thread error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete thread" },
      { status: 500 }
    );
  }
}
