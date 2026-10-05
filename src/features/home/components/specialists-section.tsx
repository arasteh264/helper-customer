import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { publicProvidersApi } from "@/src/features/catalog/api/providers.api";
import { mapPublicProvider } from "@/src/features/catalog/utils/map-public-provider";
import type { DirectorySpecialist } from "@/src/features/catalog/types/catalog.types";
import { SpecialistsCarousel } from "./specialists-carousel";

export async function SpecialistsSection() {
  let specialists: DirectorySpecialist[] = [];
  try {
    const providers = await publicProvidersApi.list();
    specialists = providers.slice(0, 8).map(mapPublicProvider);
  } catch {
    specialists = [];
  }

  return (
    <section id="specialists" className="scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="آشنایی با متخصصان"
          title="قبل از انتخاب، پروفایل‌ها را ببینید"
          description="زمینه‌ی کاری، امتیازها و اطلاعات هر متخصص را بررسی کنید و بعد تصمیم بگیرید."
          action={
            <Link
              href="/specialists"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              مشاهده همه‌ی متخصصان
              <ArrowLeft size={16} />
            </Link>
          }
        />

        <div className="mt-8">
          {specialists.length > 0 ? (
            <SpecialistsCarousel specialists={specialists} />
          ) : (
            <p className="py-8 text-center text-sm text-foreground/55">
              در حال حاضر متخصصی برای نمایش وجود ندارد.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
