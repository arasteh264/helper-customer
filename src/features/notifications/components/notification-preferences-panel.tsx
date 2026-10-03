"use client";

import { useState } from "react";
import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SectionCard } from "@/src/components/shared/section-card";
import { Switch } from "@/src/components/shared/switch";
import {
  notificationPreferencesApi,
  notificationQueryKeys,
} from "../api/notification-preferences.api";
import type {
  NotificationChannel,
  NotificationRole,
  NotificationTopic,
  UserNotificationPreferences,
} from "../types/notification-preferences.types";

const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "inApp", label: "داخل هلپر" },
  { id: "sms", label: "پیامک" },
  { id: "email", label: "ایمیل" },
];

const TOPICS: Record<
  NotificationRole,
  { id: NotificationTopic; label: string; description: string }[]
> = {
  CUSTOMER: [
    {
      id: "messages",
      label: "پیام متخصص",
      description: "وقتی متخصص در گفت‌وگوی درخواست پیام می‌دهد",
    },
    {
      id: "workUpdates",
      label: "وضعیت درخواست‌ها",
      description: "پذیرش، شروع یا تکمیل درخواست",
    },
    {
      id: "opportunities",
      label: "پیشنهادهای متخصص‌ها",
      description: "پیشنهاد قیمت یا پذیرش درخواست شما",
    },
    {
      id: "payments",
      label: "پرداخت و کیف پول",
      description: "پرداخت، شارژ یا بازگشت وجه",
    },
    {
      id: "promotions",
      label: "تخفیف‌ها و خبرها",
      description: "پیشنهادهای ویژه‌ی هلپر",
    },
  ],
  PROVIDER: [
    {
      id: "messages",
      label: "پیام مشتری",
      description: "وقتی مشتری در گفت‌وگوی کار پیام می‌دهد",
    },
    {
      id: "workUpdates",
      label: "وضعیت کارها",
      description: "پذیرش پیشنهاد، پرداخت یا تأیید مشتری",
    },
    {
      id: "opportunities",
      label: "درخواست‌های کاری جدید",
      description: "دعوت یا درخواست متناسب با تخصص شما",
    },
    {
      id: "payments",
      label: "درآمد و کیف پول",
      description: "پرداخت، تسویه یا تغییر موجودی",
    },
    {
      id: "promotions",
      label: "خبرهای هلپر",
      description: "اطلاعیه‌ها و پیشنهادهای ویژه",
    },
  ],
};

export function NotificationPreferencesPanel({
  role,
  accessToken,
  initial,
}: {
  role: NotificationRole;
  accessToken: string;
  initial: UserNotificationPreferences | null;
}) {
  const queryClient = useQueryClient();
  const queryKey = notificationQueryKeys.preferences(role);
  const {
    data: preferences,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => notificationPreferencesApi.get(accessToken),
    initialData: initial ?? undefined,
    staleTime: 30_000,
    enabled: Boolean(accessToken),
  });
  const [saved, setSaved] = useState(false);
  const updateMutation = useMutation({
    mutationFn: (next: UserNotificationPreferences) =>
      notificationPreferencesApi.update(next, accessToken),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey });
      const previous =
        queryClient.getQueryData<UserNotificationPreferences>(queryKey);
      queryClient.setQueryData(queryKey, next);
      setSaved(false);
      return { previous };
    },
    onError: (_error, _next, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKey, context.previous);
      setSaved(false);
      toast.error("ذخیره‌ی تنظیمات اعلان ناموفق بود.");
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      setSaved(true);
    },
  });

  const updatePreference = (
    topic: NotificationTopic,
    channel: NotificationChannel,
    checked: boolean,
  ) => {
    if (!preferences || updateMutation.isPending) return;
    const next: UserNotificationPreferences = {
      ...preferences,
      [topic]: { ...preferences[topic], [channel]: checked },
    };
    updateMutation.mutate(next);
  };

  const retry = () => void refetch();
  const saving = updateMutation.isPending;

  return (
    <SectionCard
      title="اعلان‌ها"
      description="انتخاب کنید پیام‌ها و رویدادهای حساب از چه راهی به شما اطلاع داده شوند."
      action={
        saving ? (
          <span className="inline-flex items-center gap-2 text-xs text-foreground/50">
            <Loader2 size={14} className="animate-spin" />
            در حال ذخیره
          </span>
        ) : null
      }
    >
      {isError && (
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-amber-500/20 bg-amber-500/6 p-3 text-sm text-foreground/75 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-700" />
            تنظیمات اعلان از سرور دریافت نشد.
          </span>
          <button
            type="button"
            onClick={retry}
            disabled={isLoading}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-foreground/15 px-3 text-xs font-medium hover:border-primary/40 hover:text-primary disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RotateCcw size={14} />
            )}
            تلاش دوباره
          </button>
        </div>
      )}

      {saved && !saving && (
        <p role="status" className="mb-3 text-xs text-emerald-700">
          تنظیمات ذخیره شد.
        </p>
      )}

      {isLoading && !preferences && (
        <div className="flex min-h-28 items-center justify-center gap-2 text-sm text-foreground/55">
          <Loader2 size={16} className="animate-spin" />
          در حال دریافت تنظیمات…
        </div>
      )}

      {preferences && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-136 text-sm">
            <thead>
              <tr className="border-b border-foreground/10 text-xs text-foreground/50">
                <th scope="col" className="pb-3 text-start font-medium">
                  موضوع
                </th>
                {CHANNELS.map((channel) => (
                  <th
                    key={channel.id}
                    scope="col"
                    className="pb-3 ps-4 text-center font-medium"
                  >
                    {channel.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {TOPICS[role].map((topic) => (
                <tr key={topic.id}>
                  <td className="py-4 pe-4">
                    <p className="font-medium text-foreground">{topic.label}</p>
                    <p className="mt-0.5 text-xs leading-5 text-foreground/50">
                      {topic.description}
                    </p>
                  </td>
                  {CHANNELS.map((channel) => (
                    <td key={channel.id} className="py-4 ps-4 text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={preferences[topic.id][channel.id]}
                          disabled={saving || isError}
                          onChange={(checked) =>
                            void updatePreference(topic.id, channel.id, checked)
                          }
                          label={`${topic.label} از طریق ${channel.label}`}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
