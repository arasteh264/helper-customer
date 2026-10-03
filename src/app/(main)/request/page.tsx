import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";

import { RequestWizard } from "@/src/features/request/components/request-wizard";
import { Container } from "@/src/components/shared/container";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";

export const metadata: Metadata = { title: "ثبت درخواست تعمیرات | هلپر" };

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ specialistId?: string }>;
}) {
  const query = await searchParams;
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Frequest");
  }

  let preferredProviderId: string | undefined;
  if (query.specialistId) {
    try {
      const provider = await publicProvidersApi.getById(query.specialistId);
      preferredProviderId = provider.id;
    } catch {
      preferredProviderId = query.specialistId;
    }
  }

  return (
    <div className="min-h-screen bg-foreground/[0.02] py-8 sm:py-12">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ثبت درخواست تعمیرات
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            مشکل‌تان را توضیح دهید تا نزدیک‌ترین متخصصان تأییدشده برایتان
            پیشنهاد بدهند.
          </p>
        </div>

        <RequestWizard
          accessToken={session.accessToken}
          preferredProviderId={preferredProviderId}
        />
      </Container>
    </div>
  );
}
