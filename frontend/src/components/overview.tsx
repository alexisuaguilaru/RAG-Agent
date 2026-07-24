"use client";

import { Sparkles } from "lucide-react";

export function Overview() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
      <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground mb-4">
        <Sparkles className="size-6 text-blue-500 animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-foreground">RAG Agent</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        This is a template client conforming to the Aegra Agent Protocol. Start a conversation below to ask questions about your documents.
      </p>
    </div>
  );
}
