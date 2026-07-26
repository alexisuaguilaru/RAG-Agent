"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FolderKanban, RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminHeaderProps {
  isRagConnected: boolean | null;
  isLoadingDocs: boolean;
  onRefresh: () => void;
}

export function AdminHeader({
  isRagConnected,
  isLoadingDocs,
  onRefresh,
}: AdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-6 bg-background">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border border-sidebar-border rounded-lg px-2.5 py-1.5 bg-muted/40"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Chat</span>
        </Link>
        <div className="h-4 w-px bg-sidebar-border" />
        <div className="flex items-center gap-2">
          <FolderKanban className="size-5 text-primary" />
          <h1 className="font-semibold text-base tracking-tight">RAG Document Management</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* RAG API Connection Status Badge */}
        {isRagConnected ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Disconnected</span>
          </span>
        )}

        <button
          type="button"
          onClick={onRefresh}
          title="Refresh documents list"
          className="p-2 rounded-lg border border-sidebar-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <RefreshCw className={`size-4 ${isLoadingDocs ? "animate-spin" : ""}`} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
