"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShieldCheck, X } from "lucide-react";

import type { SpecialistProfile } from "../types/specialist-profile.types";
import { ChatBox } from "@/src/features/request/components/chat-box";
import { useChat } from "@/src/features/request/hooks/use-chat";
import { getMockReply } from "@/src/features/request/utils/mock-replies";
import { formatMoney } from "@/src/utils/format";

interface BookingPanelProps {
  profile: SpecialistProfile;
}

/**
 * ستون کناری در دسکتاپ، نوار پایین چسبان در موبایل، و یک پنل گفتگوی کنترل‌شده
 * (به‌جای ChatWidget آماده، چون آن کامپوننت دکمه‌ی شناور خودش را دارد که با نوار
 * پایین موبایل این صفحه تداخل پیدا می‌کرد).
 */
export function BookingPanel({ profile }: BookingPanelProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send, isTyping } = useChat({
    autoReply: () => getMockReply("specialist"),
    replySender: "specialist",
  });

  const requestHref = `/request?specialistId=${encodeURIComponent(profile.id)}`;
  const toggleChat = () => setChatOpen((v) => !v);

  return (
    <>
      {/* دسکتاپ: ستون کناری */}
      <div className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-foreground/10 bg-card p-5">
          <p className="text-xs text-foreground/50">شروع قیمت از</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatMoney(profile.startingPrice)}</p>

          <Link
            href={requestHref}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            درخواست خدمت از {profile.name.split(" ")[0]}
          </Link>

          <button
            type="button"
            onClick={toggleChat}
            aria-expanded={chatOpen}
            className="mt-2.5 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-foreground/15 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {chatOpen ? <X size={17} /> : <MessageCircle size={17} />}
            {chatOpen ? "بستن گفتگو" : "پیام به متخصص"}
          </button>

          {chatOpen && (
            <ChatBox
              participant={{ id: profile.id, name: profile.name, role: profile.headline, online: true }}
              messages={messages}
              isTyping={isTyping}
              onSend={send}
              className="mt-3 h-80"
            />
          )}

          <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-foreground/50">
            <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary" />
            پرداخت از طریق هلپر انجام می‌شود؛ پول شما تا تأیید انجام کار نزد ما امن می‌ماند.
          </p>
        </div>
      </div>

      {/* موبایل: نوار پایین چسبان + پنل گفتگوی شناور بالاتر از نوار */}
      {chatOpen && (
        <ChatBox
          participant={{ id: profile.id, name: profile.name, role: profile.headline, online: true }}
          messages={messages}
          isTyping={isTyping}
          onSend={send}
          className="fixed inset-x-3 bottom-20 z-40 h-[22rem] shadow-2xl shadow-foreground/20 lg:hidden"
        />
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-foreground/10 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <button
          type="button"
          onClick={toggleChat}
          aria-expanded={chatOpen}
          aria-label={chatOpen ? "بستن گفتگو" : "پیام به متخصص"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-foreground/15 text-foreground/70"
        >
          {chatOpen ? <X size={19} /> : <MessageCircle size={19} />}
        </button>
        <Link
          href={requestHref}
          className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-medium text-primary-foreground"
        >
          درخواست خدمت
          <span className="text-xs font-normal text-primary-foreground/80">
            از {formatMoney(profile.startingPrice)}
          </span>
        </Link>
      </div>
    </>
  );
}