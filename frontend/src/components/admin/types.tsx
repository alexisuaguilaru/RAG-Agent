import React from "react";
import { FileImage, FileCode, FileText } from "lucide-react";

export interface StoredEmbedFile {
  file_id: string;
  filename: string;
  last_modification: string;
  content_type: string;
  description?: string;
  tags?: string[];
}

export const SUPPORTED_MIME_TYPES = [
  "text/markdown",
  "text/plain",
  "image/jpeg",
  "image/png",
  "application/pdf",
];

export const ACCEPTED_EXTENSIONS = ".md,.txt,.jpeg,.jpg,.png,.pdf";

export const getFileIcon = (mimeType: string, name: string) => {
  if (
    mimeType.startsWith("image/") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png")
  ) {
    return <FileImage className="size-4 text-purple-500" />;
  }
  if (mimeType.includes("markdown") || name.endsWith(".md")) {
    return <FileCode className="size-4 text-secondary" />;
  }
  return <FileText className="size-4 text-secondary" />;
};

export const formatDate = (isoString: string) => {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
};
