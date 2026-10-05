import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";
import { customerApi } from "@/src/features/customer/api/customer.api";
import { WalletBalanceCard } from "@/src/features/customer/components/wallet-balance-card";
import { WalletPaymentsTable } from "@/src/features/customer/components/wallet-payments-table";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";
import { WalletTopupContinuation } from "@/src/features/customer/components/wallet-topup-continuation";

export const metadata: Metadata = { title: "کیف پول | پنل مشتری" };

export default async function CustomerWalletPage({
  searchParams,
}: {
  searchParams: Promise<{
    topup?: string;
    returnTo?: string;
    requiredToman?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.accessToken)
    redirect("/login?callbackUrl=%2Fcustomer%2Fwallet");

  const query = await searchParams;
  const isProviderBuyer = session.user.role?.toUpperCase() === "PROVIDER";
  const requestedAmount = Number(query.requiredToman ?? 0);
  const suggestedAmountToman =
    Number.isSafeInteger(requestedAmount) && requestedAmount > 0
      ? Math.max(10_000, requestedAmount)
      : 0;
  let wallet;
  try {
    wallet = await customerApi.getWallet(session.accessToken);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/login?reason=session-expired");
    }
    return (
      <div className="space-y-6">
        <PageHeader
          title="کیف پول"
          description="موجودی و تراکنش‌های کیف پول خود را مدیریت کنید."
        />
        <SectionCard title="دریافت اطلاعات کیف پول ممکن نشد">
          <p className="text-sm leading-7 text-foreground/65">
            دوباره تلاش کنید یا بعداً به این صفحه برگردید.
          </p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isProviderBuyer ? "کیف پول خرید خدمات" : "کیف پول"}
        description={
          isProviderBuyer
            ? "این موجودی برای خرید خدمات است و از درآمد قابل برداشت شما جداست."
            : "موجودی و تراکنش‌های کیف پول خود را مدیریت کنید."
        }
      />
      {query.topup === "success" ? (
        <SectionCard title="شارژ کیف پول انجام شد">
          <p className="text-sm leading-7 text-foreground/65">
            موجودی جدید شما در بالای صفحه نمایش داده می‌شود.
          </p>
          <WalletTopupContinuation
            topupStatus="success"
            returnTo={query.returnTo}
            requiredAmountToman={suggestedAmountToman}
          />
        </SectionCard>
      ) : query.topup === "failed" ? (
        <SectionCard title="پرداخت شارژ کامل نشد">
          <p className="text-sm leading-7 text-foreground/65">
            مبلغی به کیف پول اضافه نشد. می‌توانید دوباره تلاش کنید.
          </p>
          <WalletTopupContinuation
            topupStatus="failed"
            returnTo={query.returnTo}
            requiredAmountToman={suggestedAmountToman}
          />
        </SectionCard>
      ) : query.topup === "pending" ? (
        <SectionCard title="وضعیت پرداخت در حال بررسی است">
          <p className="text-sm leading-7 text-foreground/65">
            موجودی پس از تأیید نهایی درگاه به‌روز می‌شود.
          </p>
          <WalletTopupContinuation
            topupStatus="pending"
            returnTo={query.returnTo}
            requiredAmountToman={suggestedAmountToman}
          />
        </SectionCard>
      ) : null}
      {query.returnTo && query.topup !== "success" ? (
        <WalletTopupContinuation
          topupStatus="needed"
          returnTo={query.returnTo}
          requiredAmountToman={suggestedAmountToman}
        />
      ) : null}
      <WalletBalanceCard
        balance={wallet.balance}
        accessToken={session.accessToken}
        suggestedAmountToman={suggestedAmountToman}
        isProviderBuyer={isProviderBuyer}
      />
      <WalletPaymentsTable payments={wallet.transactions} />
    </div>
  );
}
