"use client";

import { useEffect, useRef } from "react";

/* تبدیل ارقام فارسی و عربی به انگلیسی */
export const toEnglishDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = false,
  className = "",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  useEffect(() => {
    if (autoFocus && !disabled && value === "") {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled, value]);

  const commit = (next: string[], focusIndex: number) => {
    const joined = next.join("").slice(0, length);
    onChange(joined);

    const target = Math.max(0, Math.min(focusIndex, length - 1));
    inputsRef.current[target]?.focus();

    if (joined.length === length) onComplete?.(joined);
  };

  const handleChange = (index: number, raw: string) => {
    const incoming = toEnglishDigits(raw).replace(/\D/g, "");
    if (!incoming) return;

    const chars = value.split("");
    const pos = Math.min(index, chars.length);
    const room = incoming.slice(0, length - pos).split("");

    const next = [
      ...chars.slice(0, pos),
      ...room,
      ...chars.slice(pos + room.length),
    ];

    commit(next, pos + room.length);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Backspace": {
        e.preventDefault();
        const chars = value.split("");
        if (chars[index]) {
          chars.splice(index, 1);
          commit(chars, index);
        } else if (index > 0) {
          chars.splice(index - 1, 1);
          commit(chars, index - 1);
        }
        break;
      }
      case "ArrowLeft":
        e.preventDefault();
        inputsRef.current[Math.max(0, index - 1)]?.focus();
        break;
      case "ArrowRight":
        e.preventDefault();
        inputsRef.current[Math.min(length - 1, index + 1)]?.focus();
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = toEnglishDigits(e.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    commit(pasted.split(""), pasted.length);
  };

  const handleFocus = (index: number, el: HTMLInputElement) => {
    // جلوگیری از ایجاد فاصله: فوکوس روی اولین خانه‌ی خالی
    if (index > value.length) {
      inputsRef.current[value.length]?.focus();
      return;
    }
    el.select();
  };

  return (
    <div
      dir="ltr"
      role="group"
      aria-label="کد تأیید"
      className={`flex justify-center gap-2 sm:gap-2.5 ${className}`}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={length}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => handleFocus(i, e.currentTarget)}
          aria-label={`رقم ${toPersianDigits(i + 1)} از ${toPersianDigits(length)}`}
          aria-invalid={error}
          className={[
            "h-12 w-11 rounded-xl border bg-background text-center text-lg font-semibold text-foreground outline-none transition-all sm:h-14 sm:w-12",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
            error
              ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
              : digit
                ? "border-primary/50 bg-primary/[0.03]"
                : "border-foreground/15",
          ].join(" ")}
        />
      ))}
    </div>
  );
}