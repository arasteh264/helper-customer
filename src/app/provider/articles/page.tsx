import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { providerArticlesApi } from "@/src/features/articles/api/provider-articles.api";
import { ProviderArticleWorkspace } from "@/src/features/articles/components/provider-article-workspace";
import { providerApi } from "@/src/features/provider/api/provider.api";
import type { ProviderSpecialty } from "@/src/features/provider/types/provider.types";
import type { ProviderArticle } from "@/src/features/articles/types/provider-article.types";

export const metadata: Metadata = { title: "مقاله‌های من | پنل متخصص" };

export default async function ProviderArticlesPage() {
  const session = await auth();
  if (!session?.accessToken) redirect("/login?callbackUrl=%2Fprovider%2Farticles");
  const accessToken = session.accessToken;

  let articles: ProviderArticle[] = [];
  let articlesError = false;
  try {
    articles = await providerArticlesApi.listMine(accessToken);
  } catch (error) {
    console.error("Failed to load provider articles.", error);
    articlesError = true;
  }

  let groups: {
    id: string;
    name: string;
    specialties: { id: string; name: string }[];
  }[] = [];
  let taxonomyError = false;
  try {
    const taxonomyGroups = await providerApi.getSpecialtyGroups(accessToken);
    groups = await Promise.all(taxonomyGroups.map(async (group) => {
      const specialties: ProviderSpecialty[] =
        await providerApi.getSpecialtyGroupSpecialties(group.id, accessToken);
      return {
        id: group.id,
        name: group.name,
        specialties: specialties.map(({ id, name }) => ({ id, name })),
      };
    }));
  } catch (error) {
    console.error("Failed to load provider article taxonomy.", error);
    taxonomyError = true;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="مقاله‌های آموزشی"
        description="دانسته‌های تخصصی خود را با مخاطبان به اشتراک بگذارید."
      />
      {articlesError ? (
        <SectionCard title="دریافت مقاله‌ها انجام نشد">
          <p className="text-sm leading-6 text-foreground/65">
            اتصال را بررسی و صفحه را دوباره بارگذاری کنید. برای جلوگیری از ثبت تکراری، تا مشخص‌شدن وضعیت ارسال، فرم مقاله را دوباره نفرستید.
          </p>
        </SectionCard>
      ) : (
        <ProviderArticleWorkspace
          accessToken={accessToken}
          groups={groups}
          initialArticles={articles}
          taxonomyError={taxonomyError}
        />
      )}
    </div>
  );
}
