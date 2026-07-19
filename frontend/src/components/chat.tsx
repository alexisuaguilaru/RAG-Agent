"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatHeader } from "@/components/chat-header";
import { Overview } from "@/components/overview";
import { Messages } from "@/components/messages";
import { TextInput } from "@/components/text-input";
import { MessageProps } from "@/components/message";

interface ChatProps {
  threadId?: string;
}

export function Chat({ threadId: initialThreadId }: ChatProps) {
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);
  const [messages, setMessages] = useState<Array<MessageProps>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrating, setIsHydrating] = useState(Boolean(initialThreadId));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Health Probe: instant initial check on mount + 30s spanned background polling
  const checkConnection = useCallback(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setIsConnected(Boolean(data.connected));
      })
      .catch(() => {
        setIsConnected(false);
      });
  }, []);

  useEffect(() => {
    // Instant initial check on mount
    checkConnection();

    // Spanned background check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [checkConnection]);

  // Load message history if initialThreadId is provided, or reset for new chat
  useEffect(() => {
    setThreadId(initialThreadId);
    setEditingIndex(null);
    setInput("");
    if (initialThreadId) {
      setIsHydrating(true);
      fetch(`/api/threads/${initialThreadId}`)
        .then((res) => {
          if (!res.ok) return { messages: [] };
          return res.json();
        })
        .then((data) => {
          if (data && data.messages) {
            setMessages(data.messages);
          }
        })
        .catch(() => {
          setMessages([]);
        })
        .finally(() => setIsHydrating(false));
    } else {
      setMessages([]);
      setIsHydrating(false);
    }
  }, [initialThreadId]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const streamResponse = async (contextMessages: MessageProps[], targetThreadId: string) => {
    setIsLoading(true);

    const assistantMessageIndex = contextMessages.length;
    setMessages([...contextMessages, { role: "assistant", content: "" }]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: contextMessages,
          id: targetThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages((prev) => {
            const next = [...prev];
            next[assistantMessageIndex] = {
              role: "assistant",
              content: assistantContent,
            };
            return next;
          });
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error("Failed to fetch stream:", error);
        setMessages((prev) => {
          const next = [...prev];
          if (!next[assistantMessageIndex]?.content) {
            next[assistantMessageIndex] = {
              role: "assistant",
              content: "Sorry, I encountered an error while trying to process your request.",
            };
          }
          return next;
        });
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isConnected === false) return;

    let activeThreadId = threadId;
    const currentPrompt = input.trim();

    // Create a new Aegra thread if starting from empty home page
    if (!activeThreadId) {
      try {
        const createRes = await fetch("/api/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "generic_user",
            title: currentPrompt,
          }),
        });
        const threadData = await createRes.json();
        if (threadData.id) {
          activeThreadId = threadData.id;
          setThreadId(threadData.id);
          window.history.replaceState(null, "", `/chat/${threadData.id}`);
          window.dispatchEvent(new Event("threads-updated"));
        }
      } catch (err) {
        console.error("Failed to auto-create thread:", err);
      }
    }

    let baseMessages = messages;
    if (editingIndex !== null) {
      baseMessages = messages.slice(0, editingIndex);
      setEditingIndex(null);
    }

    const userMessage: MessageProps = { role: "user", content: currentPrompt };
    const updatedMessages = [...baseMessages, userMessage];

    setInput("");
    await streamResponse(updatedMessages, activeThreadId || "generic_user_default_thread");
  };

  const handleRegenerate = (assistantIndex: number) => {
    if (isLoading || isConnected === false) return;
    const contextMessages = messages.slice(0, assistantIndex);
    if (contextMessages.length === 0) return;
    streamResponse(contextMessages, threadId || "generic_user_default_thread");
  };

  const handleStartEdit = (userIndex: number, currentContent: string) => {
    if (isLoading || isConnected === false) return;
    setEditingIndex(userIndex);
    setInput(currentContent);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader isConnected={isConnected} />
      {isHydrating ? (
        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
          Loading conversation history...
        </div>
      ) : messages.length === 0 ? (
        <Overview />
      ) : (
        <Messages
          messages={messages}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          onEditMessage={handleStartEdit}
        />
      )}
      <TextInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={handleStop}
        isEditing={editingIndex !== null}
        onCancelEdit={handleCancelEdit}
        isDisabled={!isConnected}
      />
    </div>
  );
}
