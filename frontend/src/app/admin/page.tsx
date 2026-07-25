"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { DocumentUploadCard } from "@/components/admin/document-upload-card";
import { DocumentList } from "@/components/admin/document-list";
import { DocumentViewerModal } from "@/components/admin/document-viewer-modal";
import { StoredEmbedFile } from "@/components/admin/types";

export default function AdminPage() {
  const [documents, setDocuments] = useState<StoredEmbedFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isRagConnected, setIsRagConnected] = useState<boolean | null>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingFile, setViewingFile] = useState<StoredEmbedFile | null>(null);

  // Fetch real stored files from GET /api/documents (FastAPI http://localhost:6060/documents/)
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch("/api/documents", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDocuments(data);
          setIsRagConnected(true);
        } else {
          setIsRagConnected(false);
          setDocuments([]);
        }
      } else {
        setIsRagConnected(false);
        setDocuments([]);
      }
    } catch {
      setIsRagConnected(false);
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    const interval = setInterval(() => {
      fetchDocuments();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchDocuments]);

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
    } catch {
      // Ignore errors
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <AdminHeader
        isRagConnected={isRagConnected}
        isLoadingDocs={isLoadingDocs}
        onRefresh={fetchDocuments}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        <DocumentUploadCard
          isRagConnected={isRagConnected}
          onRefresh={fetchDocuments}
        />

        <DocumentList
          documents={documents}
          isLoadingDocs={isLoadingDocs}
          isRagConnected={isRagConnected}
          onView={(doc) => setViewingFile(doc)}
          onDelete={handleDeleteDocument}
          deletingId={deletingId}
        />
      </main>

      <DocumentViewerModal
        viewingFile={viewingFile}
        onClose={() => setViewingFile(null)}
      />
    </div>
  );
}
