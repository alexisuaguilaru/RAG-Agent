"use client";

import React, { useState } from "react";
import { Upload, FileCode, AlertCircle } from "lucide-react";
import { UploadFileForm } from "./upload-file-form";
import { WriteMarkdownForm } from "./write-markdown-form";

interface DocumentUploadCardProps {
  isRagConnected: boolean | null;
  onRefresh: () => Promise<void>;
}

export function DocumentUploadCard({
  isRagConnected,
  onRefresh,
}: DocumentUploadCardProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "write">("upload");

  return (
    <div className="rounded-2xl border border-sidebar-border bg-card p-6 shadow-xs flex flex-col gap-4">
      {!isRagConnected && (
        <div className="flex items-center gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
          <AlertCircle className="size-4 shrink-0" />
          <span>
            RAG API service is currently offline (http://localhost:6060). Document upload, creation, and management are disabled.
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-sidebar-border pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "upload"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
            }`}
          >
            <Upload className="size-3.5" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "write"
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
            }`}
          >
            <FileCode className="size-3.5" />
            <span>Write Markdown</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
            {activeTab === "upload"
              ? "Supported Formats: PDF (.pdf), Markdown (.md), Text (.txt), JPEG (.jpeg), PNG (.png)"
              : "Markdown Document (.md)"}
          </span>
        </div>
      </div>

      {activeTab === "upload" ? (
        <UploadFileForm isRagConnected={isRagConnected} onRefresh={onRefresh} />
      ) : (
        <WriteMarkdownForm isRagConnected={isRagConnected} onRefresh={onRefresh} />
      )}
    </div>
  );
}
