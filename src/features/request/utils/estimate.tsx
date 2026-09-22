import type { RepairCategory, Urgency } from "../types/request.types";

/** برآورد تقریبی قیمت بر اساس دسته و فوریت؛ فقط برای راهنمایی مشتری است */
export function estimatePriceRange(category: RepairCategory, urgency: Urgency) {
  const rushFactor = urgency === "asap" ? 1.15 : 1;
  return {
    min: Math.round((category.priceRange.min * rushFactor) / 10000) * 10000,
    max: Math.round((category.priceRange.max * rushFactor) / 10000) * 10000,
  };
}

export const URGENCY_LABEL: Record<Urgency, string> = {
  asap: "همین امروز",
  this_week: "همین هفته",
  scheduled: "زمان مشخص",
};

export const URGENCY_HINT: Record<Urgency, string> = {
  asap: "معمولاً ظرف ۱ تا ۳ ساعت متخصص پیدا می‌شود",
  this_week: "زمان کافی برای مقایسه‌ی چند پیشنهاد دارید",
  scheduled: "برای تاریخ و ساعت دلخواه‌تان برنامه‌ریزی می‌کنیم",
};