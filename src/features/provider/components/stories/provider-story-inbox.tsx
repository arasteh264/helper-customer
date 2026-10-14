"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import {
  providerStoriesApi,
  type ProviderStoryConversation,
  type ProviderStoryConversationSummary,
} from "../../api/provider-stories.api";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "دریافت پیام‌ها ناموفق بود.";
}

export function ProviderStoryInbox({ accessToken }: { accessToken: string }) {
  const [conversations, setConversations] = useState<
    ProviderStoryConversationSummary[]
  >([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [conversation, setConversation] =
    useState<ProviderStoryConversation | null>(null);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [listError, setListError] = useState("");
  const [conversationError, setConversationError] = useState("");

  const refreshList = useCallback(async () => {
    try {
      setConversations(
        await providerStoriesApi.listStoryConversations(accessToken),
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const getConversation = useCallback(
    (id: string) =>
      providerStoriesApi.getStoryConversationMessages(accessToken, id),
    [accessToken],
  );

  useEffect(() => {
    let current = true;
    const loadList = () => {
      void providerStoriesApi
        .listStoryConversations(accessToken)
        .then((result) => {
          if (current) {
            setConversations(result);
            setListError("");
          }
        })
        .catch((error: unknown) => {
          if (current) setListError(getErrorMessage(error));
        })
        .finally(() => {
          if (current) setLoading(false);
        });
    };
    loadList();
    const timer = window.setInterval(loadList, 15000);
    return () => {
      current = false;
      window.clearInterval(timer);
    };
  }, [accessToken]);

  useEffect(() => {
    if (!activeConversationId) return;
    let current = true;
    void providerStoriesApi
      .getStoryConversationMessages(accessToken, activeConversationId)
      .then((result) => {
        if (current) {
          setConversation(result);
          setConversationError("");
        }
      })
      .catch((error: unknown) => {
        if (current) setConversationError(getErrorMessage(error));
      })
      .finally(() => {
        if (current) setLoading(false);
      });
    const timer = window.setInterval(() => {
      void getConversation(activeConversationId)
        .then((result) => {
          if (current) {
            setConversation(result);
            setConversationError("");
          }
        })
        .catch((error: unknown) => {
          if (current) setConversationError(getErrorMessage(error));
        });
    }, 5000);
    return () => {
      current = false;
      window.clearInterval(timer);
    };
  }, [accessToken, activeConversationId, getConversation]);

  async function sendMessage() {
    const text = body.trim();
    if (!text || !activeConversationId || sending) return;
    setSending(true);
    try {
      await providerStoriesApi.sendStoryConversationMessage(
        accessToken,
        activeConversationId,
        text,
      );
      setBody("");
      setConversation(await getConversation(activeConversationId));
      setConversationError("");
      await refreshList();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <MessageCircle size={19} className="text-primary" />
        <h2 className="text-lg font-bold">پیام‌های داستان</h2>
      </div>
      <p className="mt-1 text-sm text-foreground/55">
        پرسش‌های مشتریان درباره‌ی داستان‌ها را اینجا پاسخ دهید.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(13rem,0.8fr)_minmax(0,1.2fr)]">
        <div className="max-h-[28rem] space-y-2 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center gap-2 p-4 text-sm text-foreground/55">
              <Loader2 size={16} className="animate-spin" /> در حال دریافت...
            </div>
          ) : conversations.length === 0 ? (
            <p className="rounded-xl border border-dashed border-foreground/15 p-4 text-sm text-foreground/55">
              هنوز پیامی برای داستان‌های شما ثبت نشده است.
            </p>
          ) : (
            conversations.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  setConversation(null);
                  setConversationError("");
                  setLoading(true);
                  setActiveConversationId(item.id);
                }}
                className={`w-full rounded-xl border p-3 text-right transition ${
                  activeConversationId === item.id
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 hover:bg-foreground/[0.03]"
                }`}
              >
                <span className="block truncate text-sm font-semibold">
                  {item.customer.name || "مشتری"}
                </span>
                <span className="mt-1 block truncate text-xs text-foreground/55">
                  داستان: {item.story.title}
                </span>
                <span className="mt-1 block truncate text-xs text-foreground/50">
                  {item.lastMessage?.body ?? "گفتگو شروع شده"}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="flex min-h-72 flex-col rounded-xl border border-foreground/10">
          {listError ? (
            <p
              role="alert"
              className="border-b border-destructive/15 px-3 py-2 text-xs text-destructive"
            >
              {listError}
            </p>
          ) : null}
          {!activeConversationId ? (
            <div className="m-auto p-5 text-center text-sm text-foreground/50">
              یک گفتگو را برای دیدن پیام‌ها انتخاب کنید.
            </div>
          ) : (
            <>
              <div className="border-b border-foreground/10 px-4 py-3">
                <p className="text-sm font-semibold">
                  {conversation?.customer.name || "مشتری"}
                </p>
                <p className="mt-1 text-xs text-foreground/55">
                  داستان: {conversation?.story.title ?? "در حال دریافت..."}
                </p>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {conversation?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-6 ${
                      message.senderUserId === conversation.provider.id
                        ? "mr-auto bg-primary text-primary-foreground"
                        : "ml-auto bg-foreground/5"
                    }`}
                  >
                    {message.body}
                  </div>
                ))}
                {conversationError ? (
                  <p role="alert" className="text-xs text-destructive">
                    {conversationError}
                  </p>
                ) : null}
              </div>
              <form
                className="flex gap-2 border-t border-foreground/10 p-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                <input
                  value={body}
                  maxLength={2000}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="پاسخ شما..."
                  className="h-10 min-w-0 flex-1 rounded-lg border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-primary"
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
              <p className="px-3 pb-2 text-[11px] text-foreground/45">
                ارسال شماره تماس، ایمیل و لینک در پیام‌ها مجاز نیست.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
