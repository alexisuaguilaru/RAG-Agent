import { NextRequest, NextResponse } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export const runtime = "nodejs";

const extractText = (msgContent: any): string => {
  if (typeof msgContent === "string") return msgContent;
  if (Array.isArray(msgContent)) {
    return msgContent
      .map((c) => (c && typeof c === "object" && "text" in c ? String(c.text) : ""))
      .join("");
  }
  return "";
};

const deriveTitle = (thread: any): string => {
  const metadataTitle = thread.metadata?.title;
  if (metadataTitle && metadataTitle !== "New Conversation" && metadataTitle !== "New Chat") {
    return metadataTitle.length > 40 ? metadataTitle.slice(0, 40) + "..." : metadataTitle;
  }
  const messages = thread.values?.messages || [];
  const firstUserMsg = messages.find(
    (m: any) => m.type === "human" || m.type === "user" || m.role === "user"
  );
  if (firstUserMsg) {
    const text = extractText(firstUserMsg.content || firstUserMsg.text || "");
    if (text.trim()) {
      return text.length > 40 ? text.slice(0, 40) + "..." : text.trim();
    }
  }
  return `Chat ${thread.thread_id.slice(0, 8)}`;
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "generic_user";

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const client = new Client({ apiUrl: aegraUrl });

    // Search threads associated with user_id metadata (or all open threads fallback)
    let threads: any[] = [];
    try {
      threads = await client.threads.search({
        metadata: { user_id: userId },
        limit: 50,
      });
    } catch {
      // Fallback: fetch general threads list
      threads = await client.threads.search({ limit: 50 });
    }

    const formattedThreads = threads.map((thread: any) => ({
      id: thread.thread_id,
      title: deriveTitle(thread),
      createdAt: thread.created_at,
      updatedAt: thread.updated_at,
    }));

    return NextResponse.json({ threads: formattedThreads });
  } catch {
    // Return empty threads list silently when Aegra is offline/unreachable
    return NextResponse.json({ threads: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId = "generic_user", title } = await req.json();

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const client = new Client({ apiUrl: aegraUrl });

    const userPrompt = title && title.trim() ? title.trim() : "";
    const formattedTitle = userPrompt ? (userPrompt.length > 40 ? userPrompt.slice(0, 40) + "..." : userPrompt) : "Untitled Chat";

    const newThread = await client.threads.create({
      metadata: {
        user_id: userId,
        title: formattedTitle,
      },
    });

    return NextResponse.json({
      id: newThread.thread_id,
      title: newThread.metadata?.title || formattedTitle,
      createdAt: newThread.created_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create thread" }, { status: 503 });
  }
}
