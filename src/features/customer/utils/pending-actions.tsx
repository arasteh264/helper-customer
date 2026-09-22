import type { BadgeTone } from "@/src/components/shared/status-badge";
import type { ServiceRequest } from "../types/customer.types";

export interface PendingAction {
  id: string;
  tone: BadgeTone;
  title: string;
  description: string;
  cta: string;
  href: string;
}

const fa = new Intl.NumberFormat("fa-IR");

export function getPendingActions(requests: ServiceRequest[]): PendingAction[] {
  const actions: PendingAction[] = [];

  for (const r of requests) {
    if (r.status === "offers_received") {
      actions.push({
        id: `offers-${r.id}`,
        tone: "warning",
        title: `${fa.format(r.offersCount)} پیشنهاد برای «${r.title}»`,
        description: "پیشنهادها را مقایسه کنید و بهترین متخصص را انتخاب کنید.",
        cta: "مشاهده‌ی پیشنهادها",
        href: `/customer/requests/${r.id}`,
      });
    }

    if (r.status === "completed" && !r.reviewed && r.specialist) {
      actions.push({
        id: `review-${r.id}`,
        tone: "info",
        title: `نظر شما درباره‌ی ${r.specialist.name}`,
        description: `کار «${r.title}» تمام شده. تجربه‌تان را با بقیه به اشتراک بگذارید.`,
        cta: "ثبت نظر",
        href: "/customer/requests?tab=completed",
      });
    }
  }

  return actions;
}