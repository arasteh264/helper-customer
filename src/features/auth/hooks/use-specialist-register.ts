"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";
import { normalizeError } from "@/src/lib/api/error";
import {
  register as registerUser,
  resendRegistrationOtp,
} from "../api/register";
import { verifyRegistration } from "../api/verify-registration";
import { providerApi } from "@/src/features/provider/api/provider.api";
import {
  specialistRegisterSchema,
  type SpecialistRegisterValues,
} from "../schemas/specialist-register.schema";
import { useCountdown } from "./use-countdown";

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 90;

export type Step = "details" | "verify";

export function useSpecialistRegister() {
  const router = useRouter();
  const countdown = useCountdown();

  const [step, setStep] = useState<Step>("details");
  const [serverError, setServerError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);

  const form = useForm<SpecialistRegisterValues>({
    resolver: zodResolver(specialistRegisterSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      await registerUser({
        name: values.fullName,
        phone: values.mobile,
        email: values.email,
        password: values.password,
      });

      setOtp("");
      countdown.start(RESEND_SECONDS);
      setStep("verify");
      toast.success("کد تأیید به شماره شما پیامک شد");
    } catch (err) {
      const error = normalizeError(err);

      if (error.code === "DUPLICATE_PHONE") {
        form.setError("mobile", {
          message: "با این شماره قبلاً ثبت‌نام شده است. وارد شوید.",
        });
        return;
      }

      if (error.code === "DUPLICATE_EMAIL") {
        form.setError("email", {
          message: "این ایمیل قبلاً ثبت شده است.",
        });
        return;
      }

      setServerError(
        error.message || "ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  });

  const verifyCode = async (code: string) => {
    if (verifying) return;
    setServerError(null);
    setVerifying(true);

    const { mobile, password } = form.getValues();

    try {
      await verifyRegistration(mobile, code);
    } catch (err) {
      setServerError(
        normalizeError(err).message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
      );
      setOtp("");
      setVerifying(false);
      return;
    }

    try {
      const loginResult = await signIn("credentials", {
        identifier: mobile,
        password,
        redirect: false,
      });
      if (loginResult?.error) throw new Error("LOGIN_FAILED");

      const session = await getSession();
      if (!session?.accessToken) throw new Error("SESSION_UNAVAILABLE");

      await providerApi.createProfile(
        `متخصص ${form.getValues("fullName")}`,
        session.accessToken,
      );

      const refreshedLogin = await signIn("credentials", {
        identifier: mobile,
        password,
        redirect: false,
      });
      if (refreshedLogin?.error) throw new Error("SESSION_REFRESH_FAILED");

      toast.success("حساب متخصص شما ساخته شد. خوش آمدید!");
      router.push("/provider/profile");
    } catch {
      toast.error(
        "حساب شما ساخته شد، اما ورود خودکار کامل نشد. لطفاً وارد شوید.",
      );
      router.push("/login");
    } finally {
      setVerifying(false);
    }
  };

  const resendCode = async () => {
    if (countdown.secondsLeft > 0 || verifying) return;
    setServerError(null);
    try {
      await resendRegistrationOtp(form.getValues("mobile"));
      setOtp("");
      countdown.start(RESEND_SECONDS);
      toast.success("کد جدید ارسال شد");
    } catch (err) {
      setServerError(
        normalizeError(err).message ||
          "ارسال کد با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    }
  };

  const backToDetails = () => {
    setStep("details");
    setServerError(null);
    setOtp("");
  };

  const changeOtp = (value: string) => {
    setServerError(null);
    setOtp(value);
  };

  return {
    form,
    step,
    serverError,
    otp,
    verifying,
    secondsLeft: countdown.secondsLeft,
    submit,
    verifyCode,
    resendCode,
    backToDetails,
    changeOtp,
  };
}
