"use client";

import React, { useRef, useEffect } from "react";
import { ArrowUp, Square, X, Pencil } from "lucide-react";

interface TextInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onStop?: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export function TextInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  onStop,
  isEditing,
  onCancelEdit,
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
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e);
      }
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl px-4 pb-6 w-full"
    >
      <div className="relative flex flex-col w-full rounded-2xl border border-sidebar-border bg-background shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors focus-within:border-primary overflow-hidden">
        {isEditing && (
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
              isLoading
                ? "Generating response..."
                : isEditing
                ? "Edit your prompt..."
                : "Ask AI Assistant..."
            }
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent py-3 pl-4 pr-12 text-sm text-foreground focus:outline-none max-h-[200px]"
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
              disabled={!input.trim()}
              className="absolute right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Fixed AI agent & provider. File attachments are not supported.
      </p>
    </form>
  );
}
