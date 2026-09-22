import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarClock, MapPin, Phone } from "lucide-react";

import { requests } from "@/src/features/customer/api/mock-data";
import { REQUEST_STATUS } from "@/src/features/customer/utils/status-maps";
import { RequestProgress } from "@/src/features/customer/components/request-progress";
import { OfferList, type Offer } from "@/src/features/customer/components/offer-list";
import { ReviewForm } from "@/src/features/customer/components/review-form";
import { RequestCancelButton } from "@/src/features/customer/components/request-cancel-button";
import { SectionCard } from "@/src/components/shared/section-card";
import { StatusBadge } from "@/src/components/shared/status-badge";
import { formatDateTime, formatMoney } from "@/src/utils/format";

// TODO: پیشنهادها را از API بگیرید؛ این فقط نمونه است
const MOCK_OFFERS: Offer[] = [
  { id: "o-1", specialistId: "ali-rezaei", name: "علی رضایی", field: "لوله‌کش ساختمان", rating: 4.9, reviews: 312, price: 380000, etaLabel: "امروز می‌تواند بیاید", verified: true },
  { id: "o-2", specialistId: "hamed-sadeghi", name: "حامد صادقی", field: "لوله‌کش و تأسیسات", rating: 4.8, reviews: 96, price: 350000, etaLabel: "فردا صبح", verified: true },
  { id: "o-3", specialistId: "reza-karimi", name: "رضا کریمی", field: "لوله‌کش ساختمان", rating: 4.6, reviews: 54, price: 420000, etaLabel: "فردا عصر", verified: false },
];

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const request = requests.find((r) => r.id === params.id);
  return { title: request ? `${request.title} | پنل مشتری` : "درخواست یافت نشد" };
}

export default function CustomerRequestDetailPage({ params }: { params: { id: string } }) {
  // TODO: درخواست را از API / دیتابیس بگیرید
  const request = requests.find((r) => r.id === params.id);
  if (!request) notFound();

  const status = REQUEST_STATUS[request.status];
  const canCancel = request.status === "awaiting_offers" || request.status === "offers_received";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs text-foreground/45">{request.code}</p>
          <h1 className="mt-0.5 text-xl font-bold text-foreground sm:text-2xl">{request.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
          {canCancel && <RequestCancelButton requestId={request.id} />}
        </div>
      </div>

      <SectionCard title="روند پیشرفت">
        <RequestProgress status={request.status} />
      </SectionCard>

      <SectionCard title="جزئیات درخواست">
        <p className="text-sm leading-7 text-foreground/70">{request.description}</p>

        <dl className="mt-4 grid gap-3 border-t border-foreground/10 pt-4 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 text-foreground/60">
            <CalendarClock size={16} />
            <dd>{formatDateTime(request.scheduledAt ?? request.createdAt)}</dd>
          </div>
          <div className="flex items-center gap-2 text-foreground/60">
            <MapPin size={16} />
            <dd>{request.addressLabel}</dd>
          </div>
        </dl>

        {request.budget && (
          <p className="mt-3 text-sm text-foreground/60">
            بودجه‌ی تقریبی: {formatMoney(request.budget.min)} تا {formatMoney(request.budget.max)}
          </p>
        )}
      </SectionCard>

      {request.status === "offers_received" && (
        <SectionCard
          title="پیشنهادهای متخصصان"
          description="پیشنهادها را مقایسه کنید و یکی را انتخاب کنید."
        >
          <OfferList requestId={request.id} offers={MOCK_OFFERS} />
        </SectionCard>
      )}

      {request.specialist && (request.status === "in_progress" || request.status === "completed") && (
        <SectionCard title="متخصص">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
                {request.specialist.name.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{request.specialist.name}</p>
                <p className="text-xs text-foreground/55">{request.specialist.field}</p>
              </div>
            </div>
            {request.specialist.phone && (
              <a
                href={`tel:${request.specialist.phone}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 px-3.5 py-2 text-sm font-medium text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Phone size={15} />
                تماس
              </a>
            )}
          </div>
        </SectionCard>
      )}

      {request.status === "completed" && !request.reviewed && request.specialist && (
        <SectionCard title="ثبت نظر">
          <ReviewForm requestId={request.id} specialistName={request.specialist.name} />
        </SectionCard>
      )}
    </div>
  );
}