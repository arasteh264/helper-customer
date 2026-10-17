"use client";

import { useEffect, useState } from "react";
import { Gift, Loader2, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { normalizeError } from "@/src/lib/api/error";
import { adminReferralsApi, type AdminProviderReferral } from "../../api/admin-referrals.api";
import type { ProviderReferralRewardType } from "../../types/provider.types";

const rewardOptions: {
  value: ProviderReferralRewardType;
  label: string;
}[] = [
  { value: "STORY_PUBLISHING", label: "فعال‌سازی انتشار استوری" },
  { value: "ARTICLE_PUBLISHING", label: "فعال‌سازی انتشار مقاله" },
  { value: "ZERO_COMMISSION", label: "صفرکردن کمیسیون متخصص دعوت‌کننده" },
];

const rewardLabels = Object.fromEntries(
  rewardOptions.map(({ value, label }) => [value, label]),
) as Record<ProviderReferralRewardType, string>;

export function AdminReferralsPanel({ accessToken }: { accessToken: string }) {
  const [referrals, setReferrals] = useState<AdminProviderReferral[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<
    Record<string, ProviderReferralRewardType>
  >({});
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [savingReferral, setSavingReferral] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    adminReferralsApi
      .list(accessToken)
      .then((items) => {
        if (mounted) {
          setReferrals(items);
          setLoadingError(null);
        }
      })
      .catch((error: unknown) => {
        console.error("Admin referral list could not be loaded", error);
        if (mounted) setLoadingError(normalizeError(error).message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const grantReward = async (referral: AdminProviderReferral) => {
    const rewardType =
      selectedRewards[referral.id] ?? "STORY_PUBLISHING";
    setSavingReferral(referral.id);
    try {
      await adminReferralsApi.grantReward(
        referral.id,
        rewardType,
        accessToken,
      );
      setReferrals((current) =>
        current.map((item) =>
          item.id === referral.id
            ? { ...item, rewardType, rewardedAt: new Date().toISOString() }
            : item,
        ),
      );
      toast.success("جایزه برای متخصص دعوت‌کننده فعال شد");
    } catch (error) {
      toast.error(
        normalizeError(error).message || "فعال‌سازی جایزه انجام نشد.",
      );
    } finally {
      setSavingReferral(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Gift size={21} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-black text-foreground sm:text-2xl">
            مدیریت دعوت متخصصان
          </h1>
          <p className="mt-1 text-sm leading-6 text-foreground/60">
            پس از تأیید کامل متخصص دعوت‌شده، برای هر دعوت یک جایزه انتخاب و فعال کنید.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-foreground/10 bg-card p-5 text-sm text-foreground/55">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          در حال دریافت دعوت‌ها…
        </div>
      ) : loadingError ? (
        <p
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"
        >
          دریافت فهرست دعوت‌ها انجام نشد: {loadingError}
        </p>
      ) : referrals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-card px-4 py-10 text-center">
          <Users
            size={24}
            className="mx-auto text-foreground/40"
            aria-hidden="true"
          />
          <p className="mt-2 text-sm font-semibold text-foreground/65">
            هنوز دعوتی ثبت نشده است.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {referrals.map((referral) => {
            const eligible =
              referral.referred.verificationStatus === "APPROVED" &&
              referral.referred.isVerified;
            const canGrant = eligible && !referral.rewardType;

            return (
              <li
                key={referral.id}
                className="rounded-2xl border border-foreground/10 bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground/45">
                        دعوت‌کننده
                      </p>
                      <p className="mt-1 truncate text-sm font-bold">
                        {referral.referrer.name}
                      </p>
                      <p className="truncate text-xs text-foreground/50">
                        {referral.referrer.email}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-foreground/45">
                        متخصص دعوت‌شده
                      </p>
                      <p className="mt-1 truncate text-sm font-bold">
                        {referral.referred.name}
                      </p>
                      <p className="truncate text-xs text-foreground/50">
                        {referral.referred.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                    <select
                      aria-label={`جایزه برای ${referral.referrer.name}`}
                      value={
                        selectedRewards[referral.id] ?? "STORY_PUBLISHING"
                      }
                      onChange={(event) =>
                        setSelectedRewards((current) => ({
                          ...current,
                          [referral.id]: event.target
                            .value as ProviderReferralRewardType,
                        }))
                      }
                      disabled={!canGrant || savingReferral === referral.id}
                      className="h-11 min-w-0 rounded-lg border border-foreground/15 bg-background px-3 text-sm disabled:opacity-60 sm:min-w-64"
                    >
                      {rewardOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={() => grantReward(referral)}
                      disabled={!canGrant || savingReferral === referral.id}
                      className="h-11"
                    >
                      {savingReferral === referral.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                      ) : null}
                      فعال‌سازی
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-foreground/[0.07] pt-3 text-xs">
                  <span
                    className={
                      eligible
                        ? "font-semibold text-green-700 dark:text-green-300"
                        : "text-amber-700 dark:text-amber-300"
                    }
                  >
                    {eligible
                      ? "پروفایل و مدارک تأیید شده"
                      : referral.referred.verificationStatus === "REJECTED"
                        ? "احراز هویت رد شده"
                        : "در انتظار تأیید کامل احراز هویت"}
                  </span>
                  {referral.rewardType ? (
                    <span className="font-semibold text-primary">
                      {rewardLabels[referral.rewardType]}
                    </span>
                  ) : null}
                  <span className="text-foreground/45" dir="ltr">
                    {referral.referralCode}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
