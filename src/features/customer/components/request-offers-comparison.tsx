"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  LoaderCircle,
  Star,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/src/components/shared/section-card";
import {
  requestApi,
  type ServiceRequestQuote,
} from "@/src/features/request/api/request.api";
import { formatDateTime, formatMoney, formatNumber } from "@/src/utils/format";

const SUPPLY_MODE_LABEL: Record<
  ServiceRequestQuote["items"][number]["supplyMode"],
  string
> = {
  CUSTOMER: "تهیه با مشتری",
  PROVIDER_SEPARATE: "تهیه با متخصص، هزینه جداگانه",
  PROVIDER_INCLUDED: "تهیه با متخصص، در مبلغ پیشنهاد",
};

export function RequestOffersComparison({
  requestId,
  accessToken,
  scheduledAt,
}: {
  requestId: string;
  accessToken: string;
  scheduledAt?: string;
}) {
  const router = useRouter();
  const [offers, setOffers] = useState<ServiceRequestQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const fetchOffers = useCallback(() => {
    return requestApi.getOffers(requestId, accessToken);
  }, [accessToken, requestId]);

  useEffect(() => {
    let active = true;
    void fetchOffers()
      .then((results) => {
        if (active) setOffers(results);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchOffers]);

  const retryOffers = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setOffers(await fetchOffers());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const selectOffer = async (offer: ServiceRequestQuote) => {
    if (selectingId) return;
    setSelectingId(offer.id);
    try {
      await requestApi.selectOffer(
        requestId,
        offer.providerProfileId,
        accessToken,
      );
      toast.success("متخصص انتخاب شد؛ برای شروع کار پرداخت را انجام دهید.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "انتخاب متخصص انجام نشد.",
      );
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <SectionCard
      title="مقایسه‌ی پیشنهاد متخصصان"
      description="هزینه، ریز اقلام، زمان تخمینی و امتیاز را کنار هم ببینید."
    >
      {loading ? (
        <div
          className="flex items-center justify-center gap-2 py-8 text-sm text-foreground/55"
          role="status"
        >
          <LoaderCircle size={18} className="animate-spin" />
          در حال دریافت پیشنهادها...
        </div>
      ) : loadError ? (
        <div
          className="flex flex-col items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/[0.04] p-4 text-sm"
          role="alert"
        >
          <p>دریافت پیشنهادها از سرور انجام نشد.</p>
          <button
            type="button"
            onClick={() => void retryOffers()}
            className="font-medium text-primary underline underline-offset-4"
          >
            تلاش دوباره
          </button>
        </div>
      ) : offers.length === 0 ? (
        <p className="rounded-xl bg-foreground/[0.04] px-4 py-6 text-center text-sm leading-6 text-foreground/60">
          هنوز پیشنهادی برای این درخواست ثبت نشده است. پس از دریافت پیشنهاد،
          همین‌جا امکان مقایسه و انتخاب دارید.
        </p>
      ) : (
        <>
          <p className="mb-4 rounded-lg bg-foreground/[0.04] px-3 py-2 text-xs leading-5 text-foreground/65">
            {scheduledAt
              ? `زمان مدنظر شما: ${formatDateTime(scheduledAt)} · زمان شروع پیشنهادی متخصص در اطلاعات ثبت‌شده موجود نیست؛ پیش از انتخاب نهایی آن را هماهنگ کنید.`
              : "زمان شروع در پیشنهادها ثبت نشده است؛ آن را پیش از انتخاب نهایی با متخصص هماهنگ کنید."}
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="min-w-0 rounded-2xl border border-foreground/10 bg-background p-4 sm:p-5"
              >
                <header className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                      {offer.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={offer.avatarUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <UserRound size={22} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">
                        {offer.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-foreground/55">
                        {offer.field}
                      </p>
                    </div>
                  </div>
                  {offer.verified ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                      <BadgeCheck size={14} />
                      تأییدشده
                    </span>
                  ) : null}
                </header>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-primary/[0.05] p-3">
                    <p className="text-[11px] text-foreground/55">
                      مبلغ کل پیشنهاد
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatMoney(offer.proposedPriceToman)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-foreground/[0.04] p-3">
                    <p className="text-[11px] text-foreground/55">
                      امتیاز و نظرها
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
                      <Star
                        size={14}
                        className="fill-amber-500 text-amber-500"
                      />
                      {formatNumber(offer.rating)}
                      <span className="font-normal text-foreground/50">
                        ({formatNumber(offer.reviews)} نظر)
                      </span>
                    </p>
                  </div>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-foreground/55">دستمزد</dt>
                    <dd className="font-medium text-foreground">
                      {formatMoney(offer.laborPriceToman)}
                    </dd>
                  </div>
                  {offer.estimatedHours != null ? (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="inline-flex items-center gap-1.5 text-foreground/55">
                        <Clock3 size={14} />
                        زمان تخمینی انجام
                      </dt>
                      <dd className="font-medium text-foreground">
                        {formatNumber(offer.estimatedHours)} ساعت
                      </dd>
                    </div>
                  ) : null}
                </dl>

                {offer.items.length > 0 ? (
                  <div className="mt-4 border-t border-foreground/10 pt-3">
                    <h4 className="text-xs font-semibold text-foreground">
                      ریز هزینه‌ها و اقلام
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {offer.items.map((item, index) => (
                        <li
                          key={`${offer.id}-${index}`}
                          className="flex items-start justify-between gap-3 text-xs"
                        >
                          <span className="min-w-0 text-foreground/70">
                            {item.name}
                            <span className="mt-0.5 block text-[10px] text-foreground/45">
                              {SUPPLY_MODE_LABEL[item.supplyMode]}
                            </span>
                          </span>
                          <span className="shrink-0 font-medium text-foreground">
                            {formatMoney(item.amountToman)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {offer.quoteNote ? (
                  <div className="mt-4 rounded-lg bg-foreground/[0.04] p-3">
                    <h4 className="text-xs font-semibold text-foreground">
                      شرح محدوده‌ی کار
                    </h4>
                    <p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-foreground/65">
                      {offer.quoteNote}
                    </p>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => void selectOffer(offer)}
                  disabled={selectingId !== null}
                  className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {selectingId === offer.id ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : null}
                  انتخاب این متخصص
                </button>
              </article>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}
