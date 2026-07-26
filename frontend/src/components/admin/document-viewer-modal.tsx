"use client";

import React, { useEffect } from "react";
import { StoredEmbedFile, getFileIcon } from "./types";

interface DocumentViewerModalProps {
  viewingFile: StoredEmbedFile | null;
  onClose: () => void;
}

export function DocumentViewerModal({
  viewingFile,
  onClose,
}: DocumentViewerModalProps) {
  // Close viewer modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && viewingFile) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingFile, onClose]);

  if (!viewingFile) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-6 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden text-foreground cursor-default"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-accent text-accent-foreground shrink-0">
              {getFileIcon(viewingFile.content_type || "", viewingFile.filename)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{viewingFile.filename}</h3>
              {viewingFile.description ? (
                <p className="text-xs text-muted-foreground truncate">{viewingFile.description}</p>
              ) : (
                <p className="text-[11px] text-muted-foreground font-mono">ID: {viewingFile.file_id}</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body: Streams document via GET /api/documents/[fileId] -> /documents/{file_id} */}
        <div className="flex-1 w-full bg-white dark:bg-zinc-950 overflow-hidden relative flex items-center justify-center">
          {viewingFile.content_type?.startsWith("image/") ||
          viewingFile.filename.endsWith(".jpg") ||
          viewingFile.filename.endsWith(".jpeg") ||
          viewingFile.filename.endsWith(".png") ? (
            <div className="p-4 flex items-center justify-center w-full h-full overflow-auto">
              <img
                src={`/api/documents/${viewingFile.file_id}`}
                alt={viewingFile.filename}
                className="max-h-full object-contain rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-md bg-white dark:bg-zinc-900"
              />
            </div>
          ) : (
            <iframe
              src={`/api/documents/${viewingFile.file_id}`}
              title={viewingFile.filename}
              className="w-full h-full border-0 bg-white dark:bg-zinc-950"
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
            <span>Document Viewer</span>
            <span>•</span>
            <span className="truncate max-w-[250px]">{viewingFile.filename}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors cursor-pointer text-xs"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
