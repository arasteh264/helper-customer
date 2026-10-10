"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  CheckCircle2,
  Loader2,
  MapPin,
  SearchCheck,
  ShieldCheck,
  Star,
} from "lucide-react";
import { requestApi, type ProviderMatch } from "../api/request.api";
import { formatNumber } from "@/src/utils/format";

export function SuccessScreen({
  code,
  requestId,
  initialStatus,
  accessToken,
  matches,
  initiallyInvitedProviderId,
  initiallyInvitedProviderName,
}: {
  code: string;
  requestId: string;
  initialStatus: string;
  accessToken: string;
  matches: ProviderMatch[];
  initiallyInvitedProviderId?: string;
  initiallyInvitedProviderName?: string;
}) {
  const [invitedProviderId, setInvitedProviderId] = useState<string>();
  const [status, setStatus] = useState(initialStatus);
  const [adminReviewNote, setAdminReviewNote] = useState<string | null>(null);
  const [liveMatches, setLiveMatches] = useState(matches);
  const [isSearching, setIsSearching] = useState(true);
  const attemptedPreferredInvite = useRef(false);
  const pollInProgress = useRef(false);
  const pollErrorShown = useRef(false);

  const invite = useCallback(
    async (provider: Pick<ProviderMatch, "id" | "name">) => {
      try {
        await requestApi.inviteProvider(requestId, provider.id, accessToken);
        setInvitedProviderId(provider.id);
        toast.success(`درخواست همکاری برای ${provider.name} ارسال شد`);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "ارسال درخواست به متخصص انجام نشد. دوباره تلاش کنید.",
        );
      }
    },
    [accessToken, requestId],
  );

  useEffect(() => {
    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      if (cancelled || pollInProgress.current) return;
      pollInProgress.current = true;
      attempts += 1;
      try {
        const request = await requestApi.getMyRequest(requestId, accessToken);
        pollErrorShown.current = false;
        if (cancelled) return;
        setStatus(request.status);
        setAdminReviewNote(request.adminReviewNote ?? null);
        if (request.status === "awaiting_offers") {
          const refreshedMatches = await requestApi.getMatches(
            requestId,
            accessToken,
          );
          if (cancelled) return;
          setLiveMatches(refreshedMatches);
          if (refreshedMatches.length > 0 || attempts >= 24) {
            setIsSearching(false);
          }
        } else if (request.status !== "awaiting_admin_review") {
          setIsSearching(false);
        }
        if (attempts >= 24) setIsSearching(false);
      } catch (error) {
        if (attempts >= 3 && !cancelled && !pollErrorShown.current) {
          pollErrorShown.current = true;
          toast.error(
            error instanceof Error
              ? error.message
              : "به‌روزرسانی وضعیت درخواست انجام نشد.",
          );
        }
        if (attempts >= 24 && !cancelled) setIsSearching(false);
      } finally {
        pollInProgress.current = false;
      }
    };

    void poll();
    const interval = window.setInterval(() => void poll(), 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [accessToken, requestId]);

  useEffect(() => {
    if (
      status !== "awaiting_offers" ||
      attemptedPreferredInvite.current ||
      !initiallyInvitedProviderId
    ) {
      return;
    }

    attemptedPreferredInvite.current = true;
    window.setTimeout(
      () =>
        void invite({
          id: initiallyInvitedProviderId,
          name: initiallyInvitedProviderName ?? "متخصص",
        }),
      0,
    );
  }, [
    initiallyInvitedProviderId,
    initiallyInvitedProviderName,
    invite,
    status,
  ]);

  return (
    <div className="mx-auto max-w-3xl px-1 py-5">
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600/10 text-green-600">
          <CheckCircle2 size={32} />
        </span>
        <h2 className="mt-5 text-xl font-bold text-foreground">
          درخواست شما ثبت شد
        </h2>
        <p className="mt-2 text-sm leading-7 text-foreground/60">
          کد پیگیری{" "}
          <span className="font-semibold text-foreground">{code}</span> است.
          درخواست برای متخصصان مرتبط ارسال شده است؛ پیشنهادهای قیمت را در صفحه‌ی
          پیگیری مقایسه و متخصص موردنظرتان را انتخاب کنید.
        </p>
      </div>

      {status === "awaiting_admin_review" ? (
        <div className="mt-7 overflow-hidden rounded-3xl border border-primary/15 bg-card p-6 text-center shadow-sm sm:p-9">
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-primary/[0.07]">
            <span className="absolute inset-0 animate-ping rounded-full border border-primary/20" />
            <ShieldCheck
              size={38}
              className="relative text-primary"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">
            درخواست شما در حال بررسی است
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-foreground/60">
            تیم هلپر اطلاعات درخواست را بررسی می‌کند. پس از تأیید، درخواست برای
            متخصصان مرتبط ارسال می‌شود و همین صفحه به‌روز خواهد شد.
          </p>
          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-primary/[0.06] px-4 py-2 text-xs text-primary">
            <Loader2 size={14} className="animate-spin" />
            بررسی خودکار وضعیت
          </div>
        </div>
      ) : status === "cancelled" ? (
        <div
          className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5 text-center"
          role="status"
        >
          <p className="font-semibold text-foreground">
            {adminReviewNote
              ? "درخواست پس از بررسی تأیید نشد"
              : "این درخواست لغو شده است"}
          </p>
          {adminReviewNote ? (
            <p className="mt-2 text-sm leading-6 text-foreground/65">
              دلیل: {adminReviewNote}
            </p>
          ) : null}
          <Link
            href={`/customer/requests/${requestId}`}
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            مشاهده‌ی جزئیات و پیگیری
          </Link>
        </div>
      ) : invitedProviderId ? (
        <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 text-center">
          <p className="font-semibold text-foreground">
            درخواست شما برای این متخصص ارسال شد
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            پس از ثبت پیشنهاد قیمت، می‌توانید مبلغ و توضیحات متخصصان را مقایسه
            و از صفحه‌ی پیگیری یکی را برای هماهنگی انتخاب کنید.
          </p>
        </div>
      ) : liveMatches.length ? (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground">
              درخواست برای این متخصصان ارسال شد
            </h3>
            <span className="text-xs text-foreground/50">
              مرتب‌شده بر اساس فاصله و امتیاز
            </span>
          </div>
          <ul className="space-y-3">
            {liveMatches.map((provider) => (
              <li
                key={provider.id}
                className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <Link
                    href={`/specialists/${encodeURIComponent(provider.id)}`}
                    aria-label={`مشاهده‌ی پروفایل ${provider.name}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {provider.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={provider.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      provider.name.charAt(0)
                    )}
                  </Link>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/specialists/${encodeURIComponent(provider.id)}`}
                        className="font-semibold text-foreground hover:text-primary hover:underline"
                      >
                        {provider.name}
                      </Link>
                      {provider.verified && (
                        <BadgeCheck size={15} className="text-primary" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-foreground/55">
                      {provider.skills.join("، ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-foreground/55">
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={13}
                          className="fill-amber-500 text-amber-500"
                        />
                        {formatNumber(provider.rating)}
                      </span>
                      {provider.distanceKm !== null && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={13} />
                          {formatNumber(provider.distanceKm)} کیلومتر
                        </span>
                      )}
                      {provider.distanceKm === null && (
                        <span>موقعیت متخصص ثبت نشده</span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-foreground/60">
            متخصصان پس از بررسی جزئیات، پیشنهاد قیمت می‌فرستند. برای مقایسه و
            انتخاب متخصص و شروع گفت‌وگو، به صفحه‌ی پیگیری بروید.
          </p>
        </div>
      ) : isSearching ? (
        <div className="mt-7 overflow-hidden rounded-3xl border border-primary/15 bg-card p-6 text-center shadow-sm sm:p-9">
          <div className="relative mx-auto flex size-24 items-center justify-center rounded-full bg-primary/[0.07]">
            <span className="absolute inset-0 animate-ping rounded-full border border-primary/20" />
            <SearchCheck
              size={38}
              className="relative animate-pulse text-primary"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-5 text-lg font-bold text-foreground">
            داریم متخصص مناسب شما را پیدا می‌کنیم
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-foreground/60">
            متخصصان فعال را بر اساس تخصص و فاصله بررسی می‌کنیم. این صفحه به‌صورت
            خودکار به‌روز می‌شود؛ لازم نیست آن را ببندید.
          </p>
          <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-primary/[0.06] px-4 py-2 text-xs text-primary">
            <Loader2 size={14} className="animate-spin" />
            در حال جست‌وجو…
          </div>
        </div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-foreground/15 px-5 py-8 text-center">
          <p className="text-sm text-foreground/65">
            فعلاً متخصص فعالی با این تخصص و محدوده پیدا نشد.
          </p>
          <Link
            href="/specialists"
            className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
          >
            جست‌وجوی همه‌ی متخصصان
          </Link>
        </div>
      )}

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={`/customer/requests/${requestId}`}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
        >
          پیگیری درخواست
        </Link>
        <Link
          href="/customer/requests"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-foreground/15 px-5 text-sm font-medium text-foreground/75"
        >
          درخواست‌های من
        </Link>
      </div>
    </div>
  );
}
