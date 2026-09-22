"use client";

import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { ChatWidget } from "./chat-widget";
import type { ChatParticipant } from "../types/request.types";

const SUPPORT: ChatParticipant = { id: "support", name: "پشتیبانی هلپر", role: "در حال یافتن متخصص برای شما", online: true };

export function SuccessScreen({ code, requestId }: { code: string; requestId: string }) {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600/10 text-green-600">
        <CheckCircle2 size={32} />
      </span>
      <h2 className="mt-5 text-xl font-bold text-foreground">درخواست شما ثبت شد 🎉</h2>
      <p className="mt-2 max-w-md text-sm leading-7 text-foreground/60">
        کد پیگیری درخواست شما <span className="font-semibold text-foreground">{code}</span> است.
        به‌زودی پیشنهادهای متخصصان برایتان ارسال می‌شود.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/customer/requests/${requestId}`}
          className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          مشاهده‌ی درخواست
        </Link>
        <Link
          href="/customer/requests"
          className="inline-flex items-center justify-center rounded-xl border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
        >
          بازگشت به لیست درخواست‌ها
        </Link>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs text-foreground/45">
        <MessageCircle size={14} />
        تا زمان پیدا شدن متخصص، سؤالتان را از پشتیبانی بپرسید (پایین صفحه)
      </div>

      <ChatWidget participant={SUPPORT} persona="support" />
    </div>
  );
}