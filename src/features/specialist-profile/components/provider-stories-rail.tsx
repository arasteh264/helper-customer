"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { FormEvent } from "react";
import { ArrowUpLeft, Loader2, MessageCircle, Send, X } from "lucide-react";
import { apiClient } from "@/src/lib/api/client";
import {
  providerStoriesApi,
  type ProviderStoryConversation,
} from "@/src/features/provider/api/provider-stories.api";

interface PublicStory {
  id: string;
  title: string;
  description?: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  specialtyId?: string;
  specialtyName?: string;
  specialtySlug?: string;
  specialtyGroupName?: string;
  overlayText?: string;
  overlayColor: string;
  overlayFontSize: number;
  overlayPositionX: number;
  overlayPositionY: number;
  providerName: string;
  providerAvatarUrl?: string;
  providerId: string;
  createdAt: string;
}

interface PublicStoriesResponse {
  stories: PublicStory[];
}

function getStoryRequestHref(story: PublicStory) {
  const params = new URLSearchParams({ specialistId: story.providerId });
  if (story.specialtyId) params.set("specialtyId", story.specialtyId);
  if (story.specialtyName) params.set("specialtyName", story.specialtyName);
  if (story.specialtySlug) params.set("specialtySlug", story.specialtySlug);
  if (story.specialtyGroupName) {
    params.set("groupName", story.specialtyGroupName);
  }
  return `/request?${params.toString()}`;
}

function StoryAvatar({
  name,
  imageUrl,
  onClick,
  disabled,
  hasStories = false,
}: {
  name: string;
  imageUrl?: string | null;
  onClick: () => void;
  disabled?: boolean;
  hasStories?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={hasStories ? `دیدن داستان‌های ${name}` : `تصویر ${name}`}
      className={`relative rounded-full p-[3px] transition-transform ${
        hasStories
          ? "bg-gradient-to-tr from-emerald-500 via-green-400 to-teal-300 shadow-[0_2px_14px_rgba(16,185,129,0.28)] hover:scale-[1.03]"
          : "bg-transparent"
      }`}
    >
      <span
        className={`block size-24 overflow-hidden rounded-full bg-card p-[3px] sm:size-28 ${
          hasStories ? "" : "border-4 border-card shadow-lg"
        }`}
      >
        <span className="block size-full overflow-hidden rounded-full bg-primary/10">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`تصویر ${name}`}
              className="size-full object-cover object-top"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-3xl font-bold text-primary">
              {name.charAt(0)}
            </span>
          )}
        </span>
      </span>
      {hasStories ? (
        <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-card bg-emerald-500" />
      ) : null}
    </button>
  );
}

