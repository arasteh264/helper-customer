"use client";

import { useEffect, useState } from "react";
import {
  BookOpenText,
  Check,
  Copy,
  Gift,
  Image as ImageIcon,
  Loader2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/src/components/ui/button";
import { normalizeError } from "@/src/lib/api/error";
import { providerApi } from "../../api/provider.api";
import type {
  ProviderReferralDashboard,
  ProviderReferralRewardType,
} from "../../types/provider.types";

const rewardLabels: Record<ProviderReferralRewardType, string> = {
  STORY_PUBLISHING: "دسترسی انتشار استوری",
  ARTICLE_PUBLISHING: "دسترسی انتشار مقاله",
  ZERO_COMMISSION: "صفرشدن کمیسیون",
};

function verificationLabel(
  status: ProviderReferralDashboard["referrals"][number]["verificationStatus"],
  isVerified: boolean,
  rewardType: ProviderReferralRewardType | null,
) {
  if (rewardType) return `جایزه فعال شد: ${rewardLabels[rewardType]}`;
  if (status === "REJECTED") return "احراز هویت تأیید نشد";
  if (status === "APPROVED" && isVerified) {
    return "تأیید شده؛ در انتظار بررسی جایزه توسط ادمین";
  }
  return "در انتظار تکمیل و تأیید احراز هویت";
}

export function ReferralsDashboard({ accessToken }: { accessToken: string }) {
  const [dashboard, setDashboard] = useState<ProviderReferralDashboard | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [creatingCode, setCreatingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    providerApi
      .getReferralDashboard(accessToken)
      .then((result) => {
        if (mounted) {
          setDashboard(result);
          setError(null);
        }
      })
      .catch((cause: unknown) => {
        console.error("Provider referral dashboard could not be loaded", cause);
        if (mounted) setError(normalizeError(cause).message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const createCode = async () => {
    setCreatingCode(true);
    try {
      const result = await providerApi.createReferralCode(accessToken);
      setDashboard((current) =>
        current ? { ...current, code: result.code } : { code: result.code, referrals: [] },
      );
      toast.success("کد دعوت شما آماده شد");
    } catch (cause) {
      toast.error(
        normalizeError(cause).message || "ساخت کد دعوت انجام نشد.",
      );
    } finally {
      setCreatingCode(false);
    }
  };

  const copyInviteLink = async () => {
    if (!dashboard?.code) return;
    const url = new URL("/register", window.location.origin);
    url.searchParams.set("role", "specialist");
    url.searchParams.set("referralCode", dashboard.code);
    try {
      await navigator.clipboard.writeText(url.toString());
      toast.success("لینک دعوت کپی شد");
    } catch (cause) {
      console.error("Could not copy provider referral link", cause);
      toast.error("کپی لینک ممکن نشد؛ کد را دستی کپی کنید.");
    }
  };

  const copyCode = async () => {
    if (!dashboard?.code) return;
    try {
      await navigator.clipboard.writeText(dashboard.code);
      toast.success("کد معرف کپی شد");
    } catch (cause) {
      console.error("Could not copy provider referral code", cause);
      toast.error("کپی کد ممکن نشد.");
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-card p-4 shadow-sm sm:rounded-3xl sm:p-7">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Gift size={21} aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-lg font-black text-foreground sm:text-2xl">
              دعوت از متخصصان
            </h1>
            <p className="mt-1 text-sm leading-6 text-foreground/60">
              کدتان را بفرستید. پس از تکمیل پروفایل و تأیید مدارک متخصص دعوت‌شده،
              ادمین یک جایزه را برای شما فعال می‌کند.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-foreground/[0.08] bg-background/85 p-4 sm:mt-6 sm:p-5">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-foreground/55">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              در حال دریافت اطلاعات دعوت…
            </p>
          ) : error ? (
            <p className="text-sm text-destructive" role="alert">
              دریافت اطلاعات دعوت انجام نشد: {error}
            </p>
          ) : dashboard?.code ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-foreground/50">
                  کد معرف شما
                </p>
                <p
                  className="mt-1 font-mono text-2xl font-black tracking-[0.18em] text-primary"
                  dir="ltr"
                >
                  {dashboard.code}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyCode}
                  className="h-11"
                >
                  <Copy size={16} aria-hidden="true" />
                  کپی کد
                </Button>
                <Button
                  type="button"
                  onClick={copyInviteLink}
                  className="h-11"
                >
                  <Copy size={16} aria-hidden="true" />
                  کپی لینک دعوت
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-foreground/65">
                برای دعوت، یک کد اختصاصی بسازید و لینک ثبت‌نام را بفرستید.
              </p>
              <Button
                type="button"
                onClick={createCode}
                disabled={creatingCode}
                className="h-11 w-full shrink-0 sm:w-auto"
              >
                {creatingCode ? (
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                ) : (
                  <Gift size={16} aria-hidden="true" />
                )}
                دریافت کد دعوت
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-bold text-foreground">
          جایزه‌های قابل انتخاب توسط ادمین
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ImageIcon,
              title: "انتشار استوری",
              detail: "فعال‌شدن دسترسی انتشار استوری",
            },
            {
              icon: BookOpenText,
              title: "انتشار مقاله",
              detail: "فعال‌شدن دسترسی انتشار مقاله",
            },
            {
              icon: Check,
              title: "کمیسیون صفر",
              detail: "حذف کمیسیون از درآمد کارهای شما",
            },
          ].map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-2xl border border-foreground/[0.08] bg-card p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={17} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-foreground/55">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-primary" aria-hidden="true" />
          <h2 className="text-base font-bold text-foreground">
            دعوت‌های من
          </h2>
          {dashboard?.referrals.length ? (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-foreground/60">
              {new Intl.NumberFormat("fa-IR").format(
                dashboard.referrals.length,
              )}
            </span>
          ) : null}
        </div>

        {dashboard?.referrals.length ? (
          <ul className="space-y-2">
            {dashboard.referrals.map((referral) => (
              <li
                key={referral.id}
                className="flex flex-col gap-2 rounded-2xl border border-foreground/[0.08] bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {referral.providerName}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-foreground/55">
                    {verificationLabel(
                      referral.verificationStatus,
                      referral.isVerified,
                      referral.rewardType,
                    )}
                  </p>
                </div>
                <time
                  dateTime={referral.createdAt}
                  className="shrink-0 text-xs text-foreground/40"
                >
                  {new Intl.DateTimeFormat("fa-IR", {
                    dateStyle: "medium",
                  }).format(new Date(referral.createdAt))}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-foreground/15 bg-card px-4 py-8 text-center">
            <Users
              size={22}
              className="mx-auto text-foreground/35"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm font-semibold text-foreground/65">
              هنوز متخصصی را دعوت نکرده‌اید.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
