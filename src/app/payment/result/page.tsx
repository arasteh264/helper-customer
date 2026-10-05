import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { auth } from "@/src/auth";
import { requestApi } from "@/src/features/request/api/request.api";
import { ApiError } from "@/src/lib/api/error";
import { PaymentStatusRefresh } from "./payment-status-refresh";

export const metadata: Metadata = { title: "نتیجه‌ی پرداخت | هلپر" };

type PaymentResult = "success" | "failed" | "pending" | "unknown";

const RESULT_CONTENT = {
  success: {
    title: "پرداخت با موفقیت تأیید شد",
    description: "پرداخت توسط سرور تأیید شده و درخواست شما به‌روزرسانی شده است.",
    Icon: CheckCircle2,
    tone: "bg-emerald-600/10 text-emerald-700",
  },
  failed: {
    title: "پرداخت کامل نشد",
    description:
      "پرداخت توسط سرور تأیید نشد؛ می‌توانید وضعیت درخواست را ببینید و دوباره تلاش کنید.",
    Icon: XCircle,
    tone: "bg-destructive/10 text-destructive",
  },
  pending: {
    title: "وضعیت پرداخت در حال بررسی است",
    description:
      "هنوز پاسخ نهایی ثبت نشده است. لطفاً پرداخت را دوباره انجام ندهید و کمی بعد وضعیت را بررسی کنید.",
    Icon: Clock3,
    tone: "bg-amber-500/15 text-amber-800",
  },
  unknown: {
    title: "وضعیت پرداخت مشخص نیست",
    description:
      "وضعیت نهایی پرداخت از سرور دریافت نشد. برای جلوگیری از پرداخت تکراری، ابتدا درخواست را بررسی کنید.",
    Icon: Clock3,
    tone: "bg-amber-500/15 text-amber-800",
  },
} satisfies Record<
  PaymentResult,
  {
    title: string;
    description: string;
    Icon: typeof CheckCircle2;
    tone: string;
  }
>;

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; requestId?: string }>;
}) {
  const query = await searchParams;
  const requestId = query.requestId;
  const session = await auth();

  if (requestId && !session?.accessToken) {
    const callbackUrl = `/payment/result?requestId=${encodeURIComponent(requestId)}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  let status: PaymentResult = "unknown";
  if (requestId && session?.accessToken) {
    try {
      await requestApi.verifyPaymentStatus(requestId, session.accessToken);
      const payment = await requestApi.getPaymentStatus(
        requestId,
        session.accessToken,
      );
      status =
        payment.status === "PAID"
          ? "success"
          : payment.status === "FAILED" || payment.status === "REFUNDED"
            ? "failed"
            : "pending";
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        redirect("/login?reason=session-expired");
      }
      status = "unknown";
    }
  }

  const result = RESULT_CONTENT[status];
  const { Icon } = result;
  const requestHref = requestId
    ? `/customer/requests/${encodeURIComponent(requestId)}`
    : "/customer/requests";

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-lg rounded-xl border border-foreground/10 bg-card p-6 text-center shadow-sm sm:p-8">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${result.tone}`}
        >
          <Icon size={26} />
        </span>
        <h1 className="mt-5 text-xl font-bold text-foreground">
          {result.title}
        </h1>
        <p className="mt-2 text-sm leading-7 text-foreground/60">
          {result.description}
        </p>
        {requestId ? (
          <p className="mt-3 text-xs text-foreground/45">
            کد درخواست: {requestId}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {status === "pending" || status === "unknown" ? (
            <PaymentStatusRefresh />
          ) : null}
          <Link
            href={requestHref}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {status === "success" ? "مشاهده‌ی درخواست" : "بازگشت به درخواست"}
          </Link>
        </div>
      </section>
    </main>
  );
}
