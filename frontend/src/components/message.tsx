"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import React from "react";

export interface MessageProps {
  role: "user" | "assistant";
  content: string;
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";

  // Simple formatter for paragraphs, lists, and inline code
  const formatContent = (text: string) => {
    if (!text) return null;
    
    // Split by block code fences first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        const codeContent = part.replace(/```[a-zA-Z]*\n?|```$/g, "");
        return (
          <pre key={index} className="my-3 overflow-x-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800 text-xs font-mono text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700">
            <code>{codeContent}</code>
          </pre>
        );
      }

      // Handle normal paragraphs and basic styling (bold, inline code)
      return part.split("\n").map((line, lineIndex) => {
        if (!line.trim()) return <div key={`empty-${lineIndex}`} className="h-2" />;

        // Parse inline code `code`
        let contentElement: React.ReactNode = line;
        const inlineCodeRegex = /`([^`]+)`/g;
        if (line.match(inlineCodeRegex)) {
          const splitLine = line.split(inlineCodeRegex);
          contentElement = splitLine.map((subPart, subIdx) => {
            if (subIdx % 2 === 1) {
              return (
                <code key={subIdx} className="rounded bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 font-mono text-xs text-red-600 dark:text-red-400">
                  {subPart}
                </code>
              );
            }
            return subPart;
          });
        }

        // Render bullet lists
        if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
          return (
            <li key={lineIndex} className="ml-4 list-disc text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
              {contentElement.toString().replace(/^[*-\s]+/, "")}
            </li>
          );
        }

        return (
          <p key={lineIndex} className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {contentElement}
          </p>
        );
      });
    });
  };

  return (
    <div
      className={cn(
        "flex w-full items-start gap-4 p-4 md:px-6 transition-all duration-200",
        isUser ? "bg-background" : "bg-muted/30 border-y border-muted/20"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-lg border text-sm font-semibold shadow-sm",
          isUser
            ? "bg-foreground text-background border-zinc-800"
            : "bg-primary text-primary-foreground border-primary"
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>

      <div className="flex-1 space-y-2 overflow-hidden px-1">
        {formatContent(content)}
      </div>
    </div>
  );
}
