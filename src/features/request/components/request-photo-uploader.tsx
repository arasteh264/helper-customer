"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Camera, ImagePlus, Trash2 } from "lucide-react";

import { FILE_RULES, validateFile } from "@/src/utils/file-validation";

const MAX_ITEMS = 6;

export function RequestPhotoUploader({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const localUrls = useRef(new Set<string>());

  useEffect(() => {
    return () => {
      localUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const room = MAX_ITEMS - photos.length;
    if (room <= 0) {
      toast.error(`حداکثر ${MAX_ITEMS} عکس می‌توانید اضافه کنید`);
      return;
    }

    const next: string[] = [];
    for (const file of files.slice(0, room)) {
      const error = validateFile(file, FILE_RULES.avatar);
      if (error) {
        toast.error(error);
        continue;
      }
      const url = URL.createObjectURL(file);
      localUrls.current.add(url);
      next.push(url);
    }

    if (next.length > 0) {
      // TODO: فایل‌ها را با requestApi.uploadPhoto آپلود کنید و آدرس واقعی را جایگزین کنید
      onChange([...photos, ...next]);
    }
  };

  const remove = (url: string) => {
    if (localUrls.current.has(url)) {
      URL.revokeObjectURL(url);
      localUrls.current.delete(url);
    }
    onChange(photos.filter((p) => p !== url));
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">
        عکس از محل مشکل{" "}
        <span className="text-xs font-normal text-foreground/45">(اختیاری، اما کمک زیادی می‌کند)</span>
      </p>

      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photos.map((url, i) => (
          <li key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.04]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`عکس ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(url)}
              aria-label={`حذف عکس ${i + 1}`}
              className="absolute end-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </li>
        ))}

        {photos.length < MAX_ITEMS && (
          <li>
            <input
              id="request-photo-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onSelect}
              className="peer sr-only"
            />
            <label
              htmlFor="request-photo-input"
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-foreground/20 text-center text-xs text-foreground/55 transition-colors hover:border-primary/50 hover:bg-primary/[0.04] hover:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
            >
              <ImagePlus size={22} />
              افزودن عکس
            </label>
          </li>
        )}
      </ul>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground/45">
        <Camera size={13} />
        حداکثر {MAX_ITEMS} عکس، هر کدام تا ۲ مگابایت
      </p>
    </div>
  );
}