"use client";

import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Message, MessageProps } from "@/components/message";
import { Loader2 } from "lucide-react";

interface MessagesProps {
  messages: Array<MessageProps>;
  isLoading: boolean;
}

export function Messages({ messages, isLoading }: MessagesProps) {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>();

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
