"use client";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { Sparkles } from "lucide-react";

export function ChatHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-background px-4">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500 animate-pulse" />
          <span className="font-semibold text-sm text-foreground">RAG AI Assistant</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
          Connected
        </span>
      </div>
    </header>
  );
}
