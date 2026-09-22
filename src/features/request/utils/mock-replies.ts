/** پاسخ‌های خودکار نمایشی، فقط برای دمو. در نسخه‌ی واقعی پیام از طرف مقابل واقعی می‌آید. */

const SUPPORT_REPLIES = [
  "سلام! پیام شما دریافت شد. در حال بررسی درخواست‌تان هستیم.",
  "به‌محض این‌که متخصص مناسبی پیدا شود، به شما اطلاع می‌دهیم.",
  "می‌توانید همین‌جا هر سؤالی دارید بپرسید، همکاران به زودی پاسخ می‌دهند.",
];

const SPECIALIST_REPLIES = [
  "سلام، ممنون از پیام‌تان. تا حدود ۱۰ دقیقه دیگر پاسخ می‌دهم.",
  "بله حتماً، سر ساعت هماهنگ‌شده آنجا خواهم بود.",
  "برای اطمینان بیشتر، اگر امکانش هست یک عکس دیگر هم از زاویه‌ی دیگر بفرستید.",
];

export function getMockReply(persona: "support" | "specialist"): string {
  const pool = persona === "support" ? SUPPORT_REPLIES : SPECIALIST_REPLIES;
  return pool[Math.floor(Math.random() * pool.length)];
}