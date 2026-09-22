"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import type { ChatParticipant } from "../types/request.types";
import { useChat } from "../hooks/use-chat";
import { getMockReply } from "../utils/mock-replies";
import { ChatBox } from "./chat-box";

interface ChatWidgetProps {
  participant: ChatParticipant;
  /** چه کسی به‌صورت خودکار پاسخ می‌دهد (فقط برای دمو) */
  persona: "support" | "specialist";
}

/** حبابک شناور گفتگو؛ در گوشه‌ی صفحه باز و بسته می‌شود */
export function ChatWidget({ participant, persona }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const lastSeenCount = useRef(0);

  const { messages, send, isTyping } = useChat({
    autoReply: () => getMockReply(persona),
    replySender: persona,
  });

  // وقتی پیام تازه‌ای از طرف مقابل برسد و گفتگو بسته باشد، نشان «خوانده‌نشده» را روشن کن
  useEffect(() => {
    if (open) {
      lastSeenCount.current = messages.length;
      setHasUnread(false);
      return;
    }
    const hasNewFromOther = messages
      .slice(lastSeenCount.current)
      .some((m) => m.sender !== "customer");
    if (hasNewFromOther) setHasUnread(true);
  }, [messages, open]);

  return (
    <div className="fixed bottom-4 end-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:end-6">
      {open && (
        <ChatBox
          participant={participant}
          messages={messages}
          isTyping={isTyping}
          onSend={send}
          className="h-[28rem] w-[calc(100vw-2rem)] max-w-sm shadow-2xl shadow-foreground/20"
        />
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "بستن گفتگو" : `گفتگو با ${participant.name}`}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && hasUnread && (
          <span className="absolute -top-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-destructive" />
        )}
      </button>
    </div>
  );
}