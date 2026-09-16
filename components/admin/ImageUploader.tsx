"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CloudinaryFolderKey } from "@/lib/cloudinary/config";

interface UploadResponse {
  success: boolean;
  data?: { url: string; publicId: string };
  error?: string;
}

/**
 * Drag-and-drop / click-to-upload image field backed by POST /api/upload,
 * which proxies to Cloudinary server-side. Used by ProductForm and
 * CategoryForm for product/category images.
 */
export function ImageUploader({
  folder,
  value,
  onChange,
  onUploadingChange,
}: {
  folder: CloudinaryFolderKey;
  value: { url: string; publicId: string | null } | null;
  onChange: (next: { url: string; publicId: string } | null) => void;
  /** Lets the parent form disable Save while an upload is still in flight —
   * otherwise submitting mid-upload silently drops the image, since form
   * state only updates once the upload actually resolves. */
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json: UploadResponse = await res.json();

      if (!json.success || !json.data) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange({ url: json.data.url, publicId: json.data.publicId });
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      {value?.url ? (
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low">
          <Image src={value.url} alt="Uploaded image" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
            isDragging
              ? "border-secondary bg-secondary-container/20"
              : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
          )}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-secondary" size={28} />
          ) : (
            <Upload className="text-outline" size={28} />
          )}
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center px-4">
            {isUploading ? "Uploading…" : "Click or drag an image here (JPG, PNG, WEBP)"}
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? <p className="text-error text-label-sm font-label-sm">{error}</p> : null}
    </div>
  );
}
