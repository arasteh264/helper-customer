import { cn } from "@/src/lib/utils/cn";
import { toEnglishDigits, toPersianDigits } from "@/src/utils/format";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  persianDigits?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      type,
      inputMode,
      persianDigits = false,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const usesNumericKeyboard =
      persianDigits ||
      type === "tel" ||
      inputMode === "numeric" ||
      inputMode === "decimal";
    const displayDigits = (
      input: string | number | readonly string[] | undefined,
    ) =>
      input == null ? input : toPersianDigits(toEnglishDigits(String(input)));

    return (
      <input
        ref={ref}
        type={type}
        inputMode={inputMode}
        value={usesNumericKeyboard ? displayDigits(value) : value}
        defaultValue={
          usesNumericKeyboard ? displayDigits(defaultValue) : defaultValue
        }
        onChange={(event) => {
          if (usesNumericKeyboard) {
            const input = event.currentTarget;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const displayed = displayDigits(input.value) as string;
            if (displayed !== input.value) {
              input.value = displayed;
              onChange?.(event);
              if (start !== null && end !== null) {
                input.setSelectionRange(start, end);
              }
              return;
            }
          }
          onChange?.(event);
        }}
        className={cn(
          "flex h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-foreground/40 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-destructive" : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
