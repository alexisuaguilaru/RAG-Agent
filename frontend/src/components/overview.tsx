"use client";

import { Sparkles, MessageSquare, ShieldAlert } from "lucide-react";

export function Overview() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
      <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-foreground mb-4">
        <Sparkles className="size-6 text-amber-500 animate-pulse" />
      </div>
      <h2 className="text-xl font-bold text-foreground">Decoupled RAG Agent</h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        This is a template client conforming to the Aegra Agent Protocol. Start a conversation below to ask questions about your documents.
      </p>

      <div className="mt-8 grid gap-4 w-full text-left">
        <div className="flex gap-4 rounded-xl border border-sidebar-border bg-sidebar p-4">
          <MessageSquare className="size-5 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">BFF Decoupled Stream</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Internal thoughts, tool configurations, and system logs are securely filtered on the server side (BFF) and not exposed to the client.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-sidebar-border bg-sidebar p-4">
          <ShieldAlert className="size-5 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Constraints Active</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct agent/provider swaps and external file uploads are disabled in this build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
