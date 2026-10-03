"use client";

import { useMemo, useState } from "react";
import { ArrowRight, MessageSquareText, Search } from "lucide-react";

import { RequestChat } from "@/src/features/request/components/request-chat";
import { formatDateTime } from "@/src/utils/format";
import { JOB_STATUS } from "../../utils/job-status";
import type { Job } from "../../types/types";

export function ProviderChatInbox({
  conversations,
  accessToken,
  currentUserId,
  initialRequestId,
}: {
  conversations: Job[];
  accessToken: string;
  currentUserId: string;
  initialRequestId?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    conversations.some((job) => job.id === initialRequestId)
      ? (initialRequestId ?? null)
      : initialRequestId
        ? null
        : (conversations[0]?.id ?? null),
  );
  const [query, setQuery] = useState("");

  const selected = conversations.find((job) => job.id === selectedId) ?? null;
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa-IR");
    if (!normalizedQuery) return conversations;
    return conversations.filter((job) =>
      `${job.title} ${job.service} ${job.customerName}`
        .toLocaleLowerCase("fa-IR")
        .includes(normalizedQuery),
    );
  }, [conversations, query]);

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center border-y border-foreground/10 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageSquareText size={25} />
        </span>
        <h2 className="mt-4 text-base font-semibold text-foreground">
          گفتگویی برای نمایش نیست
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-7 text-foreground/55">
          بعد از پذیرفته‌شدن درخواست مشتری، گفتگوی همان کار از اینجا در دسترس
          قرار می‌گیرد.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside
        className={[
          "min-w-0 overflow-hidden rounded-xl border border-foreground/10 bg-card",
          selected ? "hidden lg:block" : "block",
        ].join(" ")}
      >
        <div className="border-b border-foreground/10 p-4">
          <p className="text-sm font-semibold text-foreground">گفتگوهای کاری</p>
          <label className="relative mt-3 block">
            <span className="sr-only">جست‌وجوی گفتگوها</span>
            <Search
              size={15}
              className="pointer-events-none absolute inset-e-3 top-1/2 -translate-y-1/2 text-foreground/35"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="نام مشتری یا خدمت"
              className="h-10 w-full rounded-lg border border-foreground/10 bg-background pe-9 ps-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </label>
        </div>

        {filtered.length > 0 ? (
          <ul className="max-h-[65vh] divide-y divide-foreground/10 overflow-y-auto">
            {filtered.map((job) => {
              const active = selectedId === job.id;
              const status = JOB_STATUS[job.status];
              return (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(job.id)}
                    aria-pressed={active}
                    className={[
                      "w-full px-4 py-3.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                      active ? "bg-primary/6" : "hover:bg-foreground/3",
                    ].join(" ")}
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {job.customerName}
                        </span>
                        <span className="mt-1 block truncate text-xs text-foreground/55">
                          {job.title}
                        </span>
                      </span>
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${active ? "bg-primary" : "bg-foreground/15"}`}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-2 flex items-center justify-between gap-2 text-[11px] text-foreground/45">
                      <span className="truncate">{job.service}</span>
                      <span className="shrink-0">{status.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-xs text-foreground/55">
            گفتگویی با این مشخصات پیدا نشد.
          </p>
        )}
      </aside>

      <section className={selected ? "min-w-0" : "hidden min-w-0 lg:block"}>
        {selected ? (
          <>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mb-3 inline-flex items-center gap-1 text-sm text-foreground/55 hover:text-primary lg:hidden"
            >
              <ArrowRight size={16} />
              فهرست گفتگوها
            </button>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-foreground/10 pb-3">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-foreground">
                  {selected.title}
                </h2>
                <p className="mt-1 text-xs text-foreground/55">
                  {selected.customerName} · {selected.service}
                </p>
              </div>
              <p className="text-xs text-foreground/45">
                {formatDateTime(selected.scheduledAt)}
              </p>
            </div>
            <RequestChat
              key={selected.id}
              requestId={selected.id}
              accessToken={accessToken}
              currentUserId={currentUserId}
              currentUserRole="PROVIDER"
            />
          </>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center text-foreground/50">
            <MessageSquareText size={28} />
            <p className="mt-3 text-sm">یک گفتگو را انتخاب کنید.</p>
          </div>
        )}
      </section>
    </div>
  );
}
