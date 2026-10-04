"use client";

import Link from "next/link";
import { FormProvider } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import { useSpecialistRegister } from "../hooks/use-specialist-register";
import { RegisterHeader } from "./specialist-register/RegisterHeader";
import { DetailsStep } from "./specialist-register/DetailsStep";
import { VerifyStep } from "./specialist-register/VerifyStep";
import { ServerError } from "./specialist-register/shared";

export function SpecialistRegisterForm() {
  const r = useSpecialistRegister();

  return (
    <div className="w-full max-w-2xl">
      <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-card shadow-2xl shadow-foreground/[0.07]">
        <RegisterHeader step={r.step} phone={r.form.getValues("mobile")} />

        <div className="px-6 py-6 sm:px-8">
          {r.serverError && <ServerError message={r.serverError} />}

          <FormProvider {...r.form}>
            {r.step === "details" ? (
              <DetailsStep onSubmit={r.submit} />
            ) : (
              <VerifyStep
                otp={r.otp}
                onOtpChange={r.changeOtp}
                onComplete={r.verifyCode}
                verifying={r.verifying}
                hasError={!!r.serverError}
                secondsLeft={r.secondsLeft}
                onBack={r.backToDetails}
                onResend={r.resendCode}
              />
            )}
          </FormProvider>
        </div>

        <div className="border-t border-foreground/5 bg-foreground/[0.02] px-6 py-4 text-center text-sm text-foreground/60 sm:px-8">
          حساب کاربری دارید؟{" "}
          <Link
            href="/login"
            className="rounded font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            وارد شوید
          </Link>
        </div>
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
        <ShieldCheck size={14} />
        اطلاعات شما محفوظ می‌ماند و با کسی به اشتراک گذاشته نمی‌شود
      </p>
    </div>
  );
}