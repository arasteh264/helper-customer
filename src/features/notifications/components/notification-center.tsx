"use client";

import { useMemo } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Bell,
  BriefcaseBusiness,
  CheckCheck,
  CircleDollarSign,
  Loader2,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { formatNumber, toPersianDigits } from "@/src/utils/format";
import {
  notificationPreferencesApi,
  notificationQueryKeys,
} from "../api/notification-preferences.api";
import type {
  NotificationRole,
  NotificationType,
  UserNotification,
  UserNotificationsPage,
} from "../types/notification-preferences.types";

const POLL_INTERVAL_MS = 60_000;
const PAGE_SIZE = 20;

const TYPE_PRESENTATION: Record<
  NotificationType,
  { label: string; icon: typeof Bell }
> = {
  CHAT_MESSAGE: { label: "پیام جدید", icon: MessageCircle },
  SERVICE_REQUEST_STATUS: {
    label: "تغییر وضعیت درخواست",
    icon: BriefcaseBusiness,
  },
  PROVIDER_OFFER: { label: "پیشنهاد متخصص", icon: Sparkles },
  NEW_OPPORTUNITY: { label: "درخواست کاری جدید", icon: BriefcaseBusiness },
  PAYMENT_UPDATE: { label: "به‌روزرسانی پرداخت", icon: CircleDollarSign },
};

function notificationHref(role: NotificationRole, item: UserNotification) {
  if (!item.serviceRequestId) return null;
  const requestId = encodeURIComponent(item.serviceRequestId);
  return role === "CUSTOMER"
    ? `/customer/requests/${requestId}`
    : `/provider/chats?requestId=${requestId}`;
}

function formatNotificationDate(value: string) {
  return toPersianDigits(
    new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tehran",
    }).format(new Date(value)),
  );
}

