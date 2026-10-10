"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BadgeCheck, LoaderCircle, MapPin, SearchCheck, Star } from "lucide-react";
import { toast } from "sonner";

import {
  requestApi,
  type ProviderMatch,
  type ServiceRequestQuote,
} from "@/src/features/request/api/request.api";
import type { RequestStatus } from "../types/customer.types";
import { formatMoney, formatNumber } from "@/src/utils/format";

export function RequestDiscoveryPanel({
  requestId,
  accessToken,
  initialStatus,
  initialAdminReviewNote,
}: {
  requestId: string;
  accessToken: string;
  initialStatus: RequestStatus;
  initialAdminReviewNote?: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [adminReviewNote, setAdminReviewNote] = useState(
    initialAdminReviewNote ?? null,
  );
  const [matches, setMatches] = useState<ProviderMatch[]>([]);
  const [offers, setOffers] = useState<ServiceRequestQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const polling = useRef(false);
  const errorShown = useRef(false);

  const refresh = useCallback(async () => {
    if (["cancelled", "completed", "disputed"].includes(status)) return;
    if (polling.current) return;
    polling.current = true;
    try {
      const request = await requestApi.getMyRequest(requestId, accessToken);
      setStatus(request.status);
      setAdminReviewNote(request.adminReviewNote ?? null);
      if (request.status === "awaiting_offers") {
        const [providers, quotes] = await Promise.all([
          requestApi.getMatches(requestId, accessToken),
          requestApi.getOffers(requestId, accessToken),
        ]);
        setMatches(providers);
        setOffers(quotes);
      }
      setLoading(false);
      errorShown.current = false;
    } catch (error) {
      if (!errorShown.current) {
        toast.error(
          error instanceof Error
            ? error.message
            : "به‌روزرسانی متخصصان پیشنهادی انجام نشد.",
        );
        errorShown.current = true;
      }
    } finally {
      polling.current = false;
    }
  }, [accessToken, requestId, status]);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 7000);
    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const selectOffer = async (offer: ServiceRequestQuote) => {
    setSelectingId(offer.providerProfileId);
    try {
      await requestApi.selectOffer(
        requestId,
        offer.providerProfileId,
        accessToken,
      );
      setStatus("awaiting_payment");
      toast.success(
        `پیشنهاد ${offer.name} انتخاب شد؛ گفت‌وگو برای هماهنگی فعال شد`,
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "انتخاب پیشنهاد انجام نشد؛ دوباره تلاش کنید.",
      );
    } finally {
      setSelectingId(null);
    }
  };

  if (status === "awaiting_admin_review") {
    return (
      <div className="rounded-2xl border border-primary/15 bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LoaderCircle size={21} className="animate-spin" />
          </span>
          <div>
            <h3 className="font-semibold text-foreground">
              درخواست در انتظار بررسی هلپر است
            </h3>
            <p className="mt-1 text-sm leading-6 text-foreground/60">
              پس از بررسی، درخواست برای متخصصان مرتبط ارسال می‌شود و این بخش به
              شکل خودکار به‌روز خواهد شد.
            </p>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-primary/80">
          <LoaderCircle size={13} className="animate-spin" />
          بررسی خودکار وضعیت
        </p>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
        <h3 className="font-semibold text-foreground">
          {adminReviewNote
            ? "درخواست پس از بررسی تأیید نشد"
            : "این درخواست لغو شده است"}
        </h3>
        {adminReviewNote ? (
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            دلیل: {adminReviewNote}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-foreground/65">
            برای اطلاعات بیشتر با پشتیبانی هلپر در تماس باشید.
          </p>
        )}
      </div>
    );
  }

  if (status !== "awaiting_offers") {
    return (
      <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-5">
        <h3 className="font-semibold text-foreground">
          پیشنهاد متخصص انتخاب شد
        </h3>
        <p className="mt-2 text-sm leading-6 text-foreground/60">
          گفت‌وگو برای هماهنگی فعال است. برای ادامه، صفحه را تازه‌سازی کنید.
        </p>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          به‌روزرسانی صفحه
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-primary/15 bg-card p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchCheck size={26} className="animate-pulse" />
        </span>
        <h3 className="mt-4 font-semibold text-foreground">
          در حال جست‌وجوی متخصصان مناسب
        </h3>
        <p className="mt-2 text-sm text-foreground/55">
          فهرست بر اساس تخصص و محدوده‌ی خدمت‌رسانی بررسی می‌شود.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-foreground">
          پیشنهادهای قیمت متخصصان
        </h3>
        <span className="flex items-center gap-1.5 text-xs text-foreground/45">
          <LoaderCircle size={13} className="animate-spin" />
          به‌روزرسانی خودکار
        </span>
      </div>
      {offers.length > 0 ? (
        <ul className="space-y-3">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className="rounded-2xl border border-foreground/10 bg-card p-4"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <Link
                    href={`/specialists/${encodeURIComponent(offer.providerProfileId)}`}
                    aria-label={`مشاهده‌ی پروفایل ${offer.name}`}
                    className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {offer.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={offer.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      offer.name.charAt(0)
                    )}
                  </Link>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/specialists/${encodeURIComponent(offer.providerProfileId)}`}
                        className="font-semibold text-foreground hover:text-primary hover:underline"
                      >
                        {offer.name}
                      </Link>
                      {offer.verified ? (
                        <BadgeCheck size={15} className="text-primary" />
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/55">
                      {offer.field}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-foreground/55">
                      <span className="inline-flex items-center gap-1">
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        {formatNumber(offer.rating)} (
                        {formatNumber(offer.reviews)} نظر)
                      </span>
                      {offer.distanceKm !== null ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {formatNumber(offer.distanceKm)} کیلومتر
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <p className="shrink-0 text-lg font-bold text-primary">
                  {formatMoney(offer.proposedPriceToman)}
                </p>
              </div>
              <p className="mt-4 rounded-xl bg-muted/40 p-3 text-sm leading-6 text-foreground/70">
                {offer.quoteNote}
              </p>
              {offer.estimatedHours ? (
                <p className="mt-2 text-xs text-foreground/50">
                  زمان تخمینی: {formatNumber(offer.estimatedHours)} ساعت
                </p>
              ) : null}
              <button
                type="button"
                disabled={selectingId !== null}
                onClick={() => void selectOffer(offer)}
                className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {selectingId === offer.providerProfileId ? (
                  <LoaderCircle size={15} className="animate-spin" />
                ) : null}
                انتخاب این پیشنهاد و درخواست هماهنگی
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-card px-5 py-8 text-center">
          <p className="text-sm text-foreground/65">
            {matches.length
              ? "درخواست شما برای متخصصان مرتبط ارسال شده است. منتظر پیشنهاد قیمت بمانید؛ پیشنهادها به‌صورت خودکار اینجا نمایش داده می‌شوند."
              : "هنوز متخصصی برای این درخواست پیدا نشده است. جست‌وجو به‌طور خودکار ادامه دارد."}
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            بررسی دوباره
          </button>
        </div>
      )}
    </div>
  );
}
