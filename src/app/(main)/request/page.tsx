import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/src/auth";

import { RequestWizard } from "@/src/features/request/components/request-wizard";
import { Container } from "@/src/components/shared/container";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { ApiError } from "@/src/lib/api/error";

export const metadata: Metadata = { title: "ثبت درخواست تعمیرات | هلپر" };

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ specialistId?: string; specialtyId?: string }>;
}) {
  const query = await searchParams;
  const callbackParams = new URLSearchParams();
  if (query.specialistId) {
    callbackParams.set("specialistId", query.specialistId);
  }
  if (query.specialtyId) {
    callbackParams.set("specialtyId", query.specialtyId);
  }
  const callbackUrl = `/request${callbackParams.size ? `?${callbackParams}` : ""}`;
  const session = await auth();
  if (!session?.accessToken) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let preferredProvider:
    | Awaited<ReturnType<typeof publicProvidersApi.getById>>
    | undefined;
  if (query.specialistId) {
    try {
      preferredProvider = await publicProvidersApi.getById(query.specialistId);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    }
  }
  const preferredSpecialty =
    preferredProvider?.specialties?.find(
      ({ id }) => id === query.specialtyId,
    ) ?? preferredProvider?.specialties?.[0];

  return (
    <div className="min-h-screen bg-foreground/[0.02] py-8 sm:py-12">
      <Container>
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            ثبت درخواست تعمیرات
          </h1>
          <p className="mt-2 text-sm leading-7 text-foreground/60">
            {preferredProvider
              ? `جزئیات خدمت ${preferredSpecialty?.name ?? "موردنیاز"} را وارد کنید تا درخواست برای ${preferredProvider.name} ارسال شود.`
              : "مشکل‌تان را توضیح دهید تا نزدیک‌ترین متخصصان تأییدشده برایتان پیشنهاد بدهند."}
          </p>
        </div>

        <RequestWizard
          accessToken={session.accessToken}
          preferredProviderId={preferredProvider?.id}
          preferredProviderName={preferredProvider?.name}
          providerSpecialties={preferredProvider?.specialties}
          initialSpecialtyId={preferredSpecialty?.id}
        />
      </Container>
    </div>
  );
}
