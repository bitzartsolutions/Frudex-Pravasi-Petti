"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CloudinaryFolderKey } from "@/lib/cloudinary/config";

export interface GalleryImageValue {
  id?: string;
  url: string;
  publicId: string | null;
}

interface UploadResponse {
  success: boolean;
  data?: { url: string; publicId: string };
  error?: string;
}

/**
 * Multi-image gallery uploader — appends new uploads to the list rather
 * than replacing a single value like ImageUploader does. Order in the
 * array is the display order; the reorder arrows just swap array
 * positions, which the parent form persists as `display_order`.
 */
export function MultiImageUploader({
  folder,
  value,
  onChange,
  onUploadingChange,
}: {
  folder: CloudinaryFolderKey;
  value: GalleryImageValue[];
  onChange: (next: GalleryImageValue[]) => void;
  /** Lets the parent form disable Save while an upload is still in flight —
   * otherwise submitting mid-upload silently drops the image, since form
   * state only updates once the upload actually resolves. */
  onUploadingChange?: (isUploading: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    setError(null);
    setIsUploading(true);
    onUploadingChange?.(true);
    try {
      const uploaded: GalleryImageValue[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const json: UploadResponse = await res.json();

        if (!json.success || !json.data) {
          setError(json.error ?? "Upload failed");
          continue;
        }
        uploaded.push({ url: json.data.url, publicId: json.data.publicId });
      }
      if (uploaded.length > 0) onChange([...value, ...uploaded]);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (fileList) uploadFiles(Array.from(fileList));
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function moveTo(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const current = value[index];
    const swapped = value[target];
    if (!current || !swapped) return;
    const next = [...value];
    next[index] = swapped;
    next[target] = current;
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {value.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
          {value.map((img, index) => (
            <div
              key={img.id ?? img.url}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low"
            >
              <Image src={img.url} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => moveTo(index, -1)}
                  disabled={index === 0}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30"
                  aria-label="Move earlier"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="px-2 py-0.5 rounded-full bg-black/60 text-white font-label-sm text-label-sm">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => moveTo(index, 1)}
                  disabled={index === value.length - 1}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30"
                  aria-label="Move later"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
          "w-full py-space-lg rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
          isDragging
            ? "border-secondary bg-secondary-container/20"
            : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
        )}
      >
        {isUploading ? (
          <Loader2 className="animate-spin text-secondary" size={24} />
        ) : (
          <Upload className="text-outline" size={24} />
        )}
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center px-4">
          {isUploading ? "Uploading…" : "Click or drag images here — you can select several at once"}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error ? <p className="text-error text-label-sm font-label-sm">{error}</p> : null}
    </div>
  );
}
