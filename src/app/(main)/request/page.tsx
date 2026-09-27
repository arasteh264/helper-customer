import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/src/auth";

import { RequestWizard } from "@/src/features/request/components/request-wizard";
import {
  requestApi,
  type ServiceCategory,
} from "@/src/features/request/api/request.api";
import { Container } from "@/src/components/shared/container";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";

export const metadata: Metadata = { title: "ثبت درخواست تعمیرات | هلپر" };

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ specialistId?: string; skillName?: string }>;
}) {
  const query = await searchParams;
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login?callbackUrl=%2Frequest");
  }

  let categories: ServiceCategory[];
  let preferredProviderId: string | undefined;
  let initialCategoryName: string | undefined;
  try {
    categories = await requestApi.getCategories(session.accessToken);
    if (query.specialistId) {
      const provider = await publicProvidersApi.getById(query.specialistId);
      preferredProviderId = provider.id;
      const providerSkills = provider.skills.map((skill) => skill.name);
      categories = categories.filter((category) =>
        providerSkills.includes(category.name),
      );
      initialCategoryName =
        (query.skillName && providerSkills.includes(query.skillName)
          ? query.skillName
          : providerSkills[0]) ?? undefined;
    }
  } catch {
    categories = [];
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

        {categories.length === 0 ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-foreground/10 bg-card p-6 text-center">
            <p className="text-sm leading-6 text-foreground/65">
              فعلاً متخصص تأییدشده‌ای برای ثبت درخواست در دسترس نیست.
            </p>
            <Link
              href="/specialists"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
            >
              دیدن متخصصان
            </Link>
          </div>
        ) : (
          <RequestWizard
            categories={categories}
            accessToken={session.accessToken}
            preferredProviderId={preferredProviderId}
            initialCategoryName={initialCategoryName}
          />
        )}
      </Container>
    </div>
  );
}