export function NotificationCenter({
  role,
  accessToken,
}: {
  role: NotificationRole;
  accessToken: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const listKey = notificationQueryKeys.list(role);
  const unreadKey = notificationQueryKeys.unreadCount(role);

  const notificationsQuery = useInfiniteQuery({
    queryKey: listKey,
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) =>
      notificationPreferencesApi.list(accessToken, {
        cursor: pageParam,
        limit: PAGE_SIZE,
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const unreadQuery = useQuery({
    queryKey: unreadKey,
    queryFn: () => notificationPreferencesApi.getUnreadCount(accessToken),
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const items = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [notificationsQuery.data],
  );
  const visibleUnreadCount =
    unreadQuery.data ?? items.filter((item) => !item.readAt).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) =>
      notificationPreferencesApi.markRead(id, accessToken),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previousList =
        queryClient.getQueryData<
          InfiniteData<UserNotificationsPage, string | undefined>
        >(listKey);
      const previousCount = queryClient.getQueryData<number>(unreadKey);
      const wasUnread =
        previousList?.pages.some((page) =>
          page.items.some((item) => item.id === id && item.readAt === null),
        ) ?? false;

      if (previousList) {
        queryClient.setQueryData<
          InfiniteData<UserNotificationsPage, string | undefined>
        >(listKey, {
          ...previousList,
          pages: previousList.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === id && !item.readAt
                ? { ...item, readAt: new Date().toISOString() }
                : item,
            ),
          })),
        });
      }
      if (wasUnread && previousCount !== undefined) {
        queryClient.setQueryData(unreadKey, Math.max(0, previousCount - 1));
      }

      return { previousList, previousCount };
    },
    onError: (_error, _id, context) => {
      if (context?.previousList)
        queryClient.setQueryData(listKey, context.previousList);
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(unreadKey, context.previousCount);
      }
      toast.error("خواندن اعلان ثبت نشد. دوباره تلاش کنید.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: unreadKey }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationPreferencesApi.markAllRead(accessToken),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previousList =
        queryClient.getQueryData<
          InfiniteData<UserNotificationsPage, string | undefined>
        >(listKey);
      const previousCount = queryClient.getQueryData<number>(unreadKey);

      if (previousList) {
        const readAt = new Date().toISOString();
        queryClient.setQueryData<
          InfiniteData<UserNotificationsPage, string | undefined>
        >(listKey, {
          ...previousList,
          pages: previousList.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.readAt ? item : { ...item, readAt },
            ),
          })),
        });
      }
      queryClient.setQueryData(unreadKey, 0);
      return { previousList, previousCount };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousList)
        queryClient.setQueryData(listKey, context.previousList);
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(unreadKey, context.previousCount);
      }
      toast.error("خواندن همه‌ی اعلان‌ها انجام نشد.");
    },
    onSuccess: () => toast.success("همه‌ی اعلان‌ها خوانده شدند."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: unreadKey }),
  });

  const openNotification = async (item: UserNotification) => {
    if (!item.readAt) {
      try {
        await markReadMutation.mutateAsync(item.id);
      } catch {
        return;
      }
    }
    const href = notificationHref(role, item);
    if (href) router.push(href);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {formatNumber(visibleUnreadCount)} اعلان خوانده‌نشده
          </h2>
          <p className="mt-1 text-xs text-foreground/50">
            اعلان‌های جدید به‌صورت خودکار بررسی می‌شوند.
          </p>
        </div>
        <button
          type="button"
          onClick={() => markAllReadMutation.mutate()}
          disabled={visibleUnreadCount === 0 || markAllReadMutation.isPending}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-foreground/15 px-3 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
        >
          {markAllReadMutation.isPending ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCheck size={16} />
          )}
          خواندن همه
        </button>
      </div>

      {notificationsQuery.isLoading ? (
        <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-foreground/55">
          <Loader2 size={17} className="animate-spin" />
          در حال دریافت اعلان‌ها…
        </div>
      ) : notificationsQuery.isError ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/15 px-5 py-12 text-center">
          <AlertCircle size={22} className="text-amber-700" />
          <p className="text-sm text-foreground/65">
            دریافت اعلان‌ها انجام نشد.
          </p>
          <button
            type="button"
            onClick={() => void notificationsQuery.refetch()}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <RotateCcw size={15} />
            تلاش دوباره
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-y border-foreground/10 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5 text-foreground/45">
            <Bell size={21} />
          </span>
          <p className="text-sm font-medium text-foreground/70">
            اعلان تازه‌ای ندارید.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-foreground/10">
            {items.map((item) => {
              const presentation = TYPE_PRESENTATION[item.type];
              const Icon = presentation.icon;
              const href = notificationHref(role, item);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => void openNotification(item)}
                    disabled={markReadMutation.isPending}
                    className="flex w-full items-start gap-3 py-4 text-start transition-colors hover:bg-foreground/2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:opacity-70"
                  >
                    <span className="relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                      <Icon size={18} />
                      {!item.readAt && (
                        <span className="absolute -inset-e-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[11px] font-medium text-primary">
                          {presentation.label}
                        </span>
                        <time
                          dateTime={item.createdAt}
                          className="text-[11px] text-foreground/45"
                        >
                          {formatNotificationDate(item.createdAt)}
                        </time>
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-foreground/60">
                        {item.body}
                      </span>
                      {href && (
                        <span className="mt-2 block text-xs font-medium text-primary">
                          مشاهده جزئیات
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {notificationsQuery.hasNextPage ? (
            <div className="flex justify-center border-t border-foreground/10 pt-4">
              <button
                type="button"
                onClick={() => void notificationsQuery.fetchNextPage()}
                disabled={notificationsQuery.isFetchingNextPage}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-foreground/15 px-4 text-sm font-medium text-foreground/70 hover:border-primary/40 hover:text-primary disabled:opacity-60"
              >
                {notificationsQuery.isFetchingNextPage && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                اعلان‌های بیشتر
              </button>
            </div>
          ) : (
            <p className="border-t border-foreground/10 pt-4 text-center text-xs text-foreground/45">
              همه‌ی اعلان‌ها نمایش داده شدند.
            </p>
          )}
        </>
      )}
    </section>
  );
}
