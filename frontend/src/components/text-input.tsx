"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Square, X, Pencil, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop?: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  isDisabled?: boolean;
}

export function TextInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  isEditing,
  onCancelEdit,
  isDisabled,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current && !isDisabled) {
      textareaRef.current.focus();
    }
  }, [isEditing, isDisabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !isDisabled) {
        onSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={(e) => {
        if (isDisabled) {
          e.preventDefault();
          return;
        }
        onSubmit(e);
      }}
      className="mx-auto max-w-3xl px-4 pb-6 w-full"
    >
      <div
        className={cn(
          "relative flex flex-col w-full rounded-2xl border bg-background shadow-sm transition-colors overflow-hidden",
          isDisabled
            ? "border-rose-300 dark:border-rose-950 bg-rose-500/5 cursor-not-allowed"
            : "border-sidebar-border hover:border-zinc-300 dark:hover:border-zinc-700 focus-within:border-primary"
        )}
      >
        {isDisabled && (
          <div className="flex items-center gap-2 bg-rose-500/10 px-4 py-1.5 text-xs text-rose-600 dark:text-rose-400 border-b border-rose-500/20 font-medium">
            <WifiOff className="size-3.5 shrink-0" />
            <span>Aegra backend service is offline. Chat input disabled.</span>
          </div>
        )}

        {isEditing && !isDisabled && (
          <div className="flex items-center justify-between bg-muted/80 px-4 py-1.5 text-xs text-muted-foreground border-b border-sidebar-border">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Pencil className="size-3 text-primary" />
              <span>Editing message</span>
            </div>
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer text-xs font-medium"
            >
              <X className="size-3.5 text-muted-foreground hover:text-foreground" />
              <span>Cancel</span>
            </button>
          </div>
        )}

        <div className="relative flex items-center min-h-[48px] w-full">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisabled
                ? "Unable to connect to Aegra backend service..."
                : isLoading
                ? "Generating response..."
                : isEditing
                ? "Edit your prompt..."
                : "Ask AI Assistant..."
            }
            rows={1}
            disabled={isLoading || isDisabled}
            className="flex-1 resize-none bg-transparent py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none max-h-[200px] disabled:cursor-not-allowed disabled:opacity-60"
          />
          
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              title="Stop generation"
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 transition-all cursor-pointer shadow-sm animate-pulse"
            >
              <Square className="size-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || isDisabled}
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        RAG Agent is an AI tool and can make mistakes. Verify important information.
      </p>
    </form>
  );
}
