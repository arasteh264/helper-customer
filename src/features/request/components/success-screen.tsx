"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, CheckCircle2, Loader2, MapPin, Star } from "lucide-react";
import { requestApi, type ProviderMatch } from "../api/request.api";
import { formatNumber } from "@/src/utils/format";

export function SuccessScreen({
  code,
  requestId,
  accessToken,
  matches,
  initiallyInvitedProviderId,
}: {
  code: string;
  requestId: string;
  accessToken: string;
  matches: ProviderMatch[];
  initiallyInvitedProviderId?: string;
}) {
  const [invitedProviderId, setInvitedProviderId] = useState<string>();
  const [sendingId, setSendingId] = useState<string | null>(null);
  const attemptedPreferredInvite = useRef(false);

  const invite = async (provider: ProviderMatch) => {
    setSendingId(provider.id);
    try {
      await requestApi.inviteProvider(requestId, provider.id, accessToken);
      setInvitedProviderId(provider.id);
      toast.success(`درخواست همکاری برای ${provider.name} ارسال شد`);
    } catch {
      toast.error("ارسال درخواست به متخصص انجام نشد. دوباره تلاش کنید.");
    } finally {
      setSendingId(null);
    }
  };

  useEffect(() => {
    if (attemptedPreferredInvite.current || !initiallyInvitedProviderId) return;
    const preferred = matches.find(
      (provider) => provider.id === initiallyInvitedProviderId,
    );
    if (!preferred) return;
    attemptedPreferredInvite.current = true;
    void invite(preferred);
  }, [initiallyInvitedProviderId, matches]);

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
          متخصصان بر اساس تخصص و نزدیکی مرتب شده‌اند؛ یکی را برای هماهنگی انتخاب
          کنید.
        </p>
      </div>

      {invitedProviderId ? (
        <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/[0.05] p-5 text-center">
          <p className="font-semibold text-foreground">
            درخواست همکاری ارسال شد
          </p>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            پس از تأیید متخصص، شماره تماس و راه هماهنگی در صفحه‌ی پیگیری نمایش
            داده می‌شود.
          </p>
        </div>
      ) : matches.length ? (
        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground">متخصصان مناسب</h3>
            <span className="text-xs text-foreground/50">
              مرتب‌شده بر اساس فاصله و امتیاز
            </span>
          </div>
          <ul className="space-y-3">
            {matches.map((provider) => (
              <li
                key={provider.id}
                className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {provider.name.charAt(0)}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {provider.name}
                      </p>
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
                <button
                  type="button"
                  disabled={sendingId !== null}
                  onClick={() => invite(provider)}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  {sendingId === provider.id && (
                    <Loader2 size={15} className="animate-spin" />
                  )}
                  درخواست هماهنگی
                </button>
              </li>
            ))}
          </ul>
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
