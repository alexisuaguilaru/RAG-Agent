"use client";

import { Sparkles } from "lucide-react";

export function Overview() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
      <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground border border-accent-foreground/20 mb-4">
        <Sparkles className="size-6 animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-foreground">RAG Agent</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        This is a template client conforming to the Aegra Agent Protocol. Start a conversation below to ask questions about your documents.
      </p>
    </div>
  );
}
