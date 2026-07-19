"use client";

import { cn } from "@/lib/utils";
import { Bot, User, Pencil, RefreshCw, Copy, Check } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export interface MessageProps {
  role: "user" | "assistant";
  content: string;
  index?: number;
  isLast?: boolean;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
  isLoading?: boolean;
}

const preprocessLaTeX = (text: string): string => {
  if (!text) return "";
  // Normalize escaped bracket block math delimiters \[ ... \] -> $$ ... $$
  let processed = text.replace(/\\\[([\s\S]*?)\\\]/g, (_, eq) => `$$${eq}$$`);
  // Normalize escaped paren inline math delimiters \( ... \) -> $ ... $
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, eq) => `$${eq}$`);
  return processed;
};

export function Message({
  role,
  content,
  onRegenerate,
  onEdit,
  isLoading,
}: MessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-3 px-4 py-3 md:px-6 transition-all duration-200",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-lg border text-sm font-semibold shadow-sm mt-0.5",
          isUser
            ? "bg-white text-zinc-900 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
            : "bg-muted text-foreground border-sidebar-border"
        )}
      >
        {isUser ? <User className="size-4 text-zinc-900 dark:text-zinc-100" /> : <Bot className="size-4" />}
      </div>

      {/* Bubble Container */}
      <div
        className={cn(
          "flex flex-col space-y-1.5 overflow-hidden text-sm leading-relaxed shadow-sm relative",
          isUser
            ? "ml-auto max-w-[82%] sm:max-w-[75%] rounded-2xl rounded-tr-xs bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 px-4 py-3"
            : "mr-auto max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-xs bg-muted/60 dark:bg-zinc-900 border border-sidebar-border text-foreground px-5 py-4"
        )}
      >
        <div className="prose max-w-none break-words text-sm leading-relaxed dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[[rehypeKatex, { strict: false }]]}
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              h1: ({ children }) => <h1 className={cn("text-lg font-bold my-2", isUser ? "text-zinc-900 dark:text-zinc-100" : "text-foreground")}>{children}</h1>,
              h2: ({ children }) => <h2 className={cn("text-base font-bold my-2", isUser ? "text-zinc-900 dark:text-zinc-100" : "text-foreground")}>{children}</h2>,
              h3: ({ children }) => <h3 className={cn("text-sm font-bold my-1.5", isUser ? "text-zinc-900 dark:text-zinc-100" : "text-foreground")}>{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="my-0.5">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-zinc-400 pl-3 my-2 italic opacity-90">
                  {children}
                </blockquote>
              ),
              pre: ({ children }) => (
                <pre className="my-3 overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs text-zinc-100 font-mono border border-zinc-800 shadow-md">
                  {children}
                </pre>
              ),
              code: ({ node, className, children, ...props }: any) => {
                const hasLang = Boolean(className && className.includes("language-"));
                const isMultiLine = typeof children === "string" && children.includes("\n");

                if (hasLang || isMultiLine) {
                  return (
                    <code className={cn("font-mono text-xs text-zinc-100", className)} {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <code
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-xs font-semibold inline",
                      isUser
                        ? "bg-zinc-200 text-zinc-900"
                        : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 font-medium",
                      className
                    )}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ children }) => (
                <div className="my-3 overflow-x-auto rounded-lg border border-sidebar-border">
                  <table className="w-full text-left text-xs border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-muted px-3 py-2 font-semibold border-b border-sidebar-border">{children}</th>
              ),
              td: ({ children }) => <td className="px-3 py-2 border-b border-sidebar-border/50">{children}</td>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 hover:text-blue-700 font-medium"
                >
                  {children}
                </a>
              ),
            }}
          >
            {preprocessLaTeX(content)}
          </ReactMarkdown>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-1.5 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            title="Copy as raw Markdown"
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="size-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          {isUser && onEdit && !isLoading && (
            <button
              type="button"
              onClick={() => onEdit(content)}
              title="Edit message"
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-zinc-500 hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Pencil className="size-3" />
              <span>Edit</span>
            </button>
          )}

          {!isUser && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              title="Regenerate response"
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
              <span>Regenerate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
