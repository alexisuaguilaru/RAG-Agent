"use client";

import { SidebarToggle } from "@/components/sidebar-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, Settings } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  onOpenAdmin?: () => void;
  isConnected?: boolean | null;
}

export function ChatHeader({ onOpenAdmin, isConnected }: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-sidebar-border bg-background px-4">
      <div className="flex items-center gap-3">
        <SidebarToggle />
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500 animate-pulse" />
          <span className="font-semibold text-sm text-foreground">RAG AI Assistant</span>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        {!isConnected ? (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20 cursor-help"
            title="Unable to connect to Aegra / LangGraph backend server"
          >
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            Disconnected
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 cursor-help"
            title="Connected to Aegra Agent Protocol server"
          >
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        )}
        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenAdmin}
          title="Admin & Settings"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border bg-background text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none cursor-pointer"
          aria-label="Admin settings"
        >
          <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      </div>
    </header>
  );
}
