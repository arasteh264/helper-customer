"use client";

import { useState } from "react";
import { Check, ImagePlus, LoaderCircle, Plus, Send, Trash2 } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ApiError } from "@/src/lib/api/error";
import { formatDate } from "@/src/utils/format";
import { providerArticlesApi } from "../api/provider-articles.api";
import type {
  ProviderArticle,
  ProviderArticleStatus,
  SubmitProviderArticle,
} from "../types/provider-article.types";

interface ArticleGroup {
  id: string;
  name: string;
  specialties: { id: string; name: string }[];
}

interface DraftBlock {
  type: "paragraph" | "heading" | "list" | "tip";
  text: string;
}

const statusLabels: Record<ProviderArticleStatus, string> = {
  PENDING_REVIEW: "در انتظار بررسی مدیر",
  APPROVED: "تأیید و منتشرشده",
  REJECTED: "نیازمند اصلاح",
};

function statusClass(status: ProviderArticleStatus) {
  if (status === "APPROVED") return "bg-emerald-500/10 text-emerald-700";
  if (status === "REJECTED") return "bg-destructive/10 text-destructive";
  return "bg-amber-500/10 text-amber-800";
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function ProviderArticleWorkspace({
  accessToken,
  groups,
  initialArticles,
  taxonomyError = false,
}: {
  accessToken: string;
  groups: ArticleGroup[];
  initialArticles: ProviderArticle[];
  taxonomyError?: boolean;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [readingMinutes, setReadingMinutes] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [specialtyIds, setSpecialtyIds] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<DraftBlock[]>([
    { type: "paragraph", text: "" },
  ]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverAlt, setCoverAlt] = useState("");
  const [pendingCoverId, setPendingCoverId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const group = groups.find((item) => item.id === selectedGroup);
  const slugIsValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  const selectedGroupIds = [...new Set(
    groups
      .filter((item) => item.specialties.some((specialty) => specialtyIds.includes(specialty.id)))
      .map((item) => item.id),
  )];

  function toggleSpecialty(id: string) {
    setSpecialtyIds((ids) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  }

  function updateBlock(index: number, patch: Partial<DraftBlock>) {
    setBlocks((current) => current.map((block, i) => i === index ? { ...block, ...patch } : block));
  }

  function validateCover(file: File | null) {
    if (!file) return "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return "کاور باید JPEG، PNG یا WebP باشد.";
    }
    if (file.size > 5 * 1024 * 1024) return "حجم کاور نباید بیشتر از ۵ مگابایت باشد.";
    return "";
  }

  async function uploadCover(articleId: string, file: File) {
    setBusy(true);
    setError("");
    try {
      await providerArticlesApi.uploadCover(articleId, file, coverAlt, accessToken);
      setPendingCoverId(null);
      setCoverFile(null);
      setNotice("کاور مقاله بارگذاری شد؛ مقاله پس از بررسی مدیر منتشر می‌شود.");
      try {
        setArticles(await providerArticlesApi.listMine(accessToken));
      } catch {
        setNotice("کاور بارگذاری شد، اما تازه‌سازی فهرست انجام نشد. صفحه را دوباره بارگذاری کنید.");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "بارگذاری کاور انجام نشد؛ فایل را دوباره امتحان کنید.");
      setPendingCoverId(articleId);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!slugIsValid) {
      setError("پیوند کوتاه باید فقط شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.");
      return;
    }
    if (!specialtyIds.length) {
      setError("حداقل یک تخصص مرتبط را انتخاب کنید.");
      return;
    }
    if (blocks.some((block) => !block.text.trim())) {
      setError("همه‌ی بخش‌های مقاله باید متن داشته باشند.");
      return;
    }
    const coverError = validateCover(coverFile);
    if (coverError) {
      setError(coverError);
      return;
    }
    const content: SubmitProviderArticle["content"] = blocks.map((block) =>
      block.type === "list"
        ? { type: "list", items: block.text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) }
        : { type: block.type, text: block.text.trim() },
    );
    if (content.some((block) => block.type === "list" && !block.items.length)) {
      setError("برای فهرست دست‌کم یک مورد در هر خط بنویسید.");
      return;
    }

    setBusy(true);
    try {
      const article = await providerArticlesApi.submit({
        slug,
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        specialtyIds,
        categoryIds: selectedGroupIds,
        ...(readingMinutes ? { readingMinutes: Number(readingMinutes) } : {}),
      }, accessToken);
      setArticles((current) => [article, ...current]);
      setTitle("");
      setSlug("");
      setExcerpt("");
      setReadingMinutes("");
      setSpecialtyIds([]);
      setBlocks([{ type: "paragraph", text: "" }]);
      setNotice("مقاله ثبت شد و برای بررسی مدیر ارسال شد.");
      if (coverFile) {
        setBusy(false);
        await uploadCover(article.id, coverFile);
      } else {
        setPendingCoverId(article.id);
        setBusy(false);
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "ثبت مقاله انجام نشد؛ دوباره تلاش کنید.");
      setBusy(false);
    }
  }

  async function retryUpload(articleId: string) {
    if (!coverFile) {
      setError("ابتدا فایل کاور را انتخاب کنید.");
      return;
    }
    const coverError = validateCover(coverFile);
    if (coverError) {
      setError(coverError);
      return;
    }
    await uploadCover(articleId, coverFile);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-foreground/10 bg-card p-4 sm:p-6">
        <h2 className="text-lg font-bold">نوشتن مقاله‌ی آموزشی</h2>
        <p className="mt-1 text-sm leading-6 text-foreground/60">
          مقاله باید علمی و کاربردی باشد، نه تبلیغاتی. پس از ثبت، مدیر آن را بررسی می‌کند.
        </p>
        {taxonomyError ? (
          <p className="mt-4 rounded-lg bg-amber-500/10 p-3 text-sm leading-6 text-amber-900" role="status">
            دریافت فهرست تخصص‌ها ممکن نشد؛ دسته‌بندی‌ها در حال حاضر در دسترس نیستند. صفحه را تازه کنید و دوباره تلاش کنید.
          </p>
        ) : null}
        {error ? <p className="mt-4 rounded-lg bg-destructive/5 p-3 text-sm leading-6 text-destructive" role="alert">{error}</p> : null}
        {notice ? <p className="mt-4 rounded-lg bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-800" role="status">{notice}</p> : null}

        <form className="mt-5 space-y-4" onSubmit={submit}>
          <label className="grid gap-1.5 text-sm font-medium">
            عنوان مقاله
            <input required maxLength={160} value={title} onChange={(event) => {
              setTitle(event.target.value);
              setSlug((current) => current || makeSlug(event.target.value));
            }} className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 font-normal" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            پیوند کوتاه انگلیسی
            <input required dir="ltr" maxLength={120} value={slug} onChange={(event) => setSlug(makeSlug(event.target.value))} className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-left font-normal" placeholder="home-plumbing-basics" />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            خلاصه
            <textarea required maxLength={320} rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="min-w-0 rounded-lg border border-foreground/15 bg-background p-3 text-sm font-normal leading-6" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              زمان مطالعه (دقیقه، اختیاری)
              <input type="number" min={1} max={120} value={readingMinutes} onChange={(event) => setReadingMinutes(event.target.value)} className="h-11 rounded-lg border border-foreground/15 bg-background px-3 font-normal" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              تخصص مرتبط
              <select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)} disabled={taxonomyError || !groups.length} className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 font-normal">
                <option value="">انتخاب گروه تخصصی</option>
                {groups.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </label>
          </div>
          {group ? (
            <fieldset className="rounded-xl border border-foreground/10 p-3">
              <legend className="px-1 text-sm font-medium">تخصص‌های مرتبط</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.specialties.map((specialty) => (
                  <label key={specialty.id} className="flex min-h-11 items-center gap-2 rounded-lg bg-foreground/[0.025] px-3 text-sm">
                    <input type="checkbox" checked={specialtyIds.includes(specialty.id)} onChange={() => toggleSpecialty(specialty.id)} />
                    {specialty.name}
                  </label>
                ))}
              </div>
              {!group.specialties.length ? <p className="text-sm text-foreground/55">تخصص فعالی در این گروه وجود ندارد.</p> : null}
            </fieldset>
          ) : null}

          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold">متن مقاله</h3>
              <Button type="button" variant="outline" onClick={() => setBlocks((current) => [...current, { type: "paragraph", text: "" }])}>
                <Plus size={16} /> افزودن بخش
              </Button>
            </div>
            {blocks.map((block, index) => (
              <div key={index} className="space-y-2 rounded-xl border border-foreground/10 p-3">
                <div className="flex gap-2">
                  <select value={block.type} onChange={(event) => updateBlock(index, { type: event.target.value as DraftBlock["type"] })} className="h-10 min-w-0 flex-1 rounded-lg border border-foreground/15 bg-background px-2 text-sm" aria-label={`نوع بخش ${index + 1}`}>
                    <option value="paragraph">پاراگراف</option>
                    <option value="heading">تیتر</option>
                    <option value="list">فهرست (هر مورد در یک خط)</option>
                    <option value="tip">نکته‌ی کاربردی</option>
                  </select>
                  <Button type="button" variant="ghost" className="h-10 w-11" aria-label={`حذف بخش ${index + 1}`} disabled={blocks.length === 1} onClick={() => setBlocks((current) => current.filter((_, i) => i !== index))}>
                    <Trash2 size={16} />
                  </Button>
                </div>
                <textarea required rows={block.type === "heading" ? 2 : 4} maxLength={10000} value={block.text} onChange={(event) => updateBlock(index, { text: event.target.value })} placeholder={block.type === "list" ? "هر مورد را در خط جداگانه بنویسید" : "متن این بخش را بنویسید"} className="w-full rounded-lg border border-foreground/15 bg-background p-3 text-sm leading-6" />
              </div>
            ))}
          </section>

          <section className="grid gap-3 rounded-xl border border-foreground/10 p-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-medium">
              تصویر کاور (JPEG، PNG یا WebP؛ حداکثر ۵ مگابایت)
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setCoverFile(file);
                setError(validateCover(file));
              }} className="min-h-11 w-full min-w-0 text-xs file:me-2 file:min-h-10 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:text-primary" />
            </label>
            <label className="grid gap-1.5 text-sm font-medium">
              توضیح تصویر برای دسترس‌پذیری
              <input maxLength={200} value={coverAlt} onChange={(event) => setCoverAlt(event.target.value)} className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 font-normal" />
            </label>
            <p className="text-xs leading-5 text-foreground/55 sm:col-span-2">
              برای تأیید و انتشار مقاله، بارگذاری کاور الزامی است. اگر آپلود ناموفق شود، می‌توانید آن را دوباره انجام دهید.
            </p>
          </section>
          {pendingCoverId ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-sm leading-6 text-amber-900">مقاله ثبت شده است؛ کاور آن هنوز بارگذاری نشده.</p>
              <Button type="button" className="mt-2" variant="outline" disabled={busy} onClick={() => void retryUpload(pendingCoverId)}>
                {busy ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                تلاش دوباره برای بارگذاری کاور
              </Button>
            </div>
          ) : (
            <Button type="submit" disabled={busy || taxonomyError || !slugIsValid || !specialtyIds.length}>
              {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
              ارسال برای بررسی مدیر
            </Button>
          )}
          {!slugIsValid && slug ? <p className="text-xs text-destructive">پیوند کوتاه فقط باید حروف انگلیسی کوچک، عدد و خط تیره داشته باشد.</p> : null}
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">مقاله‌های من</h2>
        {!articles.length ? (
          <p className="rounded-xl border border-dashed border-foreground/15 p-6 text-center text-sm text-foreground/55">
            هنوز مقاله‌ای ثبت نکرده‌اید.
          </p>
        ) : articles.map((article: ProviderArticle) => (
          <article key={article.id} className="rounded-xl border border-foreground/10 bg-card p-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div className="min-w-0">
                <h3 className="break-words font-semibold">{article.title}</h3>
                <p className="mt-1 text-xs text-foreground/55">آخرین تغییر: {formatDate(article.updatedAt)}</p>
              </div>
              {article.status ? <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${statusClass(article.status)}`}>{statusLabels[article.status]}</span> : null}
            </div>
            {article.reviewNote ? <p className="mt-3 rounded-lg bg-amber-500/5 p-3 text-sm leading-6">یادداشت مدیر: {article.reviewNote}</p> : null}
            {article.coverImage ? (
              <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700"><Check size={15} /> تصویر کاور بارگذاری شده</p>
            ) : article.status === "PENDING_REVIEW" ? (
              <div className="mt-3 space-y-2">
                <label className="block text-xs font-medium">
                  انتخاب یا جایگزینی کاور
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    setCoverFile(file);
                    setPendingCoverId(article.id);
                    setError(validateCover(file));
                  }} className="mt-1 min-h-11 w-full min-w-0 text-xs file:me-2 file:min-h-10 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:text-primary" />
                </label>
                {pendingCoverId === article.id ? (
                  <Button type="button" variant="outline" disabled={busy || !coverFile} onClick={() => void retryUpload(article.id)}>
                    {busy ? <LoaderCircle size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                    بارگذاری کاور
                  </Button>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
