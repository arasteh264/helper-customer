
import { apiClient } from "@/src/lib/api/client";
import type { ChatMessage, NewRequestDraft } from "../types/request.types";

// TODO: آدرس‌های API واقعی پروژه را اینجا جایگزین کنید

export const requestApi = {
//   submit: (draft: NewRequestDraft) =>
//     apiClient<{ id: string; code: string }>("/api/customer/requests", {
//       method: "POST",
//       json: draft,
//     }),

  /** آپلود مستقیم با fetch، چون FormData با کمک‌کننده‌ی http (که JSON می‌فرستد) سازگار نیست */
  uploadPhoto: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/uploads/request-photo", { method: "POST", body: form });
    if (!res.ok) throw new Error("upload failed");
    return (await res.json()) as { url: string };
  },

//   sendMessage: (threadId: string, text: string) =>
//     http<ChatMessage>(`/api/chat/${threadId}/messages`, {
//       method: "POST",
//       json: { text },
//     }),
};