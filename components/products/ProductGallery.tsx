"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

/** Full-screen image lightbox for a product's cover + gallery photos, with prev/next and thumbnails. */
export function ProductGallery({
  images,
  productName,
  open,
  initialIndex = 0,
  onClose,
}: {
  images: string[];
  productName: string;
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, images.length, onClose]);

  if (images.length === 0) return null;
  // images.length > 0 is checked above, so index is always in range and
  // images[0] always exists — the fallback is purely to satisfy noUncheckedIndexedAccess.
  const currentImage = images[index] ?? (images[0] as string);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={onClose}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} photos`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
      >
        <Icon name="close" size={22} />
      </button>

      <div
        className="relative w-full max-w-2xl aspect-square"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={currentImage}
          alt={`${productName} — photo ${index + 1} of ${images.length}`}
          fill
          sizes="(min-width: 768px) 640px, 100vw"
          className="object-contain"
          priority
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
            >
              <Icon name="chevron_left" size={24} />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
            >
              <Icon name="chevron_right" size={24} />
            </button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          className="flex items-center gap-space-xs mt-space-md overflow-x-auto max-w-full px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={cn(
                "relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                i === index ? "border-secondary-fixed" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image src={url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
