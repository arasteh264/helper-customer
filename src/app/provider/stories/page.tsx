import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/components/shared/page-header";
import { ProviderStoriesManager } from "@/src/features/provider/components/stories/provider-stories-manager";
import { ProviderStoryInbox } from "@/src/features/provider/components/stories/provider-story-inbox";
import { auth } from "@/src/auth";

export const metadata: Metadata = {
  title: "داستان‌ها | پنل متخصص",
};

export default async function ProviderStoriesPage() {
  const session = await auth();
  if (!session?.accessToken)
    redirect("/login?callbackUrl=%2Fprovider%2Fstories");

  return (
    <div className="space-y-5">
      <PageHeader
        title="داستان‌ها و معرفی خدمات"
        description="نمونه‌کار خود را ثبت کنید و پس از تأیید مدیر برای مشتریان نمایش دهید."
      />
      <ProviderStoriesManager accessToken={session.accessToken} mode="list" />
      <ProviderStoryInbox accessToken={session.accessToken} />
    </div>
  );
}
