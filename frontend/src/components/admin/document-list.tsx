"use client";

import React, { useState } from "react";
import { Search, RefreshCw, AlertCircle, Eye, Trash2 } from "lucide-react";
import { StoredEmbedFile, getFileIcon, formatDate } from "./types";

interface DocumentListProps {
  documents: StoredEmbedFile[];
  isLoadingDocs: boolean;
  isRagConnected: boolean | null;
  onView: (doc: StoredEmbedFile) => void;
  onDelete: (fileId: string) => Promise<void>;
  deletingId: string | null;
}

export function DocumentList({
  documents,
  isLoadingDocs,
  isRagConnected,
  onView,
  onDelete,
  deletingId,
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter(
    (doc) =>
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="rounded-2xl border border-sidebar-border bg-card overflow-hidden shadow-xs flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-sidebar-border gap-3">
        <div>
          <h2 className="font-semibold text-sm">Knowledge Base Documents</h2>
          <p className="text-xs text-muted-foreground">
            Manage uploaded knowledge base files
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!isRagConnected}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sidebar-border bg-background focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="divide-y divide-sidebar-border">
        {isLoadingDocs ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="size-4 animate-spin text-primary" />
            <span>Loading documents...</span>
          </div>
        ) : !isRagConnected ? (
          <div className="p-8 text-center text-xs text-rose-500 dark:text-rose-400 flex items-center justify-center gap-2 font-medium">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>RAG API service is currently offline. Unable to retrieve documents.</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No documents uploaded yet.
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <div
              key={doc.file_id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors gap-4 text-xs"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-muted text-foreground shrink-0 mt-0.5">
                  {getFileIcon(doc.content_type || "", doc.filename)}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground truncate">{doc.filename}</span>
                    {doc.tags &&
                      doc.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center text-[10px] font-medium bg-accent text-accent-foreground px-2 py-0.5 rounded-full border border-accent-foreground/20"
                        >
                          #{tag}
                        </span>
                      ))}
                  </div>

                  {doc.description && (
                    <p className="text-muted-foreground text-xs line-clamp-1">{doc.description}</p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Uploaded: {formatDate(doc.last_modification)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => onView(doc)}
                  disabled={!isRagConnected}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sidebar-border bg-background text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="View document inline"
                >
                  <Eye className="size-3.5 text-secondary" />
                  <span>View</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(doc.file_id)}
                  disabled={!isRagConnected || deletingId === doc.file_id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Delete document"
                >
                  {deletingId === doc.file_id ? (
                    <RefreshCw className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
