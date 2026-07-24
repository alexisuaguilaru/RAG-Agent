"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Upload,
  FileText,
  Trash2,
  ArrowLeft,
  Search,
  CheckCircle2,
  RefreshCw,
  Tag,
  AlertCircle,
  FileImage,
  FileCode,
  Eye,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface StoredEmbedFile {
  file_id: string;
  filename: string;
  last_modification: string;
  content_type: string;
  description?: string;
  tags?: string[];
}

const SUPPORTED_MIME_TYPES = [
  "text/markdown",
  "text/plain",
  "image/jpeg",
  "image/png",
  "application/pdf",
];

const ACCEPTED_EXTENSIONS = ".md,.txt,.jpeg,.jpg,.png,.pdf";

export default function AdminPage() {
  const [documents, setDocuments] = useState<StoredEmbedFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<StoredEmbedFile | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "write">("upload");
  const [markdownTitle, setMarkdownTitle] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");

  // Fetch real stored files from GET /api/documents (FastAPI http://localhost:6060/documents/)
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const res = await fetch("/api/documents");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDocuments(data);
        }
      }
    } catch {
      // Ignore network errors
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Close viewer modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && viewingFile) {
        setViewingFile(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewingFile]);

  const filteredDocs = documents.filter(
    (doc) =>
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

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
      await fetchDocuments();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
    }
  };

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
      await fetchDocuments();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create markdown document.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (fileId: string) => {
    if (deletingId === fileId) return;
    setDeletingId(fileId);

    try {
      const res = await fetch("/api/documents/delete-embed", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_id: fileId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.detail || "Failed to delete file");
      }

      setDocuments((prev) => prev.filter((d) => d.file_id !== fileId));
      if (viewingFile?.file_id === fileId) {
        setViewingFile(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (mimeType: string, name: string) => {
    if (mimeType.startsWith("image/") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) {
      return <FileImage className="size-4 text-purple-500" />;
    }
    if (mimeType.includes("markdown") || name.endsWith(".md")) {
      return <FileCode className="size-4 text-blue-500" />;
    }
    return <FileText className="size-4 text-amber-500" />;
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Top Navigation Header */}
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
            <FolderKanban className="size-5 text-amber-500" />
            <h1 className="font-semibold text-base tracking-tight">RAG Document Management</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDocuments}
            title="Refresh documents list"
            className="p-2 rounded-lg border border-sidebar-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <RefreshCw className={`size-4 ${isLoadingDocs ? "animate-spin" : ""}`} />
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Upload Form Card */}
        <div className="rounded-2xl border border-sidebar-border bg-card p-6 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-sidebar-border pb-3 gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("upload");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Upload className="size-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("write");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "write"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <FileCode className="size-3.5" />
                <span>Write Markdown</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                {activeTab === "upload"
                  ? "Supported Formats: PDF (.pdf), Markdown (.md), Text (.txt), JPEG (.jpeg), PNG (.png)"
                  : "Markdown Document (.md)"}
              </span>
            </div>
          </div>

          {activeTab === "upload" ? (
            /* TAB 1: FILE UPLOAD FORM */
            <form onSubmit={handleUploadDocument} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Select File <span className="text-muted-foreground font-normal">(.pdf, .md, .txt, .jpeg, .png)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-amber-500">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept={ACCEPTED_EXTENSIONS}
                      className="w-full text-xs cursor-pointer file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tags (Comma separated)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-amber-500">
                    <Tag className="size-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. support, manual, policy"
                      className="w-full bg-transparent focus:outline-none text-xs"
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
                  placeholder="Brief summary of document content..."
                  rows={2}
                  className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs focus:outline-none focus:border-amber-500 resize-none"
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
                  disabled={!selectedFile || isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
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
          ) : (
            /* TAB 2: WRITE MARKDOWN FORM */
            <form onSubmit={handleCreateMarkdown} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document Filename */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Document Filename <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-amber-500">
                    <FileCode className="size-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={markdownTitle}
                      onChange={(e) => setMarkdownTitle(e.target.value)}
                      placeholder="e.g. system_instructions.md"
                      className="w-full bg-transparent focus:outline-none text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Tags Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Tags (Comma separated)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background px-3 py-2 text-xs focus-within:border-amber-500">
                    <Tag className="size-3.5 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. guide, internal, faq"
                      className="w-full bg-transparent focus:outline-none text-xs"
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
                  placeholder="# Document Title&#10;&#10;Write your markdown knowledge article here..."
                  rows={6}
                  className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs font-mono focus:outline-none focus:border-amber-500 resize-y leading-relaxed"
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
                  placeholder="Brief summary of markdown document..."
                  rows={2}
                  className="w-full rounded-xl border border-sidebar-border bg-background p-3 text-xs focus:outline-none focus:border-amber-500 resize-none"
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
                  disabled={!markdownTitle.trim() || !markdownContent.trim() || isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
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
          )}
        </div>

        {/* Documents List */}
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
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-sidebar-border bg-background focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="divide-y divide-sidebar-border">
            {isLoadingDocs ? (
              <div className="p-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                <RefreshCw className="size-4 animate-spin text-amber-500" />
                <span>Loading documents...</span>
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
                              className="inline-flex items-center text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20"
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
                      onClick={() => setViewingFile(doc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sidebar-border bg-background text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                      title="View document inline"
                    >
                      <Eye className="size-3.5 text-amber-500" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(doc.file_id)}
                      disabled={deletingId === doc.file_id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 disabled:opacity-40 transition-colors cursor-pointer"
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
      </main>

      {/* Pop-up File Viewer Modal using /api/documents/{file_id} */}
      {viewingFile && (
        <div
          onClick={() => setViewingFile(null)}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden text-foreground cursor-default"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
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
                onClick={() => setViewingFile(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold transition-colors cursor-pointer text-xs"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
