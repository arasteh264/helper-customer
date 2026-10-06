import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  Check,
  Clock3,
  Users,
} from "lucide-react";

import { formatNumber } from "@/src/utils/format";
import type { DirectorySpecialist } from "../types/catalog.types";
import type { CatalogCategory } from "../utils/category-mapping";
import { SpecialistCard } from "@/src/features/home/components/specialist-card";
import { CategorySvgIcon } from "@/src/features/catalog/components/category-svg-icon";
import type { Specialty } from "@/src/features/request/types/specialty.types";

const fa = new Intl.NumberFormat("fa-IR");

function pricingDescription(specialty: Specialty) {
  if (
    specialty.pricingMode === "HOURLY" &&
    specialty.hourlyRateToman !== null &&
    specialty.hourlyRateToman !== undefined
  ) {
    const unit = specialty.hourlyUnitLabel
      ? `برای هر ${specialty.hourlyUnitLabel}`
      : "در ساعت";
    return `از ${formatNumber(specialty.hourlyRateToman)} تومان ${unit}`;
  }

  if (specialty.pricingMode === "QUOTE") {
    return "هزینه پس از بررسی جزئیات درخواست اعلام می‌شود";
  }

  return "هزینه پیش از شروع کار با متخصص هماهنگ می‌شود";
}

