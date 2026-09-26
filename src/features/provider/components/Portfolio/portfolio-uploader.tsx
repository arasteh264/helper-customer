"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { SectionCard } from "@/src/components/shared/section-card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  addImageToItem,
  createPortfolioItem,
  deleteImage,
  deletePortfolioItem,
  getPortfolioItems,
  type PortfolioItemDto,
} from "../../api/portfolio";

const MAX_ITEMS = 5;
const MIN_RECOMMENDED = 3;
const MAX_SIZE = 3 * 1024 * 1024;

interface PendingFile {
  id: string;
  file: File;
  url: string;
}

function validateFiles(files: File[], limit: number): File[] {
  return files
    .filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`«${file.name}» تصویر نیست`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`حجم «${file.name}» بیشتر از ۳ مگابایت است`);
        return false;
      }
      return true;
    })
    .slice(0, limit);
}

export function PortfolioUploader({
  initial = [],
}: {
  initial?: PortfolioItemDto[];
}) {
  const { data: session, status: sessionStatus } = useSession();
  const [items, setItems] = useState<PortfolioItemDto[]>(initial);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [addingImageFor, setAddingImageFor] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus !== "authenticated" || !session?.accessToken) return;

    getPortfolioItems(session.accessToken)
      .then(setItems)
      .catch(() => toast.error("دریافت نمونه‌کارها با مشکل مواجه شد"))
      .finally(() => setLoading(false));
  }, [sessionStatus, session?.accessToken]);

  const roomLeft = MAX_ITEMS - items.length;

  const onSelectFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const valid = validateFiles(
      files,
      Math.max(0, MAX_ITEMS * 3 - pending.length),
    );
    setPending((previous) => [
      ...previous,
      ...valid.map((file) => ({
        id: `${Date.now()}-${file.name}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removePending = (id: string) => {
    setPending((previous) => {
      const target = previous.find((file) => file.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return previous.filter((file) => file.id !== id);
    });
  };

  const resetForm = () => {
    pending.forEach((file) => URL.revokeObjectURL(file.url));
    setPending([]);
    setTitle("");
    setDescription("");
  };

  const onAddItem = async () => {
    if (!session?.accessToken) {
      toast.error("برای افزودن نمونه‌کار وارد حساب خود شوید");
      return;
    }
    if (roomLeft <= 0) {
      toast.error(`حداکثر ${MAX_ITEMS} نمونه‌کار می‌توانید داشته باشید`);
      return;
    }
    if (pending.length === 0) {
      toast.error("حداقل یک عکس انتخاب کنید");
      return;
    }
    if (!title.trim()) {
      toast.error("عنوان را وارد کنید");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createPortfolioItem(
        {
          files: pending.map((file) => file.file),
          title: title.trim(),
          description: description.trim(),
        },
        session.accessToken,
      );
      setItems((previous) => [...previous, created]);
      resetForm();
      toast.success("نمونه‌کار اضافه شد");
    } catch {
      toast.error("افزودن نمونه‌کار با مشکل مواجه شد");
    } finally {
      setSubmitting(false);
    }
  };

  const onAddImage = async (
    itemId: string,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!session?.accessToken) {
      toast.error("برای افزودن عکس وارد حساب خود شوید");
      return;
    }

    const [valid] = validateFiles([file], 1);
    if (!valid) return;

    setAddingImageFor(itemId);
    try {
      const image = await addImageToItem(itemId, valid, session.accessToken);
      setItems((previous) =>
        previous.map((item) =>
          item.id === itemId
            ? { ...item, images: [...item.images, image] }
            : item,
        ),
      );
    } catch {
      toast.error("افزودن عکس با مشکل مواجه شد");
    } finally {
      setAddingImageFor(null);
    }
  };

  const onRemoveImage = async (itemId: string, imageId: string) => {
    if (!session?.accessToken) {
      toast.error("برای حذف عکس وارد حساب خود شوید");
      return;
    }
    try {
      await deleteImage(itemId, imageId, session.accessToken);
      setItems((previous) =>
        previous.map((item) =>
          item.id === itemId
            ? {
                ...item,
                images: item.images.filter((image) => image.id !== imageId),
              }
            : item,
        ),
      );
    } catch {
      toast.error("حذف عکس با مشکل مواجه شد");
    }
  };

  const onRemoveItem = async (itemId: string) => {
    if (!session?.accessToken) {
      toast.error("برای حذف نمونه‌کار وارد حساب خود شوید");
      return;
    }
    setDeletingId(itemId);
    try {
      await deletePortfolioItem(itemId, session.accessToken);
      setItems((previous) => previous.filter((item) => item.id !== itemId));
      toast.success("نمونه‌کار حذف شد");
    } catch {
      toast.error("حذف نمونه‌کار با مشکل مواجه شد");
    } finally {
      setDeletingId(null);
    }
  };

  const fa = new Intl.NumberFormat("fa-IR");
  const enough = items.length >= MIN_RECOMMENDED;
  const isLoading =
    sessionStatus === "loading" ||
    (sessionStatus === "authenticated" && loading);

  if (isLoading) {
    return (
      <SectionCard id="portfolio" title="نمونه‌کارها">
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-foreground/40" size={22} />
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      id="portfolio"
      title="نمونه‌کارها"
      description={`عکس کارهای قبلی‌تان را همراه با عنوان و توضیح اضافه کنید (حداقل ${fa.format(MIN_RECOMMENDED)} و حداکثر ${fa.format(MAX_ITEMS)} مورد).`}
      action={
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            enough
              ? "bg-green-600/10 text-green-700"
              : "bg-amber-500/15 text-amber-700"
          }`}
        >
          {fa.format(items.length)} / {fa.format(MAX_ITEMS)}
        </span>
      }
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-foreground/10 bg-foreground/[0.04] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs leading-6 text-foreground/55">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                disabled={deletingId === item.id}
                aria-label="حذف کل نمونه‌کار"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/60 text-white hover:bg-destructive"
              >
                {deletingId === item.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>

            <ul className="mt-3 flex flex-wrap gap-2">
              {item.images.map((image) => (
                <li key={image.id} className="relative h-16 w-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={item.title}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(item.id, image.id)}
                    aria-label="حذف این عکس"
                    className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X size={11} />
                  </button>
                </li>
              ))}
              <li>
                <input
                  id={`add-image-${item.id}`}
                  type="file"
                  accept="image/*"
                  onChange={(event) => onAddImage(item.id, event)}
                  disabled={addingImageFor === item.id}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`add-image-${item.id}`}
                  className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-foreground/25 text-foreground/45 hover:border-primary/50 hover:text-primary"
                >
                  {addingImageFor === item.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={18} />
                  )}
                </label>
              </li>
            </ul>
          </li>
        ))}
      </ul>

      {roomLeft > 0 && (
        <div className="mt-4 space-y-3 rounded-xl border border-dashed border-foreground/20 p-4">
          {pending.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {pending.map((file) => (
                <li key={file.id} className="relative h-16 w-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt="پیش‌نمایش"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePending(file.id)}
                    aria-label="حذف از انتخاب"
                    className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X size={11} />
                  </button>
                </li>
              ))}
              <li>
                <input
                  id="portfolio-files"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectFiles}
                  className="peer sr-only"
                />
                <label
                  htmlFor="portfolio-files"
                  className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-lg border border-dashed border-foreground/25 text-foreground/45 hover:border-primary/50 hover:text-primary"
                >
                  <ImagePlus size={20} />
                </label>
              </li>
            </ul>
          ) : (
            <input
              id="portfolio-files"
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectFiles}
              className="block w-full text-sm text-foreground/70"
            />
          )}

          <Input
            placeholder="عنوان"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            placeholder="توضیح (اختیاری)"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button
            type="button"
            onClick={onAddItem}
            disabled={submitting || pending.length === 0}
            className="w-full gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            افزودن نمونه‌کار
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
