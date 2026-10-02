import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/src/components/shared/container";
import { categories } from "@/src/features/home/api/data";
import { CategoryPage } from "@/src/features/catalog/components/category-page";
import { CtaSection } from "@/src/features/home/components/cta-section";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) return {};
  return {
    title: `${category.label} | هلپر`,
    description: `بهترین متخصصان ${category.label} را مقایسه کنید و درخواست خدمات ثبت کنید.`,
  };
}

export default async function CategoryRoute({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((c) => c.id === slug);
  if (!category) notFound();

  return (
    <>
      <div className="pt-10 sm:pt-14">
        <Container>
          <CategoryPage category={category} />
        </Container>
      </div>

      <CtaSection />
    </>
  );
}
