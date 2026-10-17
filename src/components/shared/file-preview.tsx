"use client";

import { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Video } from "lucide-react";

export function FilePreview({ file }: { file: File | null | undefined }) {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(
    null,
  );

  useEffect(() => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      return;
    }

    const url = URL.createObjectURL(file);
    const frame = requestAnimationFrame(() => setPreview({ file, url }));
    return () => {
      cancelAnimationFrame(frame);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file) return null;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const Icon = isImage ? ImageIcon : isVideo ? Video : FileText;
  const previewUrl = preview?.file === file ? preview.url : "";

  return (
    <div className="mt-2 flex min-w-0 items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.03] p-2">
      {previewUrl && isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={`پیش‌نمایش ${file.name}`}
          className="h-16 w-16 shrink-0 rounded-md object-cover"
        />
      ) : previewUrl && isVideo ? (
        <video
          src={previewUrl}
          controls
          preload="metadata"
          className="h-16 w-24 shrink-0 rounded-md bg-black object-cover"
          aria-label={`پیش‌نمایش ${file.name}`}
        />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium" title={file.name}>
          {file.name}
        </span>
        <span className="mt-1 block text-[11px] text-foreground/50">
          {new Intl.NumberFormat("fa-IR").format(
            Math.max(1, Math.round(file.size / 1024)),
          )}{" "}
          کیلوبایت
        </span>
      </span>
    </div>
  );
}
