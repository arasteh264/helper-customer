"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

import { avatarApi } from "../../api/avatar.api";
import { PhotoStudio } from "./photo-studio";

const MAX_SIZE = 2 * 1024 * 1024;

export function AvatarUploader({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string;
}) {
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const [loading, setLoading] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری انتخاب کنید");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("حجم عکس باید کمتر از ۲ مگابایت باشد");
      return;
    }

    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = URL.createObjectURL(file);
    setPreview(objectUrl.current);

    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        setPreview(initialUrl);
        return;
      }
      await avatarApi.upload(file, session.accessToken);
      toast.success("عکس پروفایل بروزرسانی شد");
    } catch {
      setPreview(initialUrl);
      toast.error("آپلود عکس با مشکل مواجه شد");
    } finally {
      setLoading(false);
      setStudioOpen(false);
    }
  };

  const onRemove = async () => {
    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        return;
      }
      await avatarApi.remove(session.accessToken);
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
      }
      setPreview(undefined);
      toast.success("عکس پروفایل حذف شد");
    } catch {
      toast.error("حذف عکس با مشکل مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="avatar" className="flex shrink-0 items-center gap-4 scroll-mt-24">
        <div className="relative">
          {preview ? (
            <img
              src={preview}
              alt="عکس پروفایل"
              className="h-24 w-24 rounded-full border border-foreground/10 object-cover"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
              {name.charAt(0)}
            </span>
          )}

          {loading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
              <Loader2 className="animate-spin text-white" size={22} />
            </span>
          )}

          <button
            type="button"
            onClick={() => setStudioOpen(true)}
            disabled={loading}
            className="absolute -bottom-1 -end-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition-colors hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="تغییر عکس پروفایل"
          >
            <Camera size={16} />
          </button>

          {preview && !loading && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-destructive text-white shadow transition-colors hover:bg-destructive/90"
              aria-label="حذف عکس پروفایل"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="text-sm leading-6">
          <p className="font-medium text-foreground">عکس پروفایل</p>
          <p className="text-foreground/55">
            فقط با دوربین، در یک قاب راهنما و با پس‌زمینه‌ی سفید عکس بگیرید.
          </p>
        </div>
      </div>

      <PhotoStudio
        open={studioOpen}
        onClose={() => setStudioOpen(false)}
        onDone={uploadFile}
      />
    </>
  );
}
