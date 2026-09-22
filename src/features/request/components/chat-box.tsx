"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import type { ChatMessage, ChatParticipant } from "../types/request.types";
import { toPersianDigits } from "@/src/utils/format";

interface ChatBoxProps {
  participant: ChatParticipant;
  messages: ChatMessage[];
  isTyping?: boolean;
  onSend: (text: string) => void;
  /** ارتفاع ثابت (برای حالت embed داخل صفحه)؛ در ویجت شناور از بیرون کنترل می‌شود */
  className?: string;
}

function formatTime(iso: string) {
  return toPersianDigits(
    new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" }).format(
      new Date(iso)
    )
  );
}

export function ChatBox({ participant, messages, isTyping, onSend, className = "" }: ChatBoxProps) {
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card ${className}`}>
      {/* سربرگ */}
      <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {participant.name.charAt(0)}
          {participant.online && (
            <span className="absolute -bottom-0.5 -end-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
          )}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{participant.name}</p>
          <p className="truncate text-xs text-foreground/50">{participant.role}</p>
        </div>
      </div>

      {/* پیام‌ها */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-xs text-foreground/40">
            هنوز پیامی ارسال نشده. اولین پیام را شما بفرستید.
          </p>
        )}

        {messages.map((m) => {
          const mine = m.sender === "customer";
          return (
            <div key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6",
                  mine
                    ? "rounded-bl-sm bg-primary text-primary-foreground"
                    : "rounded-br-sm bg-foreground/[0.06] text-foreground",
                ].join(" ")}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-foreground/40"}`}>
                  {formatTime(m.time)}
                </p>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-end">
            <div className="flex items-center gap-1 rounded-2xl rounded-br-sm bg-foreground/[0.06] px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ورودی پیام */}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-foreground/10 p-3">
        <label htmlFor="chat-input" className="sr-only">
          پیام شما
        </label>
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="پیام خود را بنویسید…"
          className="h-10 flex-1 rounded-xl border border-foreground/15 bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="ارسال پیام"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={17} className="rtl:-scale-x-100" />
        </button>
      </form>
    </div>
  );
}