"use client";

import { useCallback, useState } from "react";

import type { ChatMessage, ChatSender } from "../types/request.types";

interface UseChatOptions {
  initialMessages?: ChatMessage[];
  /** برای شبیه‌سازی پاسخ خودکار طرف مقابل (چون سرور چت واقعی متصل نیست) */
  autoReply?: (text: string) => string | null;
  replySender?: ChatSender;
}

let idCounter = 0;
const nextId = () => `m-${Date.now()}-${idCounter++}`;

export function useChat({ initialMessages = [], autoReply, replySender = "specialist" }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const message: ChatMessage = {
        id: nextId(),
        sender: "customer",
        text: trimmed,
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);

      // TODO: پیام را به API/سوکت واقعی ارسال کنید
      const reply = autoReply?.(trimmed);
      if (reply) {
        setIsTyping(true);
        window.setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: nextId(), sender: replySender, text: reply, time: new Date().toISOString() },
          ]);
        }, 1100 + Math.random() * 900);
      }
    },
    [autoReply, replySender]
  );

  return { messages, send, isTyping };
}