"use client";

import { Loader2, Pencil } from "lucide-react";

import { OtpInput } from "../OtpInput";
import { OTP_LENGTH, RESEND_SECONDS } from "../../hooks/use-specialist-register";
import { toPersianDigits } from "@/src/utils/format";

const formatTime = (total: number) => {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return toPersianDigits(`${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
};

interface Props {
  otp: string;
  onOtpChange: (value: string) => void;
  onComplete: (code: string) => void;
  verifying: boolean;
  hasError: boolean;
  secondsLeft: number;
  onBack: () => void;
  onResend: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export function VerifyStep({
  otp,
  onOtpChange,
  onComplete,
  verifying,
  hasError,
  secondsLeft,
  onBack,
  onResend,
}: Props) {
  return (
    <div className="space-y-6">
      <OtpInput
        value={otp}
        onChange={onOtpChange}
        onComplete={onComplete}
        length={OTP_LENGTH}
        disabled={verifying}
        error={hasError}
        autoFocus
      />

      {verifying && (
        <p
          className="flex items-center justify-center gap-2 text-sm text-foreground/60"
          aria-live="polite"
        >
          <Loader2 className="animate-spin" size={16} />
          در حال بررسی کد…
        </p>
      )}

      {secondsLeft > 0 && (
        <div className="h-1 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / RESEND_SECONDS) * 100}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onBack}
          disabled={verifying}
          className={`flex items-center gap-1.5 rounded text-foreground/60 transition-colors hover:text-primary ${focusRing}`}
        >
          <Pencil size={14} />
          ویرایش اطلاعات
        </button>

        {secondsLeft > 0 ? (
          <span className="text-foreground/50">
            ارسال مجدد تا{" "}
            <span className="font-medium tabular-nums text-foreground/70">
              {formatTime(secondsLeft)}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={verifying}
            className={`rounded font-medium text-primary transition-colors hover:underline ${focusRing}`}
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
}