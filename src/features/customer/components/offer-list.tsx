"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Loader2, Star } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { customerApi } from "../api/customer.api";
import { formatMoney } from "@/src/utils/format";

export interface Offer {
  id: string;
  specialistId: string;
  name: string;
  field: string;
  rating: number;
  reviews: number;
  price: number;
  etaLabel: string; // مثلاً «می‌تواند فردا بیاید»
  verified: boolean;
}

export function OfferList({ requestId, offers }: { requestId: string; offers: Offer[] }) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const accept = async (offer: Offer) => {
    if (!window.confirm(`پیشنهاد ${offer.name} به مبلغ ${formatMoney(offer.price)} پذیرفته شود؟`)) {
      return;
    }
    setAcceptingId(offer.id);
    try {
      // TODO: بعد از پذیرش، کاربر را به صفحه‌ی درخواست هدایت یا رفرش کنید
      await customerApi.acceptOffer(requestId, offer.id);
      toast.success(`پیشنهاد ${offer.name} پذیرفته شد`);
    } catch {
      toast.error("پذیرش پیشنهاد انجام نشد. دوباره تلاش کنید.");
    } finally {
      setAcceptingId(null);
    }
  };

  const sorted = [...offers].sort((a, b) => a.price - b.price);

  return (
    <ul className="space-y-3">
      {sorted.map((offer) => (
        <li
          key={offer.id}
          className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              {offer.name.charAt(0)}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground">{offer.name}</p>
                {offer.verified && <BadgeCheck size={15} className="text-primary" />}
              </div>
              <p className="text-xs text-foreground/55">{offer.field}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-foreground/55">
                <span className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-500 text-amber-500" />
                  {offer.rating} ({offer.reviews})
                </span>
                <span>{offer.etaLabel}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
            <p className="text-base font-bold text-foreground">{formatMoney(offer.price)}</p>
            <Button
              type="button"
              onClick={() => accept(offer)}
              disabled={acceptingId !== null}
              className="gap-1.5"
            >
              {acceptingId === offer.id && <Loader2 size={14} className="animate-spin" />}
              انتخاب و پذیرش
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}