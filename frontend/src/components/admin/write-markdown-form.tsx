"use client";

import React, { useState } from "react";
import { FileCode, Tag, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

interface WriteMarkdownFormProps {
  isRagConnected: boolean | null;
  onRefresh: () => Promise<void>;
}

export function WriteMarkdownForm({
  isRagConnected,
  onRefresh,
}: WriteMarkdownFormProps) {
  const [markdownTitle, setMarkdownTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateMarkdown = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markdownContent.trim() || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let rawTitle = markdownTitle.trim() || "untitled_note.md";
      if (!rawTitle.endsWith(".md")) {
        rawTitle += ".md";
      }

      const fileBlob = new File([markdownContent.trim()], rawTitle, {
        type: "text/markdown",
      });

      const formData = new FormData();
      formData.append("file", fileBlob);
      formData.append("description", description.trim());

      const tagsList = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      tagsList.forEach((tag) => formData.append("tags", tag));

      const res = await fetch("/api/documents/create-embed", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.detail || "Failed to create markdown document");
      }

      setMarkdownTitle("");
      setMarkdownContent("");
      setDescription("");
      setTagsInput("");
      setSuccessMessage(`Successfully created and embedded '${rawTitle}' into RAG knowledge base!`);
      await onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create markdown document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleCreateMarkdown} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Filename */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Document Filename <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-blue-500">
            <FileCode className="size-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={markdownTitle}
              onChange={(e) => setMarkdownTitle(e.target.value)}
              disabled={!isRagConnected || isUploading}
              placeholder={!isRagConnected ? "RAG API Offline" : "e.g. system_instructions.md"}
              className="w-full bg-transparent focus:outline-none text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        {/* Tags Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Tags (Comma separated)
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-blue-500">
            <Tag className="size-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={!isRagConnected || isUploading}
              placeholder={!isRagConnected ? "RAG API Offline" : "e.g. guide, internal, faq"}
              className="w-full bg-transparent focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Markdown Content Editor */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Markdown Content <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          disabled={!isRagConnected || isUploading}
          placeholder={!isRagConnected ? "RAG API Offline" : "# Document Title\n\nWrite your markdown knowledge article here..."}
          rows={6}
          className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs font-mono focus:outline-none focus:border-blue-500 resize-y leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          required
        />
      </div>

      {/* Description Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-foreground">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isRagConnected || isUploading}
          placeholder={!isRagConnected ? "RAG API Offline" : "Brief summary of markdown document..."}
          rows={2}
          className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Status Banners */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isRagConnected || !markdownTitle.trim() || !markdownContent.trim() || isUploading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          {isUploading ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              <span>Creating & Embedding...</span>
            </>
          ) : (
            <>
              <FileCode className="size-3.5" />
              <span>Save & Embed Markdown</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
