import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { ProviderChatInbox } from "@/src/features/provider/components/chats/provider-chat-inbox";
import { providerJobsApi } from "@/src/features/provider/api/jobs.api";
import type { Job } from "@/src/features/provider/types/types";

export const metadata: Metadata = { title: "گفتگوها | پنل متخصص" };

const CHAT_JOB_STATUSES: Job["status"][] = [
  "accepted",
  "awaiting_payment",
  "in_progress",
  "awaiting_confirmation",
  "disputed",
];

export default async function ProviderChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string }>;
}) {
  const session = await auth();
  if (!session?.accessToken || !session.user.id) {
    redirect("/login?callbackUrl=%2Fprovider%2Fchats");
  }

  let conversations: Job[];
  const { requestId } = await searchParams;
  try {
    const jobs = await providerJobsApi.list(session.accessToken);
    conversations = jobs.filter((job) =>
      CHAT_JOB_STATUSES.includes(job.status),
    );
  } catch {
    return (
      <div className="space-y-6">
        <PageHeader
          title="گفتگوها"
          description="پیام‌های مربوط به کارهای واگذارشده را از اینجا پیگیری کنید."
        />
        <SectionCard title="دریافت گفتگوها انجام نشد">
          <p className="text-sm leading-7 text-foreground/65">
            فهرست کارهای واگذارشده در دسترس نیست. صفحه را تازه‌سازی کنید و
            دوباره تلاش کنید.
          </p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="گفتگوها"
        description="پیام‌های مربوط به کارهای واگذارشده را از اینجا پیگیری کنید."
      />
      <ProviderChatInbox
        conversations={conversations}
        accessToken={session.accessToken}
        currentUserId={session.user.id}
        initialRequestId={requestId}
      />
    </div>
  );
}
