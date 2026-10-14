import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { ProviderStoriesManager } from "@/src/features/provider/components/stories/provider-stories-manager";

export const metadata: Metadata = {
  title: "افزودن داستان | پنل متخصص",
};

export default async function NewProviderStoryPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider%2Fstories%2Fnew");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="افزودن داستان"
        description="عکس یا ویدیوی کارتان را انتخاب کنید و پیش از ارسال، پیش‌نمایش آن را ببینید."
        action={
          <Link
            href="/provider/stories"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-foreground/15 px-3 text-sm font-medium"
          >
            <ArrowRight size={16} />
            بازگشت به داستان‌ها
          </Link>
        }
      />
      <ProviderStoriesManager accessToken={session.accessToken} mode="editor" />
    </div>
  );
}
