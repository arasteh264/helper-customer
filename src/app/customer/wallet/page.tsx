import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ApiError } from "@/src/lib/api/error";
import { customerApi } from "@/src/features/customer/api/customer.api";
import { WalletBalanceCard } from "@/src/features/customer/components/wallet-balance-card";
import { WalletPaymentsTable } from "@/src/features/customer/components/wallet-payments-table";
import { PageHeader } from "@/src/components/shared/page-header";
import { SectionCard } from "@/src/components/shared/section-card";

export const metadata: Metadata = { title: "کیف پول | پنل مشتری" };

export default async function CustomerWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ topup?: string }>;
}) {
  const session = await auth();
  if (!session?.accessToken)
    redirect("/login?callbackUrl=%2Fcustomer%2Fwallet");

  const query = await searchParams;
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
        title="کیف پول"
        description="موجودی و تراکنش‌های کیف پول خود را مدیریت کنید."
      />
      {query.topup === "success" ? (
        <SectionCard title="شارژ کیف پول انجام شد">
          <p className="text-sm leading-7 text-foreground/65">
            موجودی جدید شما در بالای صفحه نمایش داده می‌شود.
          </p>
        </SectionCard>
      ) : query.topup === "failed" ? (
        <SectionCard title="پرداخت شارژ کامل نشد">
          <p className="text-sm leading-7 text-foreground/65">
            مبلغی به کیف پول اضافه نشد. می‌توانید دوباره تلاش کنید.
          </p>
        </SectionCard>
      ) : query.topup === "pending" ? (
        <SectionCard title="وضعیت پرداخت در حال بررسی است">
          <p className="text-sm leading-7 text-foreground/65">
            موجودی پس از تأیید نهایی درگاه به‌روز می‌شود.
          </p>
        </SectionCard>
      ) : null}
      <WalletBalanceCard
        balance={wallet.balance}
        accessToken={session.accessToken}
      />
      <WalletPaymentsTable payments={wallet.transactions} />
    </div>
  );
}
