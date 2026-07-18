import { NextRequest } from "next/server";
import { Client } from "@langchain/langgraph-sdk";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages, id: threadId, userId = "generic_user" } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestMessage = messages[messages.length - 1].content;

    const aegraUrl = process.env.AEGRA_API_URL || "http://localhost:2026";
    const assistantId = process.env.AEGRA_ASSISTANT_ID || "rag_agent";

    const client = new Client({ apiUrl: aegraUrl });

    // Derive or fetch thread_id securely
    const activeThreadId = threadId || `${userId}_default_thread`;
    
    // Ensure thread exists or retrieve it
    try {
      await client.threads.get(activeThreadId);
    } catch {
      await client.threads.create({ threadId: activeThreadId });
    }

    // Start streaming run using message mode
    const runStream = client.runs.stream(
      activeThreadId,
      assistantId,
      {
        input: {
          messages: [
            {
              role: "user",
              content: latestMessage,
            },
          ],
        },
        streamMode: "messages",
      }
    );

    // Transform stream to filter and yield only AI message contents (text chunks)
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          let lastSeenText = "";

          for await (const chunk of runStream) {
            if (req.signal.aborted) {
              break;
            }
            // Only handle partial message streaming events
            if (chunk.event === "messages/partial" || (chunk as any).event === "messages") {
              const data = chunk.data as any;
              
              const extractText = (msgContent: any): string => {
                if (typeof msgContent === "string") return msgContent;
                if (Array.isArray(msgContent)) {
                  return msgContent
                    .map((c) => (c && typeof c === "object" && "text" in c ? String(c.text) : ""))
                    .join("");
                }
                return "";
              };

              const processMessage = (msg: any) => {
                if (msg && msg.type === "ai" && msg.content) {
                  const fullText = extractText(msg.content);
                  if (!fullText) return;

                  let delta = "";
                  if (fullText.startsWith(lastSeenText)) {
                    // Backend sent an accumulated snapshot. Extract only the new suffix.
                    delta = fullText.slice(lastSeenText.length);
                    lastSeenText = fullText;
                  } else {
                    // Backend sent a delta chunk.
                    delta = fullText;
                    lastSeenText += fullText;
                  }

                  if (delta) {
                    controller.enqueue(encoder.encode(delta));
                  }
                }
              };

              if (Array.isArray(data)) {
                // In LangGraph streamMode="messages", chunk.data is [AIMessageChunk, metadata]
                if (data.length > 0) {
                  processMessage(data[0]);
                }
              } else if (data) {
                processMessage(data);
              }
            }
          }
        } catch (streamError) {
          console.error("Stream reading error:", streamError);
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat BFF Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
