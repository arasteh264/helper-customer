"use client";

import { customerApi } from "../api/customer.api";
import { useMutation } from "./use-mutation";


/** شروع فرایند شارژ کیف پول: کاربر را به درگاه بانکی می‌فرستد */
export function useWalletTopup() {
  const { run, isPending } = useMutation(
    async (amount: number) => {
      // const { paymentUrl } = await customerApi.topUpWallet(amount);
      // window.location.href = paymentUrl;
    },
    { error: "اتصال به درگاه پرداخت انجام نشد. دوباره تلاش کنید." }
  );

  return { topUp: run, isPending };
}