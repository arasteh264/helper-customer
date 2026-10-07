import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CalendarClock, MapPin, Phone, UserRound } from "lucide-react";
import { auth } from "@/src/auth";
import { requestApi } from "@/src/features/request/api/request.api";
import { RequestProgress } from "@/src/features/customer/components/request-progress";
import { REQUEST_STATUS } from "@/src/features/customer/utils/status-maps";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { formatDateTime, formatMoney } from "@/src/utils/format";
import { RequestPaymentActions } from "@/src/features/customer/components/request-payment-actions";
import type { ServiceRequestPayment } from "@/src/features/request/api/request.api";
import { RequestChat } from "@/src/features/request/components/request-chat";
import { customerApi } from "@/src/features/customer/api/customer.api";
import { ReviewForm } from "@/src/features/customer/components/review-form";
import { Star } from "lucide-react";
import { formatNumber } from "@/src/utils/format";
import { ApiError } from "@/src/lib/api/error";
import { RequestEditDialog } from "@/src/features/customer/components/request-edit-dialog";

export const metadata: Metadata = { title: "پیگیری درخواست | پنل مشتری" };

export default async function CustomerRequestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const session = await auth();
  if (!session?.accessToken) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(`/customer/requests/${id}`)}`,
    );
  }
  let request;
  try {
    request = await requestApi.getMyRequest(id, session.accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?reason=session-expired");
    }
    if (
      error instanceof ApiError &&
      (error.status === 403 || error.status === 404)
    ) {
      notFound();
    }
    throw error;
  }
  let payment: ServiceRequestPayment | null = null;
  if (request.status === "awaiting_payment" || Object.keys(query).length > 0) {
    try {
      payment = await requestApi.getPaymentStatus(id, session.accessToken);
    } catch {
      payment = null;
    }
  }
  const status = REQUEST_STATUS[request.status];
  const canShowSpecialistContact =
    !!request.specialist?.phone &&
    (request.wasPaid ||
      [
        "in_progress",
        "awaiting_confirmation",
        "completed",
        "disputed",
      ].includes(request.status));
  const amountToman =
    request.priceToman ??
    request.finalPriceToman ??
    request.proposedPriceToman ??
    request.price;
  const review = request.review;
  let walletBalance: number | undefined;
  if (request.status === "awaiting_payment") {
    try {
      walletBalance = (await customerApi.getWallet(session.accessToken))
        .balance;
    } catch {
      walletBalance = undefined;
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={request.title}
        description={`کد پیگیری ${request.code} · ${request.category}`}
        action={
          <Link
            href="/customer/requests"
            className="text-sm font-medium text-primary hover:underline"
          >
            همه‌ی درخواست‌ها
          </Link>
        }
      />

      <SectionCard
        title="وضعیت درخواست"
        description="وضعیت را تا پایان هماهنگی و انجام کار پیگیری کنید."
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-sm text-foreground/60">
            ثبت‌شده در {formatDateTime(request.createdAt)}
          </p>
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
        </div>
        <RequestProgress status={request.status} />
        {request.status === "awaiting_confirmation" &&
        request.customerConfirmationDeadline ? (
          <p className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5 text-xs leading-6 text-amber-900">
            تا {formatDateTime(request.customerConfirmationDeadline)} فرصت دارید
            کار را تأیید یا اختلاف ثبت کنید. اگر پاسخی ثبت نشود، درخواست تکمیل
            می‌شود و درآمد برای متخصص آزاد خواهد شد.
          </p>
        ) : null}
      </SectionCard>

      <RequestPaymentActions
        key={`${id}-${request.status}-${request.dispute?.updatedAt ?? ""}`}
        requestId={id}
        requestStatus={request.status}
        amountToman={amountToman}
        walletBalance={walletBalance}
        initialPayment={payment}
        initialDispute={request.dispute ?? null}
        accessToken={session.accessToken}
      />

      <RequestChat
        requestId={id}
        accessToken={session.accessToken}
        currentUserId={session.user.id}
        currentUserRole={
          session.user.role?.toUpperCase() === "PROVIDER"
            ? "PROVIDER"
            : "CUSTOMER"
        }
      />

      {request.specialist ? (
        <SectionCard
          title="هماهنگی با متخصص"
          description="متخصص درخواست شما را پذیرفته است؛ برای هماهنگی زمان و جزئیات تماس بگیرید."
        >
          <div className="flex flex-col gap-4 rounded-xl border border-primary/15 bg-primary/4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound size={20} />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {request.specialist.name}
                </p>
                <p className="mt-0.5 text-xs text-foreground/55">
                  {request.specialist.field}
                </p>
              </div>
            </div>
            {canShowSpecialistContact ? (
              <a
                href={`tel:${request.specialist.phone}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
              >
                <Phone size={16} />
                تماس با متخصص
              </a>
            ) : (
              <div className="rounded-lg border border-foreground/10 bg-background px-3 py-2 text-xs text-foreground/55">
                شماره متخصص بعد از پرداخت و تأیید وضعیت درخواست نمایش داده می‌شود.
              </div>
            )}
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="در حال پیدا کردن متخصص">
          <p className="text-sm leading-7 text-foreground/65">
            درخواست برای متخصصان تأییدشده‌ی همین حوزه ارسال شده است. به‌محض
            پذیرش، اطلاعات تماس و هماهنگی اینجا نمایش داده می‌شود.
          </p>
        </SectionCard>
      )}

      <SectionCard title="جزئیات درخواست">
        {request.status === "awaiting_offers" ? (
          <RequestEditDialog request={request} />
        ) : (
          <p className="mb-5 text-xs text-foreground/50">
            ویرایش درخواست تا پیش از دریافت پیشنهاد متخصصان امکان‌پذیر است.
          </p>
        )}
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-foreground/50">نشانی محل کار</dt>
            <dd className="mt-1 flex items-start gap-2 text-sm leading-6 text-foreground">
              <MapPin size={16} className="mt-1 shrink-0 text-primary" />
              <span>{request.addressLabel}</span>
            </dd>
            {request.latitude != null && request.longitude != null && (
              <a
                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                href={`https://www.google.com/maps?q=${request.latitude},${request.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                نمایش موقعیت روی نقشه
              </a>
            )}
          </div>
          <div>
            <dt className="text-xs text-foreground/50">زمان مدنظر</dt>
            <dd className="mt-1 flex items-center gap-2 text-sm text-foreground">
              <CalendarClock size={16} className="text-primary" />
              {request.scheduledAt
                ? formatDateTime(request.scheduledAt)
                : "هماهنگی با متخصص"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-foreground/50">بودجه</dt>
            <dd className="mt-1 text-sm text-foreground">
              {request.budget
                ? `${formatMoney(request.budget.min)} تا ${formatMoney(request.budget.max)}`
                : amountToman != null
                  ? formatMoney(amountToman)
                  : "دریافت قیمت از متخصص"}
            </dd>
          </div>
        </dl>
        <p className="mt-5 border-t border-foreground/10 pt-4 text-sm leading-7 text-foreground/70">
          {request.description}
        </p>
        {request.images?.length ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {request.images.map((image, index) => (
              <a key={image} href={image} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`تصویر درخواست ${index + 1}`}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </a>
            ))}
          </div>
        ) : null}
      </SectionCard>

      {request.status === "completed" && request.specialist ? (
        request.reviewed || review ? (
          review ? (
            <SectionCard title="نظر ثبت‌شده‌ی شما">
              <div
                className="flex items-center gap-1"
                role="img"
                aria-label={`امتیاز ${review.rating} از ۵`}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={18}
                    aria-hidden="true"
                    className={
                      index < review.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-foreground/20"
                    }
                  />
                ))}
                <span className="ms-2 text-sm font-medium text-foreground">
                  {formatNumber(review.rating)} / ۵
                </span>
              </div>
              {review.text ? (
                <p className="mt-3 text-sm leading-7 text-foreground/70">
                  {review.text}
                </p>
              ) : null}
              <p className="mt-2 text-xs text-foreground/45">
                {formatDateTime(review.createdAt)}
              </p>
            </SectionCard>
          ) : (
            <SectionCard title="نظر شما ثبت شده است">
              <p className="text-sm leading-7 text-foreground/65">
                ثبت امتیاز این درخواست قبلاً انجام شده است.
              </p>
            </SectionCard>
          )
        ) : (
          <SectionCard
            title="تجربه‌تان را ثبت کنید"
            description="پس از تکمیل کار، امتیاز و نظر شما به دیگر مشتریان برای انتخاب متخصص کمک می‌کند."
          >
            <ReviewForm
              requestId={id}
              specialistName={request.specialist.name}
            />
          </SectionCard>
        )
      ) : null}
    </div>
  );
}