export function ProviderStoriesRail({
  providerId,
  display = "rail",
  providerName,
  providerAvatarUrl,
}: {
  providerId?: string;
  display?: "rail" | "profile-avatar";
  providerName?: string;
  providerAvatarUrl?: string;
}) {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [viewerStories, setViewerStories] = useState<PublicStory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeStory =
    activeIndex === null ? undefined : viewerStories[activeIndex];

  useEffect(() => {
    let cancelled = false;
    const endpoint = providerId
      ? `/public/provider-stories/providers/${providerId}`
      : "/public/provider-stories/recent?limit=12";
    void apiClient<PublicStoriesResponse | PublicStory[]>(endpoint, {
      method: "GET",
    })
      .then(({ data }) => {
        if (!cancelled) {
          setStories(Array.isArray(data) ? data : data.stories);
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت داستان‌های متخصص ناموفق بود.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const openProviderStories = useCallback(
    async (selectedProviderId: string) => {
      setViewerLoading(true);
      try {
        const providerStories =
          providerId === selectedProviderId
            ? stories
            : (
                await apiClient<
                  | PublicStoriesResponse
                  | PublicStory[]
                  | { stories: PublicStory[] }
                >(`/public/provider-stories/providers/${selectedProviderId}`, {
                  method: "GET",
                })
              ).data;
        const resolvedStories = Array.isArray(providerStories)
          ? providerStories
          : providerStories.stories;
        if (resolvedStories.length > 0) {
          setViewerStories(resolvedStories);
          setActiveIndex(0);
        }
      } catch (requestError) {
        console.error("Could not load specialist stories", requestError);
        setError("نمایش داستان‌های این متخصص ممکن نیست.");
        console.error("Story viewer request failed", requestError);
      } finally {
        setViewerLoading(false);
      }
    },
    [providerId, stories],
  );

  useEffect(() => {
    if (!activeStory) return;
    void apiClient(`/public/provider-stories/${activeStory.id}/view`, {
      method: "POST",
    }).catch((viewError: unknown) => {
      console.error("Could not record provider story view", viewError);
    });
  }, [activeStory]);

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? current
            : current + 1 < viewerStories.length
              ? current + 1
              : null,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? current : Math.max(0, current - 1),
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, viewerStories.length]);

  // Auto-advance for image stories (videos use onEnded)
  useEffect(() => {
    if (activeIndex === null) return;
    const s = viewerStories[activeIndex];
    if (!s) return;
    if (s.mediaType === "IMAGE") {
      const duration = s.durationSeconds ?? 5;
      const t = window.setTimeout(() => {
        setActiveIndex(
          activeIndex + 1 < viewerStories.length ? activeIndex + 1 : null,
        );
      }, duration * 1000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [activeIndex, viewerStories]);

  if (loading && display === "profile-avatar") {
    return (
      <StoryAvatar
        name={providerName ?? ""}
        imageUrl={providerAvatarUrl}
        onClick={() => undefined}
        disabled
      />
    );
  }
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card px-4 py-3 text-sm text-foreground/55">
        <Loader2 size={16} className="animate-spin" />
        در حال بررسی داستان‌های منتشرشده...
      </div>
    );
  }
  if (error && display !== "profile-avatar") {
    return (
      <p
        role="status"
        className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-foreground/65"
      >
        نمایش داستان‌ها در حال حاضر ممکن نیست.
      </p>
    );
  }
  if (stories.length === 0) {
    return display === "profile-avatar" ? (
      <StoryAvatar
        name={providerName ?? ""}
        imageUrl={providerAvatarUrl}
        onClick={() => undefined}
        disabled
      />
    ) : null;
  }

  return (
    <>
      {display === "profile-avatar" ? (
        <StoryAvatar
          name={providerName ?? stories[0].providerName}
          imageUrl={providerAvatarUrl ?? stories[0].providerAvatarUrl}
          onClick={() => void openProviderStories(stories[0].providerId)}
          disabled={viewerLoading}
          hasStories
        />
      ) : (
        <section
          aria-label="داستان‌های متخصص"
          className="overflow-hidden rounded-2xl border border-foreground/[0.07] bg-card px-4 py-4 shadow-sm sm:px-5"
        >
          {!providerId ? (
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  داستان‌های متخصصان
                </h2>
                <p className="mt-0.5 text-xs text-foreground/55">
                  تازه‌ترین لحظه‌ها از کار متخصصان
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                فعال
              </span>
            </div>
          ) : null}
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from(
              new Map(
                stories.map((story) => [story.providerId, story]),
              ).values(),
            ).map((story) => (
              <button
                key={story.providerId}
                type="button"
                onClick={() => void openProviderStories(story.providerId)}
                disabled={viewerLoading}
                className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-1.5 text-center disabled:opacity-60"
                aria-label={`دیدن داستان‌های ${story.providerName}`}
              >
                <span className="relative rounded-full bg-gradient-to-tr from-emerald-500 via-green-400 to-teal-300 p-[3px] shadow-[0_2px_12px_rgba(16,185,129,0.22)] transition-transform group-hover:scale-105">
                  <span className="block size-[4.15rem] overflow-hidden rounded-full border-[3px] border-card bg-muted">
                    {story.providerAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.providerAvatarUrl}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-emerald-500/15 text-xl font-bold text-primary">
                        {story.providerName.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="absolute bottom-0 right-0 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
                </span>
                <span className="w-full truncate text-xs font-medium text-foreground/75">
                  {story.providerName}
                </span>
                <span className="-mt-1 text-[10px] text-emerald-700">
                  داستان جدید
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeStory ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`داستان ${activeStory.title}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-0"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null);
          }}
        >
          <div className="absolute inset-0 bg-black/80" />

          <div className="relative z-10 flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-neutral-950 text-white shadow-2xl sm:my-4 sm:h-[min(92vh,850px)] sm:rounded-2xl sm:border sm:border-white/10">
            {/* progress bars */}
            <div className="flex gap-2 p-3">
              {viewerStories.map((s, i) => {
                const isActive = i === activeIndex;
                const prev = i < (activeIndex ?? 0);
                const duration =
                  s.durationSeconds ?? (s.mediaType === "VIDEO" ? 10 : 5);
                return (
                  <div
                    key={s.id}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    <div
                      className={`h-full rounded-full ${isActive ? "bg-white" : prev ? "bg-white" : "bg-white/30"}`}
                      style={{
                        width: isActive || prev ? "100%" : "0%",
                        animation: isActive
                          ? `story-progress ${duration}s linear forwards`
                          : "none",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <span className="size-10 shrink-0 rounded-full bg-gradient-to-tr from-emerald-400 to-primary p-[2px]">
                  <span className="block size-full overflow-hidden rounded-full border-2 border-neutral-950 bg-white/10">
                    {activeStory.providerAvatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={activeStory.providerAvatarUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-sm font-bold">
                        {activeStory.providerName?.[0] ?? ""}
                      </span>
                    )}
                  </span>
                </span>
                <div>
                  <div className="text-sm font-medium text-white">
                    {activeStory.providerName}
                  </div>
                  <div className="text-xs text-white/70">
                    {new Intl.DateTimeFormat("fa-IR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(activeStory.createdAt))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="بستن داستان"
                  onClick={() => setActiveIndex(null)}
                  className="text-white/90"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* media area */}
            <div className="relative min-h-0 flex-1">
              {activeStory.mediaType === "VIDEO" ? (
                <video
                  src={activeStory.mediaUrl}
                  poster={activeStory.thumbnailUrl}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  onEnded={() =>
                    setActiveIndex(
                      activeIndex! + 1 < viewerStories.length
                        ? activeIndex! + 1
                        : null,
                    )
                  }
                  className="h-full w-full object-contain"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={activeStory.mediaUrl}
                  alt={activeStory.title}
                  className="h-full w-full object-contain"
                />
              )}

              {activeStory.overlayText ? (
                <span
                  className="pointer-events-none absolute whitespace-pre-wrap rounded-md bg-black/30 px-3 py-1.5 text-center font-bold"
                  style={{
                    left: `${activeStory.overlayPositionX}%`,
                    top: `${activeStory.overlayPositionY}%`,
                    width: "max-content",
                    maxWidth: "calc(100% - 1.5rem)",
                    overflowWrap: "anywhere",
                    color: activeStory.overlayColor,
                    fontSize: `${activeStory.overlayFontSize}px`,
                    lineHeight: 1.2,
                    transform: "translate(-50%, -50%)",
                    textShadow: "0 2px 8px rgba(0,0,0,.85)",
                  }}
                >
                  {activeStory.overlayText}
                </span>
              ) : null}

              {/* tap zones */}
              <button
                type="button"
                onClick={() => setActiveIndex(Math.max(0, activeIndex! - 1))}
                className="absolute left-0 top-0 h-full w-1/2 bg-transparent"
                aria-hidden
              />
              <button
                type="button"
                onClick={() =>
                  setActiveIndex(
                    activeIndex! + 1 < viewerStories.length
                      ? activeIndex! + 1
                      : null,
                  )
                }
                className="absolute right-0 top-0 h-full w-1/2 bg-transparent"
                aria-hidden
              />
            </div>

            {/* footer */}
            <div className="max-h-[35vh] shrink-0 space-y-2 overflow-y-auto bg-black/60 p-4">
              <h3 className="text-white font-semibold">{activeStory.title}</h3>
              {activeStory.description ? (
                <p className="text-white/80 text-sm">
                  {activeStory.description}
                </p>
              ) : null}

              {activeStory.specialtyName ? (
                <Link
                  href={getStoryRequestHref(activeStory)}
                  className="mt-1 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/80 underline decoration-white/45 underline-offset-2 hover:bg-white/15"
                >
                  {activeStory.specialtyGroupName} / {activeStory.specialtyName}
                </Link>
              ) : null}

              <Link
                href={getStoryRequestHref(activeStory)}
                className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                ثبت درخواست از این متخصص
                <ArrowUpLeft size={16} />
              </Link>

              <StoryConversation key={activeStory.id} story={activeStory} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function StoryConversation({ story }: { story: PublicStory }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] =
    useState<ProviderStoryConversation | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const accessToken = session?.accessToken;

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    try {
      const result = await providerStoriesApi.getCustomerStoryMessages(
        accessToken,
        story.id,
      );
      setConversation(result);
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "دریافت پیام‌ها ناموفق بود.",
      );
    }
  }, [accessToken, story.id]);

  useEffect(() => {
    if (!open || !accessToken) return;
    const loadMessages = () =>
      providerStoriesApi.getCustomerStoryMessages(accessToken, story.id);
    const applyMessages = () => {
      void loadMessages()
        .then((result) => {
          setConversation(result);
          setError("");
        })
        .catch((requestError: unknown) => {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "دریافت پیام‌ها ناموفق بود.",
          );
        });
    };
    void loadMessages()
      .then((result) => {
        setConversation(result);
        setError("");
      })
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "دریافت پیام‌ها ناموفق بود.",
        );
      })
      .finally(() => setLoading(false));
    const timer = window.setInterval(applyMessages, 5000);
    return () => window.clearInterval(timer);
  }, [accessToken, open, story.id]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = body.trim();
    if (!accessToken || !text || sending) return;
    setSending(true);
    try {
      await providerStoriesApi.sendCustomerStoryMessage(
        accessToken,
        story.id,
        text,
      );
      setBody("");
      await refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ارسال پیام ناموفق بود.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => {
          if (!open) setLoading(true);
          setOpen((value) => !value);
        }}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10"
      >
        <MessageCircle size={16} />
        {open ? "بستن گفتگو" : "پرسش درباره‌ی این داستان"}
      </button>
      {open ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/15 bg-white/[0.06]">
          {status === "unauthenticated" ? (
            <div className="p-4 text-sm leading-6 text-white/75">
              برای ارسال پیام ابتدا{" "}
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
                className="font-semibold text-white underline"
              >
                وارد حساب مشتری
              </Link>{" "}
              شوید.
            </div>
          ) : status === "loading" ? (
            <div className="flex items-center gap-2 p-4 text-sm text-white/70">
              <Loader2 size={16} className="animate-spin" /> در حال بررسی
              حساب...
            </div>
          ) : (
            <>
              <div className="max-h-56 space-y-2 overflow-y-auto p-3">
                {loading && !conversation ? (
                  <p className="flex items-center gap-2 text-sm text-white/65">
                    <Loader2 size={15} className="animate-spin" /> در حال دریافت
                    پیام‌ها...
                  </p>
                ) : null}
                {conversation?.messages.map((message) => (
                  <p
                    key={message.id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                      message.senderUserId === conversation.customer.id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-white/10 text-white"
                    }`}
                  >
                    {message.body}
                  </p>
                ))}
                {conversation?.messages.length === 0 ? (
                  <p className="text-sm text-white/60">
                    گفتگو را با پرسیدن سوال خود شروع کنید.
                  </p>
                ) : null}
                {error ? (
                  <p role="alert" className="text-xs text-rose-200">
                    {error}
                  </p>
                ) : null}
              </div>
              <form
                onSubmit={(event) => void sendMessage(event)}
                className="flex gap-2 border-t border-white/10 p-3"
              >
                <input
                  value={body}
                  maxLength={2000}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="پیام شما درباره‌ی این داستان..."
                  className="h-10 min-w-0 flex-1 rounded-lg border border-white/15 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/40"
                />
                <button
                  type="submit"
                  disabled={!body.trim() || sending}
                  aria-label="ارسال پیام"
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>
              <p className="px-3 pb-2 text-[11px] text-white/45">
                ارسال شماره تماس، ایمیل و لینک مجاز نیست.
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
