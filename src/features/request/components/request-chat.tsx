"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, Send, UserRound } from "lucide-react";
import { toast } from "sonner";

import { requestApi } from "@/src/features/request/api/request.api";
import type {
  RequestChatHistoryResponse,
  RequestChatMessage,
  RequestChatStatus,
} from "@/src/features/request/types/request.types";
import { ApiError } from "@/src/lib/api/error";
import { toPersianDigits } from "@/src/utils/format";

const POLL_INTERVAL_MS = 15000;
const MAX_MESSAGE_LENGTH = 2000;

const statusLabels: Record<string, string> = {
  ACTIVE: "فعال",
  CLOSED: "بسته‌شده",
  BLOCKED: "مسدود",
  ARCHIVED: "بایگانی‌شده",
  PENDING: "در انتظار",
};

function formatTime(iso: string) {
  return toPersianDigits(
    new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tehran",
    }).format(new Date(iso)),
  );
}

function normalizeStatus(status?: RequestChatStatus): RequestChatStatus {
  return status ? String(status).toUpperCase() : "ACTIVE";
}

function dedupeMessages(messages: RequestChatMessage[]) {
  const map = new Map<string, RequestChatMessage>();

  for (const message of messages) {
    if (message?.id) {
      map.set(message.id, message);
    }
  }

  return [...map.values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function validateMessage(body: string) {
  const trimmed = body.trim();
  if (!trimmed) {
    return "پیام را وارد کنید.";
  }

  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return "پیام نمی‌تواند بیشتر از ۲۰۰۰ نویسه باشد.";
  }

  const patterns = [
    /(?:\+?\d[\d\s\-()]{7,}\d)/,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /(?:https?:\/\/|www\.)\S+/i,
    /(?:instagram\.com|t\.me|telegram\.me|x\.com|twitter\.com|wa\.me|whatsapp\.com|@\w+)/i,
  ];

  if (patterns.some((pattern) => pattern.test(trimmed))) {
    return "ارسال شماره تماس، ایمیل، لینک و شناسه‌های شبکه اجتماعی مجاز نیست.";
  }

  return "";
}

export function RequestChat({
  requestId,
  accessToken,
  currentUserId,
  currentUserRole = "CUSTOMER",
}: {
  requestId: string;
  accessToken: string;
  currentUserId: string;
  currentUserRole?: "CUSTOMER" | "PROVIDER";
}) {
  const [messages, setMessages] = useState<RequestChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<RequestChatStatus>("ACTIVE");
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const refreshHistory = useCallback(
    async (silent = false) => {
      if (!requestId || !accessToken) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      if (!silent) {
        setIsLoadingHistory(true);
      }

      try {
        const response = (await requestApi.getChatMessages(
          requestId,
          accessToken,
          controller.signal,
        )) as RequestChatHistoryResponse;

        const nextMessages = dedupeMessages(response?.messages ?? []);
        setMessages(nextMessages);
        setStatus(normalizeStatus(response?.status));
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;

        if (err instanceof ApiError) {
          if (err.status === 401) {
            setError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
            return;
          }

          if (err.status === 403) {
            setError(
              "شما اجازه‌ی دیدن یا ارسال پیام در این درخواست را ندارید.",
            );
            return;
          }

          if (err.status === 404) {
            setError("گفتگو برای این درخواست پیدا نشد.");
            return;
          }
        }

        setError("دریافت پیام‌های گفتگو انجام نشد. دوباره تلاش کنید.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingHistory(false);
        }
      }
    },
    [accessToken, requestId],
  );

  useEffect(() => {
    const initTimer = window.setTimeout(() => {
      void refreshHistory(true);
    }, 0);

    const intervalId = window.setInterval(() => {
      void refreshHistory(true);
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearTimeout(initTimer);
      window.clearInterval(intervalId);
      abortRef.current?.abort();
    };
  }, [refreshHistory]);

  useEffect(() => {
    const container = listRef.current;
    if (!container || messages.length === 0) return;

    const shouldScrollToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120;

    if (shouldScrollToBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const submitMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationMessage = validateMessage(draft);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (normalizeStatus(status) !== "ACTIVE") {
      setError("این گفتگو بسته شده است و ارسال پیام مجاز نیست.");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const created = await requestApi.sendChatMessage(
        requestId,
        draft.trim(),
        accessToken,
      );

      setMessages((previous) => dedupeMessages([...previous, created]));
      setDraft("");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
          return;
        }

        if (err.status === 403) {
          setError("شما اجازه‌ی ارسال پیام در این درخواست را ندارید.");
          return;
        }

        if (err.status === 404) {
          setError("گفتگو برای این درخواست پیدا نشد.");
          return;
        }

        if (err.message) {
          setError(err.message);
          return;
        }
      }

      setError("ارسال پیام انجام نشد. دوباره تلاش کنید.");
      toast.error("ارسال پیام ناموفق بود.");
    } finally {
      setIsSending(false);
    }
  };

  const conversationDisabled = normalizeStatus(status) !== "ACTIVE";

  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground sm:text-lg">
            گفت‌وگوی درخواست
          </h2>
          <p className="mt-1 text-sm text-foreground/55">
            پیام‌ها تنها برای مالک درخواست و ارائه‌دهنده‌ی اختصاص‌یافته
            قابل‌دیدن هستند.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-foreground/60">وضعیت:</span>
          <span
            className={[
              "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
              conversationDisabled
                ? "bg-foreground/5 text-foreground/60"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            ].join(" ")}
          >
            {statusLabels[normalizeStatus(status)] ?? normalizeStatus(status)}
          </span>
          <button
            type="button"
            onClick={() => void refreshHistory(true)}
            disabled={isLoadingHistory}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-foreground/10 px-2.5 text-xs font-medium text-foreground/70 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="به‌روزرسانی گفتگو"
          >
            {isLoadingHistory ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <RefreshCw size={15} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-background">
        <div
          ref={listRef}
          className="max-h-105 space-y-3 overflow-y-auto p-3 sm:p-4"
        >
          {isLoadingHistory && messages.length === 0 ? (
            <div className="flex min-h-45 items-center justify-center text-sm text-foreground/55">
              <Loader2 size={18} className="animate-spin" />
              <span className="mr-2">در حال بارگذاری پیام‌ها…</span>
            </div>
          ) : messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/45">
              هنوز پیامی در این گفتگو ثبت نشده است.
            </p>
          ) : (
            messages.map((message) => {
              const isMine = message.sender?.id === currentUserId;
              const otherRole =
                currentUserRole === "PROVIDER" ? "مشتری" : "ارائه‌دهنده";
              const ownRole =
                currentUserRole === "PROVIDER" ? "ارائه‌دهنده" : "مشتری";

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex max-w-[85%] items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      {message.sender?.name?.charAt(0)?.toUpperCase() || (
                        <UserRound size={12} />
                      )}
                    </div>

                    <div
                      className={[
                        "rounded-2xl px-3 py-2.5 shadow-sm",
                        isMine
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md bg-foreground/5 text-foreground",
                      ].join(" ")}
                    >
                      <p
                        className={`mb-1 text-[11px] font-medium ${isMine ? "text-primary-foreground/75" : "text-foreground/60"}`}
                      >
                        {isMine
                          ? `شما · ${ownRole}`
                          : `${message.sender?.name ?? otherRole} · ${otherRole}`}
                      </p>
                      <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                        {message.body}
                      </p>
                      <p
                        className={[
                          "mt-1 text-[10px]",
                          isMine
                            ? "text-primary-foreground/75"
                            : "text-foreground/45",
                        ].join(" ")}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={submitMessage}
          className="border-t border-foreground/10 p-3 sm:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label htmlFor="request-chat-input" className="sr-only">
              پیام شما
            </label>
            <textarea
              id="request-chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={conversationDisabled || isSending}
              placeholder={
                conversationDisabled
                  ? "این گفتگو بسته شده است"
                  : "پیام خود را بنویسید…"
              }
              className="min-h-12 flex-1 resize-none rounded-xl border border-foreground/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={conversationDisabled || isSending || !draft.trim()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} className="rtl:-scale-x-100" />
              )}
              ارسال
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
