"use client";

import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message, MessageProps } from "@/components/message";
import { Loader2 } from "lucide-react";

interface MessagesProps {
  messages: Array<MessageProps>;
  isLoading: boolean;
  onRegenerate?: (index: number) => void;
  onEditMessage?: (index: number, newContent: string) => void;
}

export function Messages({ messages, isLoading, onRegenerate, onEditMessage }: MessagesProps) {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();

  const lastAssistantIndex = messages.findLastIndex((m) => m.role === "assistant");
  const lastUserIndex = messages.findLastIndex((m) => m.role === "user");

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="flex flex-col">
        {messages.map((message, index) => (
          <Message
            key={`${message.role}-${index}`}
            role={message.role}
            content={message.content}
            index={index}
            isLast={index === messages.length - 1}
            isLoading={isLoading}
            onRegenerate={
              onRegenerate && index === lastAssistantIndex && !isLoading
                ? () => onRegenerate(index)
                : undefined
            }
            onEdit={
              onEditMessage && index === lastUserIndex && !isLoading
                ? (newContent) => onEditMessage(index, newContent)
                : undefined
            }
          />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground bg-muted/10">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>AI is responding...</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
