"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LockKeyhole,
  ShieldCheck,
  TimerOff,
} from "lucide-react";

import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { PasswordStrength } from "./PasswordStrength";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

interface ResetPasswordFormProps {
  token?: string;
}

type View = "form" | "success" | "invalid";

function CardHeader({
    icon,
    title,
    description,
    tone = "primary",
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    tone?: "primary" | "success" | "danger";
  }) {
  return (
    <div className="border-b border-foreground/5 bg-gradient-to-b from-primary/[0.06] to-transparent px-6 py-7 text-center sm:px-8">
      <span
        className={[
          "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg",
          tone === "primary" &&
            "bg-primary text-primary-foreground shadow-primary/25",
          tone === "success" && "bg-green-600 text-white shadow-green-600/25",
          tone === "danger" &&
            "bg-destructive text-white shadow-destructive/25",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
      </span>
      <h1 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-1.5 text-sm leading-6 text-foreground/60">
        {description}
      </p>
    </div>
  );
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [view, setView] = useState<View>(token ? "form" : "invalid");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "" },
  });

  const password = watch("password");

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      if (res.status === 400 || res.status === 401 || res.status === 410) {
        setView("invalid");
        return;
      }

      if (!res.ok) throw new Error();

      setView("success");
    } catch {
      setServerError("ØªØºÛŒÛŒØ± Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯. Ù„Ø·ÙØ§Ù‹ Ø¯ÙˆØ¨Ø§Ø±Ù‡ ØªÙ„Ø§Ø´ Ú©Ù†ÛŒØ¯.");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-foreground/10 bg-card shadow-xl shadow-foreground/[0.06]">
        {view === "invalid" && (
          <>
            <CardHeader
              tone="danger"
              icon={<TimerOff size={22} />}
              title="Ù„ÛŒÙ†Ú© Ø¨Ø§Ø²ÛŒØ§Ø¨ÛŒ Ù…Ø¹ØªØ¨Ø± Ù†ÛŒØ³Øª"
              description="Ø§ÛŒÙ† Ù„ÛŒÙ†Ú© Ù…Ù†Ù‚Ø¶ÛŒ Ø´Ø¯Ù‡ ÛŒØ§ Ù‚Ø¨Ù„Ø§Ù‹ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ø´Ø¯Ù‡ Ø§Ø³Øª. Ø¯ÙˆØ¨Ø§Ø±Ù‡ Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ø¨Ø§Ø²ÛŒØ§Ø¨ÛŒ Ø¨Ø¯Ù‡ÛŒØ¯."
            />
            <div className="px-6 py-6 sm:px-8">
              <Button size="lg" className="w-full" >
                <Link href="/forgot-password">Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ú©Ø¯ Ø¬Ø¯ÛŒØ¯</Link>
              </Button>
            </div>
          </>
        )}

        {/* â”€â”€â”€â”€â”€ Ù…ÙˆÙÙ‚ÛŒØª â”€â”€â”€â”€â”€ */}
        {view === "success" && (
          <>
            <CardHeader
              tone="success"
              icon={<CheckCircle2 size={22} />}
              title="Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± ØªØºÛŒÛŒØ± Ú©Ø±Ø¯"
              description="Ø­Ø§Ù„Ø§ Ù…ÛŒâ€ŒØªÙˆØ§Ù†ÛŒØ¯ Ø¨Ø§ Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ø¬Ø¯ÛŒØ¯ ÙˆØ§Ø±Ø¯ Ø­Ø³Ø§Ø¨ Ø®ÙˆØ¯ Ø´ÙˆÛŒØ¯"
            />
            <div className="px-6 py-6 sm:px-8">
              <Button size="lg" className="w-full" >
                <Link href="/login">ÙˆØ±ÙˆØ¯ Ø¨Ù‡ Ø­Ø³Ø§Ø¨</Link>
              </Button>
            </div>
          </>
        )}

        {/* â”€â”€â”€â”€â”€ ÙØ±Ù… Ø±Ù…Ø² Ø¬Ø¯ÛŒØ¯ â”€â”€â”€â”€â”€ */}
        {view === "form" && (
          <>
            <CardHeader
              icon={<LockKeyhole size={22} />}
              title="ØªØ¹ÛŒÛŒÙ† Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ø¬Ø¯ÛŒØ¯"
              description="ÛŒÚ© Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ù‚ÙˆÛŒ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ÛŒØ¯ Ú©Ù‡ Ù‚Ø¨Ù„Ø§Ù‹ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ù†Ú©Ø±Ø¯Ù‡â€ŒØ§ÛŒØ¯"
            />

            <div className="px-6 py-6 sm:px-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {serverError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span className="leading-6">{serverError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Ø±Ù…Ø² Ø¹Ø¨ÙˆØ± Ø¬Ø¯ÛŒØ¯</Label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground/35"
                    />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      autoFocus
                      dir="ltr"
                      placeholder="Ø­Ø¯Ø§Ù‚Ù„ Û¸ Ú©Ø§Ø±Ø§Ú©ØªØ±"
                      error={!!errors.password}
                      aria-invalid={!!errors.password}
                      aria-describedby="password-hint"
                      className="pr-10 pl-11 text-left placeholder:text-right"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={
                        showPassword ? "Ù¾Ù†Ù‡Ø§Ù† Ú©Ø±Ø¯Ù† Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±" : "Ù†Ù…Ø§ÛŒØ´ Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±"
                      }
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <PasswordStrength password={password ?? ""} />

                  {errors.password ? (
                    <p
                      id="password-hint"
                      className="text-xs text-destructive"
                    >
                      {errors.password.message}
                    </p>
                  ) : (
                    <p
                      id="password-hint"
                      className="text-xs text-foreground/50"
                    >
                      ØªØ±Ú©ÛŒØ¨ÛŒ Ø§Ø² Ø­Ø±ÙˆÙ Ø§Ù†Ú¯Ù„ÛŒØ³ÛŒ Ùˆ Ø¹Ø¯Ø¯ØŒ Ø­Ø¯Ø§Ù‚Ù„ Û¸ Ú©Ø§Ø±Ø§Ú©ØªØ±
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Ø¯Ø± Ø­Ø§Ù„ Ø°Ø®ÛŒØ±Ù‡â€¦
                    </>
                  ) : (
                    "Ø°Ø®ÛŒØ±Ù‡ Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±"
                  )}
                </Button>
              </form>
            </div>
          </>
        )}
      </div>

      {view === "form" && (
        <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-foreground/45">
          <ShieldCheck size={14} />
          Ø¨Ø¹Ø¯ Ø§Ø² ØªØºÛŒÛŒØ± Ø±Ù…Ø²ØŒ Ø±Ù…Ø² Ù‚Ø¨Ù„ÛŒ Ø¯ÛŒÚ¯Ø± Ù…Ø¹ØªØ¨Ø± Ù†Ø®ÙˆØ§Ù‡Ø¯ Ø¨ÙˆØ¯
        </p>
      )}
    </div>
  );
}

