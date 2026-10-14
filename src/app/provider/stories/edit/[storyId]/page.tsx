import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { ProviderStoriesManager } from "@/src/features/provider/components/stories/provider-stories-manager";

export const metadata: Metadata = {
  title: "ویرایش داستان | پنل متخصص",
};

export default async function EditProviderStoryPage({
  params,
}: {
  params: Promise<{ storyId: string }>;
}) {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Fprovider%2Fstories");
  }
  const { storyId } = await params;

  return (
    <div className="space-y-5">
      <PageHeader
        title="ویرایش داستان"
        description="جزئیات داستان را ویرایش کنید؛ پس از ذخیره به فهرست داستان‌ها برمی‌گردید."
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
      <ProviderStoriesManager
        accessToken={session.accessToken}
        mode="editor"
        initialStoryId={storyId}
      />
    </div>
  );
}
