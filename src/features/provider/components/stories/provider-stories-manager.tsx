"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  ImagePlus,
  Loader2,
  Move,
  Plus,
  RotateCw,
  Send,
  Sparkles,
  Trash2,
  Video,
  Wallet,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import { toast } from "sonner";
import {
  providerStoriesApi,
  type ProviderStory,
  type ProviderStorySpecialty,
  type StoryOverlay,
} from "../../api/provider-stories.api";

const statusLabels: Record<ProviderStory["status"], string> = {
  DRAFT: "پیش‌نویس",
  PENDING_REVIEW: "در انتظار بررسی پشتیبانی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
  EXPIRED: "منقضی شده",
};

const storyTextColors = [
  { label: "سفید", value: "#ffffff" },
  { label: "زرد", value: "#ffeb3b" },
  { label: "صورتی", value: "#ff80ab" },
  { label: "آبی", value: "#448aff" },
  { label: "سبز", value: "#69f0ae" },
  { label: "قرمز", value: "#ff5252" },
];

function formatToman(amount: number) {
  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${new Intl.NumberFormat("fa-IR").format(
      Math.max(1, Math.round(bytes / 1024)),
    )} کیلوبایت`;
  }
  return `${new Intl.NumberFormat("fa-IR").format(
    Number((bytes / (1024 * 1024)).toFixed(1)),
  )} مگابایت`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "انجام عملیات ناموفق بود.";
}

export function ProviderStoriesManager({
  accessToken,
  mode = "all",
  initialStoryId,
}: {
  accessToken: string;
  mode?: "all" | "list" | "editor";
  initialStoryId?: string;
}) {
  const router = useRouter();
  const [stories, setStories] = useState<ProviderStory[]>([]);
  const [specialties, setSpecialties] = useState<ProviderStorySpecialty[]>([]);
  const [videoMaxSizeMB, setVideoMaxSizeMB] = useState(100);
  const [canCreateStory, setCanCreateStory] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState("");
  const previewUrlRef = useRef("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [previewErrorMessage, setPreviewErrorMessage] = useState("");
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [overlayText, setOverlayText] = useState("");
  const [overlayColor, setOverlayColor] = useState("#ffffff");
  const [overlayFontSize, setOverlayFontSize] = useState(28);
  const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 55 });

  const refresh = useCallback(async () => {
    try {
      const result = await providerStoriesApi.list(accessToken);
      setStories(result.stories);
      setSpecialties(result.availableSpecialties);
      setVideoMaxSizeMB(result.videoMaxSizeMB);
      setCanCreateStory(result.canCreateStory);
      setLoaded(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const selectFile = useCallback((selectedFile?: File) => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = selectedFile
      ? URL.createObjectURL(selectedFile)
      : "";
    setPreviewUrl(previewUrlRef.current);
    setFile(selectedFile);
    setPreviewError(false);
    setPreviewErrorMessage("");
    setIsDraggingFile(false);
  }, []);

  function resetForm() {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setSpecialtyId("");
    selectFile();
    setOverlayText("");
    setOverlayColor("#ffffff");
    setOverlayFontSize(28);
    setOverlayPosition({ x: 50, y: 55 });
  }

  const editStory = useCallback(
    (story: ProviderStory) => {
      setSelectedId(story.id);
      setTitle(story.title);
      setDescription(story.description ?? "");
      setSpecialtyId(story.specialtyId ?? "");
      setOverlayText(story.overlayText ?? "");
      setOverlayColor(story.overlayColor ?? "#ffffff");
      setOverlayFontSize(story.overlayFontSize ?? 28);
      setOverlayPosition({
        x: story.overlayPositionX ?? 50,
        y: story.overlayPositionY ?? 55,
      });
      selectFile();
      document.getElementById("provider-story-title")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    [selectFile],
  );

  useEffect(() => {
    let isCurrent = true;
    void providerStoriesApi
      .list(accessToken)
      .then((result) => {
        if (!isCurrent) return;
        setStories(result.stories);
        setSpecialties(result.availableSpecialties);
        setVideoMaxSizeMB(result.videoMaxSizeMB);
        setCanCreateStory(result.canCreateStory);
        setLoaded(true);

        if (mode === "editor" && initialStoryId) {
          const story = result.stories.find(({ id }) => id === initialStoryId);
          if (story) {
            editStory(story);
          } else {
            toast.error("داستان موردنظر پیدا نشد.");
            router.replace("/provider/stories");
          }
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) toast.error(getErrorMessage(error));
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [accessToken, editStory, initialStoryId, mode, router]);

  const editingStory = stories.find((story) => story.id === selectedId);
  const effectivePreviewUrl = previewUrl || editingStory?.mediaUrl || "";
  const effectiveIsVideo = file
    ? file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name)
    : editingStory?.mediaType === "VIDEO";

  async function save(submitAfterSave: boolean) {
    if (!title.trim()) {
      toast.error("عنوان داستان را وارد کنید.");
      return;
    }
    if (!selectedId && !file) {
      toast.error("برای داستان جدید تصویر یا ویدیو انتخاب کنید.");
      return;
    }
    if (!selectedId && !canCreateStory) {
      toast.error(
        "امروز یک داستان ثبت کرده‌اید؛ ابتدا همان داستان را حذف کنید.",
      );
      return;
    }
    if (file) {
      const isVideo =
        file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name);
      const maxBytes = isVideo
        ? videoMaxSizeMB * 1024 * 1024
        : 15 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast.error(
          isVideo
            ? `حجم ویدیو باید حداکثر ${videoMaxSizeMB} مگابایت باشد.`
            : "حجم تصویر باید حداکثر ۱۵ مگابایت باشد.",
        );
        return;
      }
    }

    setBusy(true);
    setUploadProgress(file ? 0 : null);
    try {
      const overlay: StoryOverlay = {
        text: overlayText,
        color: overlayColor,
        fontSize: overlayFontSize,
        positionX: overlayPosition.x,
        positionY: overlayPosition.y,
      };
      const story = selectedId
        ? await providerStoriesApi.update(
            accessToken,
            selectedId,
            title,
            description,
            file,
            specialtyId || undefined,
            overlay,
            setUploadProgress,
          )
        : await providerStoriesApi.create(
            accessToken,
            title,
            description,
            file!,
            specialtyId || undefined,
            overlay,
            setUploadProgress,
          );
      if (submitAfterSave) {
        await providerStoriesApi.submit(accessToken, story.id);
        toast.success("داستان برای بررسی پشتیبانی ارسال شد.");
      } else {
        toast.success("پیش‌نویس داستان ذخیره شد.");
      }
      resetForm();
      await refresh();
      router.push("/provider/stories");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
      setUploadProgress(null);
    }
  }

  async function submit(storyId: string) {
    setBusy(true);
    try {
      await providerStoriesApi.submit(accessToken, storyId);
      toast.success("داستان برای بررسی پشتیبانی ارسال شد.");
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function pay(story: ProviderStory) {
    if (
      !window.confirm(
        `مبلغ ${formatToman(story.priceToman ?? 0)} از کیف پول متخصص کسر شود؟`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const result = await providerStoriesApi.pay(accessToken, story.id);
      toast.success(
        `پرداخت انجام شد. مانده‌ی کیف پول: ${formatToman(result.balance)}`,
      );
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function remove(story: ProviderStory) {
    if (
      !window.confirm(
        "این داستان حذف شود؟ با حذف آن می‌توانید داستان دیگری ثبت کنید.",
      )
    )
      return;
    setBusy(true);
    try {
      await providerStoriesApi.delete(accessToken, story.id);
      toast.success("داستان حذف شد.");
      await refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {mode !== "list" ? (
        <>
          {loading ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-card p-6 text-sm text-foreground/60"
            >
              <Loader2 size={17} className="animate-spin" />
              در حال بررسی امکان ثبت داستان امروز...
            </div>
          ) : null}
          <section className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
            <h2 className="text-base font-bold text-foreground">
              قوانین انتشار
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-7 text-foreground/65">
              <li>
                در هر روز فقط یک داستان می‌توانید ثبت کنید؛ با حذف آن امکان ثبت
                داستان دیگری دارید.
              </li>
              <li>هر داستان پیش از انتشار عمومی باید توسط پشتیبانی تأیید شود.</li>
              <li>
                مدت ویدیو محدود نیست؛ حداکثر حجم مجاز فعلی {videoMaxSizeMB}{" "}
                مگابایت است.
              </li>
              <li>داستان پس از ۲۴ ساعت از انتشار حذف می‌شود.</li>
              <li>
                پشتیبانی ممکن است برای انتشار هزینه تعیین کند؛ مبلغ فقط پس از تأیید
                شما از کیف پول کسر می‌شود.
              </li>
            </ul>
          </section>

          {loaded && !canCreateStory && !selectedId ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm leading-6 text-foreground/70">
              امروز داستان ثبت کرده‌اید. برای افزودن داستان دیگر، داستان امروز
              را از فهرست حذف کنید.
            </div>
          ) : null}
          {loaded && (canCreateStory || selectedId) ? (
            <section className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {selectedId ? "ویرایش داستان" : "ساخت داستان"}
                  </h2>
                  <p className="mt-1 text-sm text-foreground/55">
                    تصویر یا ویدیوی کار خود را همراه عنوان و توضیح کوتاه ثبت
                    کنید.
                  </p>
                </div>
                {selectedId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-primary hover:underline"
                  >
                    داستان جدید
                  </button>
                ) : null}
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="order-2 grid content-start gap-4 lg:order-1">
                  <label className="grid gap-1.5 text-sm font-medium">
                    عنوان
                    <input
                      id="provider-story-title"
                      value={title}
                      maxLength={80}
                      onChange={(event) => setTitle(event.target.value)}
                      className="h-11 rounded-lg border border-foreground/15 bg-background px-3 outline-none focus:border-primary"
                      placeholder="مثلاً نمونه کار تعمیر یخچال"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    توضیحات (اختیاری)
                    <textarea
                      value={description}
                      maxLength={500}
                      rows={3}
                      onChange={(event) => setDescription(event.target.value)}
                      className="rounded-lg border border-foreground/15 bg-background px-3 py-2 outline-none focus:border-primary"
                      placeholder="توضیح مختصر درباره‌ی کار"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-medium">
                    برچسب تخصص برای ثبت درخواست از همین متخصص (اختیاری)
                    <select
                      value={specialtyId}
                      onChange={(event) => setSpecialtyId(event.target.value)}
                      className="h-11 rounded-lg border border-foreground/15 bg-background px-3 outline-none focus:border-primary"
                    >
                      <option value="">بدون برچسب تخصص</option>
                      {specialties.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.groupName} / {specialty.name}
                        </option>
                      ))}
                    </select>
                    <span className="text-xs font-normal text-foreground/50">
                      مشتری با انتخاب برچسب می‌تواند درخواست همین خدمت را
                      مستقیماً برای شما ثبت کند.
                    </span>
                  </label>
                  <div className="grid gap-1.5 text-sm font-medium">
                    <span>
                      رسانه‌ی داستان{" "}
                      {selectedId ? "(اختیاری برای جایگزینی)" : ""}
                    </span>
                    <label
                      className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.035] p-4 text-center transition hover:border-primary hover:bg-primary/[0.07]"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const droppedFile = event.dataTransfer.files[0];
                        if (droppedFile) {
                          selectFile(droppedFile);
                        }
                      }}
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {file &&
                        (file.type.startsWith("video/") ||
                          /\.(mp4|mov|webm)$/i.test(file.name)) ? (
                          <Video />
                        ) : (
                          <ImagePlus />
                        )}
                      </span>
                      <span className="text-sm font-semibold">
                        {file?.name ?? "برای انتخاب عکس یا ویدیو بزنید"}
                      </span>
                      <span className="text-xs font-normal text-foreground/50">
                        عکس تا ۱۵ مگابایت؛ ویدیو تا {videoMaxSizeMB} مگابایت،
                        بدون محدودیت زمان
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                        onChange={(event) => {
                          const selectedFile = event.currentTarget.files?.[0];
                          event.currentTarget.value = "";
                          selectFile(selectedFile);
                        }}
                        className="sr-only"
                      />
                    </label>
                    {uploadProgress !== null ? (
                      <div
                        className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/[0.08] via-card to-card p-4 shadow-sm"
                        role="status"
                        aria-live="polite"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-8 -top-10 size-28 rounded-full bg-primary/10 blur-2xl"
                        />
                        <div className="relative flex items-center gap-3">
                          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            {uploadProgress >= 100 ? (
                              <CheckCircle2 size={22} />
                            ) : (
                              <CloudUpload
                                size={22}
                                className="animate-pulse"
                              />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                              <span className="text-sm font-bold text-foreground">
                                {uploadProgress >= 100
                                  ? "رسانه بارگذاری شد؛ در حال ثبت داستان"
                                  : "در حال بارگذاری رسانه"}
                              </span>
                              <span className="text-sm font-extrabold tabular-nums text-primary">
                                {new Intl.NumberFormat("fa-IR").format(
                                  uploadProgress,
                                )}
                                ٪
                              </span>
                            </div>
                            <p className="mt-1 truncate text-xs text-foreground/55">
                              {file?.name ?? "رسانه‌ی داستان"}{" "}
                              {file ? `· ${formatFileSize(file.size)}` : ""}
                            </p>
                          </div>
                        </div>
                        <div
                          className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-primary/10"
                          role="progressbar"
                          aria-label="پیشرفت بارگذاری رسانه"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={uploadProgress}
                        >
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-primary via-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(13,148,136,0.35)] transition-[width] duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-foreground/45">
                          لطفاً تا پایان بارگذاری این صفحه را نبندید.
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <label className="grid gap-1.5 text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" /> متن روی
                      داستان
                    </span>
                    <input
                      value={overlayText}
                      maxLength={120}
                      onChange={(event) => setOverlayText(event.target.value)}
                      className="h-11 rounded-lg border border-foreground/15 bg-background px-3 outline-none focus:border-primary"
                      placeholder="مثلاً قبل و بعد از تعمیر"
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1.5 text-sm font-medium">
                      رنگ نوشته
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="size-7 shrink-0 rounded-full border border-foreground/15"
                          style={{ backgroundColor: overlayColor }}
                        />
                        <select
                          value={overlayColor}
                          onChange={(event) =>
                            setOverlayColor(event.target.value)
                          }
                          className="h-11 min-w-0 flex-1 rounded-lg border border-foreground/15 bg-background px-3 outline-none focus:border-primary"
                          aria-label="رنگ متن داستان"
                        >
                          {!storyTextColors.some(
                            ({ value }) => value === overlayColor,
                          ) ? (
                            <option value={overlayColor}>رنگ فعلی</option>
                          ) : null}
                          {storyTextColors.map(({ label, value }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>
                    <label className="grid gap-1.5 text-sm font-medium">
                      اندازه‌ی نوشته
                      <input
                        type="range"
                        min={16}
                        max={48}
                        value={overlayFontSize}
                        onChange={(event) =>
                          setOverlayFontSize(Number(event.target.value))
                        }
                        className="h-11 accent-primary"
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || loading}
                      onClick={() => void save(false)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-foreground/15 px-4 text-sm font-semibold disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : null}
                      ذخیره پیش‌نویس
                    </button>
                    <button
                      type="button"
                      disabled={busy || loading}
                      onClick={() => void save(true)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      <Send size={15} />
                      ذخیره و ارسال برای بررسی
                    </button>
                  </div>
                </div>
                <div className="order-1 space-y-2 lg:order-2">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Move size={15} /> پیش‌نمایش زنده · متن را بکشید
                  </p>
                  <div
                    className="relative mx-auto aspect-[9/16] w-full max-w-[18rem] touch-none overflow-hidden rounded-[2rem] border-[5px] border-neutral-900 bg-gradient-to-br from-primary/20 via-neutral-900 to-neutral-950 shadow-xl"
                    onDragEnter={(event) => {
                      event.preventDefault();
                      setIsDraggingFile(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                      const target =
                        event.relatedTarget instanceof Node
                          ? event.relatedTarget
                          : null;
                      if (!event.currentTarget.contains(target)) {
                        setIsDraggingFile(false);
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      const droppedFile = event.dataTransfer.files[0];
                      if (droppedFile) selectFile(droppedFile);
                    }}
                    onPointerMove={(event) => {
                      if (event.buttons !== 1) return;
                      const bounds =
                        event.currentTarget.getBoundingClientRect();
                      setOverlayPosition({
                        x: Math.min(
                          92,
                          Math.max(
                            8,
                            ((event.clientX - bounds.left) / bounds.width) *
                              100,
                          ),
                        ),
                        y: Math.min(
                          92,
                          Math.max(
                            8,
                            ((event.clientY - bounds.top) / bounds.height) *
                              100,
                          ),
                        ),
                      });
                    }}
                  >
                    {effectivePreviewUrl &&
                    effectiveIsVideo &&
                    !previewError ? (
                      <video
                        key={effectivePreviewUrl}
                        src={effectivePreviewUrl}
                        controls
                        playsInline
                        preload="auto"
                        className="absolute inset-0 size-full object-cover"
                        onError={(event) => {
                          if (
                            event.currentTarget.getAttribute("src") !==
                            (previewUrl || editingStory?.mediaUrl)
                          ) {
                            return;
                          }
                          const mediaError = event.currentTarget.error;
                          setPreviewError(true);
                          setPreviewErrorMessage(
                            mediaError
                              ? `پخش ویدیو در این مرورگر ناموفق بود (کد ${mediaError.code}). فایل را می‌توانید همچنان بارگذاری کنید.`
                              : "پخش ویدیو در این مرورگر ناموفق بود. فایل را می‌توانید همچنان بارگذاری کنید.",
                          );
                        }}
                      />
                    ) : effectivePreviewUrl &&
                      !effectiveIsVideo &&
                      !previewError ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={effectivePreviewUrl}
                        src={effectivePreviewUrl}
                        alt="پیش‌نمایش رسانه داستان"
                        className="absolute inset-0 size-full object-cover"
                        onError={(event) => {
                          if (
                            event.currentTarget.getAttribute("src") !==
                            (previewUrl || editingStory?.mediaUrl)
                          ) {
                            return;
                          }
                          setPreviewError(true);
                          setPreviewErrorMessage(
                            "مرورگر نتوانست پیش‌نمایش تصویر را باز کند؛ فایل را بررسی یا تصویر دیگری انتخاب کنید.",
                          );
                        }}
                      />
                    ) : previewError ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white/75">
                        <ImagePlus size={34} />
                        <span className="text-sm leading-6">
                          {previewErrorMessage ||
                            "پیش‌نمایش در مرورگر باز نشد؛ فایل را می‌توانید همچنان بارگذاری کنید."}
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white/65">
                        <ImagePlus size={34} />
                        <span className="text-sm">
                          رسانه را انتخاب کنید تا پیش‌نمایش اینجا نمایش داده شود
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
                    <div className="absolute inset-x-3 top-3 flex gap-1">
                      {[0, 1, 2, 3].map((segment) => (
                        <span
                          key={segment}
                          className="h-1 flex-1 rounded-full bg-white/45"
                        />
                      ))}
                    </div>
                    <div
                      className="absolute z-10 cursor-grab whitespace-pre-wrap rounded-lg bg-black/35 px-3 py-1.5 text-center font-bold leading-snug text-shadow active:cursor-grabbing"
                      style={{
                        left: `${overlayPosition.x}%`,
                        top: `${overlayPosition.y}%`,
                        width: "max-content",
                        maxWidth: "calc(100% - 1.5rem)",
                        overflowWrap: "anywhere",
                        color: overlayColor,
                        fontSize: `${overlayFontSize}px`,
                        transform: "translate(-50%, -50%)",
                        textShadow: "0 2px 8px rgba(0,0,0,.8)",
                      }}
                      onPointerDown={(event) =>
                        event.currentTarget.setPointerCapture(event.pointerId)
                      }
                    >
                      {overlayText || "متن دلخواه شما"}
                    </div>
                    {isDraggingFile ? (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-[1.6rem] border-2 border-dashed border-white bg-black/70 px-5 text-center text-sm font-semibold text-white">
                        فایل را اینجا رها کنید تا پیش‌نمایش شود
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      {mode !== "editor" ? (
        <>
          {canCreateStory ? (
            <section className="flex flex-col gap-4 rounded-2xl border border-primary/15 bg-gradient-to-l from-primary/[0.08] to-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">
                  یک لحظه از کارتان را به اشتراک بگذارید
                </h2>
                <p className="mt-1 text-sm text-foreground/60">
                  روزانه یک داستان؛ پس از حذف، امکان ثبت داستان جدید دارید.
                </p>
              </div>
              <Link
                href="/provider/stories/new"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                <Plus size={17} /> افزودن داستان
              </Link>
            </section>
          ) : null}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">داستان‌های من</h2>
                <p className="mt-1 text-sm text-foreground/55">
                  وضعیت بررسی، پرداخت و آمار بازدید را ببینید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void refresh();
                }}
                disabled={loading}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-foreground/15 px-3 text-sm"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <RotateCw size={15} />
                )}
                به‌روزرسانی
              </button>
            </div>
            {!loaded && !loading ? (
              <div className="rounded-xl border border-dashed border-foreground/20 p-6 text-center text-sm text-foreground/60">
                برای دریافت فهرست داستان‌ها، «به‌روزرسانی» را بزنید.
              </div>
            ) : null}
            {loaded && stories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-foreground/20 p-6 text-center text-sm text-foreground/60">
                هنوز داستانی ثبت نکرده‌اید.
              </div>
            ) : null}
            {stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950 sm:aspect-[16/7]">
                  {story.mediaType === "VIDEO" ? (
                    <video
                      src={story.mediaUrl}
                      poster={story.thumbnailUrl}
                      controls
                      preload="none"
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.mediaUrl}
                      alt={story.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    {statusLabels[story.status]}
                  </span>
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white backdrop-blur">
                    {story.mediaType === "VIDEO" ? "ویدیو" : "تصویر"}
                  </span>
                </div>
                <div className="min-w-0 space-y-3 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold leading-6">
                        {story.title}
                      </h3>
                    </div>
                    {story.isPaid ? (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-800">
                        هزینه انتشار: {formatToman(story.priceToman ?? 0)}
                      </span>
                    ) : null}
                  </div>
                  {story.description ? (
                    <p className="text-sm leading-6 text-foreground/60">
                      {story.description}
                    </p>
                  ) : null}
                  {story.specialtyName ? (
                    <p className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">
                      {story.specialtyGroupName} / {story.specialtyName}
                    </p>
                  ) : null}
                  {story.rejectionReason ? (
                    <p className="rounded-lg bg-destructive/5 p-3 text-sm leading-6 text-destructive">
                      دلیل رد: {story.rejectionReason}
                    </p>
                  ) : null}
                  {story.viewsCount !== undefined ? (
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.04] px-3 py-1.5 text-xs text-foreground/60">
                      <Eye size={14} />{" "}
                      {new Intl.NumberFormat("fa-IR").format(story.viewsCount)}{" "}
                      بازدید
                      {story.uniqueViewers !== undefined
                        ? ` • ${new Intl.NumberFormat("fa-IR").format(story.uniqueViewers)} بیننده یکتا`
                        : ""}
                    </p>
                  ) : null}
                  <div className="flex flex-col gap-2 border-t border-foreground/10 pt-3 sm:flex-row sm:flex-wrap">
                    {["DRAFT", "REJECTED"].includes(story.status) ? (
                      <>
                        <Link
                          href={`/provider/stories/edit/${story.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-lg border border-foreground/15 px-4 text-sm font-medium"
                        >
                          ویرایش
                        </Link>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void submit(story.id)}
                          className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50 sm:flex-1"
                        >
                          ارسال برای بررسی
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void remove(story)}
                      aria-label="حذف داستان"
                      className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-destructive/20 px-4 text-sm text-destructive disabled:opacity-50 sm:mr-auto"
                    >
                      <Trash2 size={16} /> حذف داستان
                    </button>
                    {story.status === "APPROVED" &&
                    story.isPaid &&
                    !story.expiresAt ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void pay(story)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      >
                        <Wallet size={14} /> پرداخت و انتشار
                      </button>
                    ) : null}
                  </div>
                  {story.expiresAt ? (
                    <p className="border-t border-foreground/10 pt-3 text-xs text-foreground/45">
                      پایان انتشار:{" "}
                      {new Intl.DateTimeFormat("fa-IR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(story.expiresAt))}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </section>
        </>
      ) : null}
    </div>
  );
}
