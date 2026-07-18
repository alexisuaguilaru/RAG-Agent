"use client";

import React, { useState } from "react";
import { ChatHeader } from "@/components/chat-header";
import { Overview } from "@/components/overview";
import { Messages } from "@/components/messages";
import { TextInput } from "@/components/text-input";
import { MessageProps } from "@/components/message";

export function Chat() {
  const [messages, setMessages] = useState<Array<MessageProps>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: MessageProps = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Add placeholder assistant message that will be populated by the stream
    const assistantMessageIndex = updatedMessages.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          id: "default_session", // Using default thread ID secure mapping
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
    } catch (error) {
      console.error("Failed to fetch stream:", error);
      setMessages((prev) => {
        const next = [...prev];
        next[assistantMessageIndex] = {
          role: "assistant",
          content: "Sorry, I encountered an error while trying to process your request.",
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader />
      {messages.length === 0 ? (
        <Overview />
      ) : (
        <Messages messages={messages} isLoading={isLoading} />
      )}
      <TextInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