export function CategoryPage({
  category,
  specialties,
  specialists,
}: {
  category: CatalogCategory;
  specialties: Specialty[];
  specialists: DirectorySpecialist[];
}) {
  const { label, imageUrl, tint, svgKey } = category;

  return (
    <div className="space-y-14 pb-8">
      <Link
        href="/services"
        className="inline-flex items-center gap-1 text-sm text-foreground/55 transition-colors hover:text-primary"
      >
        <ArrowRight size={16} aria-hidden />
        همه‌ی دسته‌بندی‌ها
      </Link>

      <section className="grid items-center gap-8 border-b border-foreground/10 pb-10 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            راهنمای خدمات
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            خدمات {label}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-foreground/65 sm:text-base">
            برای انتخاب دقیق‌تر، زیرخدمت مرتبط با نیازتان را از فهرست زیر پیدا
            کنید. تعداد متخصص‌های فعال و شیوه‌ی قیمت‌گذاری هر خدمت هم کنار آن
            آمده است. اگر هنوز مطمئن نیستید، درخواستتان را ثبت کنید و جزئیات را
            برای متخصص‌ها توضیح دهید.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#specialties"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              انتخاب خدمت
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="#specialists"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-foreground/15 px-4 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              دیدن متخصص‌ها
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>

        <div
          className={`mx-auto flex h-40 w-40 items-center justify-center rounded-2xl text-primary sm:h-48 sm:w-48 ${tint}`}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={label}
              width={176}
              height={176}
              priority
              className="h-36 w-36 object-contain sm:h-44 sm:w-44"
            />
          ) : (
            <CategorySvgIcon slug={svgKey} className="h-28 w-28 sm:h-32 sm:w-32" />
          )}
        </div>
      </section>

      <dl className="flex flex-wrap gap-x-10 gap-y-5 border-b border-foreground/10 pb-8">
        <div>
          <dt className="text-xs text-foreground/50">خدمات این گروه</dt>
          <dd className="mt-1 text-lg font-bold text-foreground">
            {fa.format(specialties.length)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-foreground/50">متخصص‌های مرتبط</dt>
          <dd className="mt-1 text-lg font-bold text-foreground">
            {fa.format(specialists.length)}
          </dd>
        </div>
      </dl>

      <section id="specialties" className="scroll-mt-24">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              کدام خدمت را نیاز دارید؟
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/55">
              برای هر خدمت، تعداد متخصص فعال و اطلاعات قیمت موجود را ببینید.
            </p>
          </div>
          <span className="text-xs text-foreground/45">
            {fa.format(specialties.length)} خدمت
          </span>
        </div>

        {specialties.length === 0 ? (
          <p className="rounded-lg border border-dashed border-foreground/20 px-5 py-8 text-center text-sm leading-7 text-foreground/55">
            فهرست خدمات این گروه فعلاً در دسترس نیست. می‌توانید درخواستتان را
            ثبت کنید و نیاز خود را توضیح دهید.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {specialties.map((specialty) => (
              <li
                key={specialty.id}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-card transition-colors hover:border-primary/30"
              >
                {specialty.icon ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-primary/5">
                    <Image
                      src={specialty.icon}
                      alt={specialty.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="flex items-start gap-3 p-4">
                  {!specialty.icon ? (
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Check size={16} />
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{specialty.name}</h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-foreground/55">
                      <Users size={13} />
                      {specialty.activeProvidersCount > 0
                        ? `${fa.format(specialty.activeProvidersCount)} متخصص فعال`
                        : "هنوز متخصص فعالی ثبت نشده"}
                    </p>
                    <p className="mt-2 inline-flex items-start gap-1.5 text-xs leading-6 text-foreground/50">
                      {specialty.pricingMode === "HOURLY" ? (
                        <Clock3 size={13} className="mt-0.5 shrink-0" />
                      ) : null}
                      {pricingDescription(specialty)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 flex flex-col items-start justify-between gap-3 rounded-lg bg-primary/5 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm leading-7 text-foreground/70">
            خدمت مناسب را پیدا کردید؟ در فرم درخواست، همان تخصص را انتخاب کنید و
            جزئیات کار را بنویسید.
          </p>
          <Link
            href="/request"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            ثبت درخواست
            <ArrowUpLeft size={16} />
          </Link>
        </div>
      </section>

      <section className="border-y border-foreground/10 py-8">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          ثبت درخواست در سه قدم
        </h2>
        <ol className="mt-5 grid gap-5 sm:grid-cols-3">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              ۱
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                تخصص را انتخاب کنید
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                نزدیک‌ترین گزینه به کاری را که نیاز دارید انتخاب کنید.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              ۲
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                جزئیات را بنویسید
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                شرح کار، زمان مناسب و آدرس را وارد کنید؛ عکس هم به بررسی بهتر
                کمک می‌کند.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              ۳
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                پیشنهادها را مقایسه کنید
              </h3>
              <p className="mt-1 text-sm leading-6 text-foreground/55">
                پروفایل، امتیاز و پیشنهاد متخصص‌های مرتبط را بررسی کنید و بعد
                تصمیم بگیرید.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section id="specialists" className="scroll-mt-24">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground sm:text-2xl">
              متخصص‌های {label}
            </h2>
            <p className="mt-2 text-sm leading-7 text-foreground/55">
              پروفایل‌ها را ببینید و بر اساس تخصص و امتیاز، گزینه‌ی مناسب را
              انتخاب کنید.
            </p>
          </div>
          <span className="text-xs text-foreground/45">
            {fa.format(specialists.length)} متخصص
          </span>
        </div>

        {specialists.length === 0 ? (
          <div className="rounded-lg border border-dashed border-foreground/20 px-5 py-8 text-center">
            <p className="text-sm leading-7 text-foreground/60">
              در حال حاضر متخصصی برای نمایش در این گروه پیدا نشد. می‌توانید
              درخواستتان را ثبت کنید تا تخصص موردنیازتان را مشخص کنید.
            </p>
            <Link
              href="/request"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              شروع ثبت درخواست
              <ArrowUpLeft size={16} />
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((specialist) => (
              <li key={specialist.id}>
                <SpecialistCard specialist={specialist} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="max-w-3xl space-y-4">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          پیش از ثبت درخواست
        </h2>
        <details className="group rounded-lg border border-foreground/10 bg-card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            چه اطلاعاتی به دریافت پیشنهاد دقیق‌تر کمک می‌کند؟
          </summary>
          <p className="mt-3 text-sm leading-7 text-foreground/60">
            نوع کار، محل انجام، زمان دلخواه و هر نکته‌ای که روی اجرا اثر دارد را
            بنویسید. اگر تصویر مرتبط دارید، آن را هم به درخواست اضافه کنید.
          </p>
        </details>
        <details className="group rounded-lg border border-foreground/10 bg-card p-4">
          <summary className="cursor-pointer text-sm font-semibold text-foreground">
            هزینه‌ی خدمت چطور مشخص می‌شود؟
          </summary>
          <p className="mt-3 text-sm leading-7 text-foreground/60">
            اگر برای خدمتی نرخ ساعتی ثبت شده باشد، همان‌جا نمایش داده می‌شود؛ در
            سایر موارد، هزینه پس از بررسی جزئیات و پیشنهاد متخصص مشخص خواهد شد.
          </p>
        </details>
      </section>
    </div>
  );
}
