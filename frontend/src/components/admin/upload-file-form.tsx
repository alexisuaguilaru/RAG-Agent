"use client";

import React, { useState } from "react";
import { Upload, Tag, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { SUPPORTED_MIME_TYPES, ACCEPTED_EXTENSIONS } from "./types";

interface UploadFileFormProps {
  isRagConnected: boolean | null;
  onRefresh: () => Promise<void>;
}

export function UploadFileForm({
  isRagConnected,
  onRefresh,
}: UploadFileFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        !SUPPORTED_MIME_TYPES.includes(file.type) &&
        !file.name.endsWith(".md") &&
        !file.name.endsWith(".txt")
      ) {
        setErrorMessage(
          `Unsupported format '${file.name}'. Supported formats: PDF (.pdf), Markdown (.md), Text (.txt), JPEG (.jpeg), PNG (.png).`
        );
        setSelectedFile(null);
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
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
        throw new Error(errData.error || errData.detail || "Failed to upload document");
      }

      setSelectedFile(null);
      setDescription("");
      setTagsInput("");
      setSuccessMessage(`Successfully uploaded '${selectedFile.name}' to RAG knowledge base!`);
      await onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleUploadDocument} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Select File <span className="text-muted-foreground font-normal">(.pdf, .md, .txt, .jpeg, .png)</span> <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-accent-foreground/50">
            <input
              type="file"
              onChange={handleFileChange}
              accept={ACCEPTED_EXTENSIONS}
              disabled={!isRagConnected || isUploading}
              className="w-full text-xs cursor-pointer file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-accent-foreground hover:file:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              required
            />
          </div>
        </div>

        {/* Tags Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Tags (Comma separated)
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-accent-foreground/50">
            <Tag className="size-3.5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              disabled={!isRagConnected || isUploading}
              placeholder={!isRagConnected ? "RAG API Offline" : "e.g. support, manual, policy"}
              className="w-full bg-transparent focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
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
          placeholder={!isRagConnected ? "RAG API Offline" : "Brief summary of document content..."}
          rows={2}
          className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs focus:outline-none focus:border-accent-foreground/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={!isRagConnected || !selectedFile || isUploading}
          className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-foreground border border-accent-foreground/30 px-4 py-2 text-xs font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          {isUploading ? (
            <>
              <RefreshCw className="size-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="size-3.5" />
              <span>Upload Document</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
