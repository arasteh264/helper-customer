"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

import { providerApi } from "../../api/provider.api";

const MAX_SIZE = 2 * 1024 * 1024; // ۲ مگابایت

export function AvatarUploader({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string;
}) {
  const [preview, setPreview] = useState<string | undefined>(initialUrl);
  const [loading, setLoading] = useState(false);
  const objectUrl = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  const onSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

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
    const localPreview = objectUrl.current;
    setPreview(localPreview);

    setLoading(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        setPreview(initialUrl);
        return;
      }
      await providerApi.uploadAvatar(file, session.accessToken);
      toast.success("عکس پروفایل بروزرسانی شد");
    } catch {
      setPreview(initialUrl);
      toast.error("آپلود عکس با مشکل مواجه شد");
    } finally {
      setLoading(false);
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
      await providerApi.removeAvatar(session.accessToken);
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
    <div className="flex items-center gap-4">
      <div className="relative">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
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

        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={onSelect}
          disabled={loading}
          className="peer sr-only"
        />
        <label
          htmlFor="avatar-input"
          className="absolute -bottom-1 -end-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition-colors hover:bg-primary-hover peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
        >
          <Camera size={16} />
          <span className="sr-only">تغییر عکس پروفایل</span>
        </label>

        {preview && !loading && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-destructive text-white shadow transition-colors hover:bg-destructive/90"
          >
            <X size={12} />
            <span className="sr-only">حذف عکس پروفایل</span>
          </button>
        )}
      </div>

      <div className="text-sm leading-6">
        <p className="font-medium text-foreground">عکس پروفایل</p>
        <p className="text-foreground/55">
          یک عکس واضح و رسمی از صورت‌تان بگذارید. حداکثر ۲ مگابایت.
        </p>
      </div>
    </div>
  );
}