"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleHelp,
  FileCheck2,
  FileUp,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  Navigation,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { FilePreview } from "@/src/components/shared/file-preview";
import { providerApi } from "@/src/features/provider/api/provider.api";
import { uploadVerificationDocument } from "@/src/features/provider/api/documents";
import type {
  ProviderOnboardingValues,
  ProviderSpecialty,
  ProviderSpecialtyGroup,
} from "@/src/features/provider/types/provider.types";
import { requestApi } from "@/src/features/request/api/request.api";
import { normalizeError } from "@/src/lib/api/error";
import { toEnglishDigits } from "@/src/utils/format";
import { FILE_RULES, validateFile } from "@/src/utils/file-validation";

type OnboardingFormValues = Omit<
  ProviderOnboardingValues,
  "token" | "serviceAreaLatitude" | "serviceAreaLongitude" | "serviceAreaRadiusKm"
> & {
  serviceAreaLatitude: string;
  serviceAreaLongitude: string;
  serviceAreaRadiusKm: string;
};

type FieldName = keyof OnboardingFormValues | "coordinates";
type FieldErrors = Partial<Record<FieldName, string>>;
type ProviderDocumentType =
  | "NATIONAL_CARD"
  | "BUSINESS_LICENSE"
  | "CERTIFICATE"
  | "COMMITMENT_LETTER"
  | "CRIMINAL_RECORD";
type DocumentUploadState = {
  file: File | null;
  status: "idle" | "uploading" | "uploaded" | "error";
  progress: number;
  error?: string;
};

const requiredDocuments: {
  type: ProviderDocumentType;
  label: string;
  description: string;
}[] = [
  {
    type: "NATIONAL_CARD",
    label: "کارت ملی",
    description: "تصویر واضح از روی کارت ملی",
  },
  {
    type: "BUSINESS_LICENSE",
    label: "مجوز کسب‌وکار",
    description: "مجوز یا پروانه‌ی فعالیت",
  },
  {
    type: "CERTIFICATE",
    label: "مدرک یا گواهی مهارت",
    description: "گواهینامه‌ی فنی‌وحرفه‌ای یا مدرک مرتبط با تخصص",
  },
  {
    type: "COMMITMENT_LETTER",
    label: "تعهدنامه",
    description: "تعهدنامه‌ی تکمیل‌شده و امضاشده",
  },
  {
    type: "CRIMINAL_RECORD",
    label: "گواهی عدم سوءپیشینه",
    description: "گواهی معتبر عدم سوءپیشینه",
  },
];

const initialDocumentUploads: Record<
  ProviderDocumentType,
  DocumentUploadState
> = {
  NATIONAL_CARD: { file: null, status: "idle", progress: 0 },
  BUSINESS_LICENSE: { file: null, status: "idle", progress: 0 },
  CERTIFICATE: { file: null, status: "idle", progress: 0 },
  COMMITMENT_LETTER: { file: null, status: "idle", progress: 0 },
  CRIMINAL_RECORD: { file: null, status: "idle", progress: 0 },
};

const steps = [
  { label: "اطلاعات حساب", icon: UserRound },
  { label: "تخصص و مهارت", icon: Wrench },
  { label: "نشانی و محدوده", icon: MapPin },
  { label: "مدارک", icon: FileCheck2 },
];

const initialValues: OnboardingFormValues = {
  name: "",
  email: "",
  password: "",
  bio: "",
  specialtyIds: [],
  skills: [],
  providerAddress: "",
  providerAddressType: "HOME",
  serviceAreaLatitude: "",
  serviceAreaLongitude: "",
  serviceAreaRadiusKm: "10",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold tracking-wide text-primary">
        {eyebrow}
      </p>
      <h2 id={id} className="text-xl font-bold text-foreground sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-foreground/60">{description}</p>
    </div>
  );
}

export function ProviderOnboardingForm({ token }: { token?: string }) {
  const [values, setValues] = useState(initialValues);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [documentUploads, setDocumentUploads] = useState(initialDocumentUploads);
  const [showPassword, setShowPassword] = useState(false);
  const [skillDraft, setSkillDraft] = useState("");
  const [groups, setGroups] = useState<ProviderSpecialtyGroup[]>([]);
  const [specialties, setSpecialties] = useState<ProviderSpecialty[]>([]);
  const [specialtiesLoading, setSpecialtiesLoading] = useState(true);
  const [specialtiesError, setSpecialtiesError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSpecialties() {
      setSpecialtiesLoading(true);
      setSpecialtiesError(null);

      try {
        const groupsResponse = await requestApi.getSpecialtyGroups();
        const specialtyGroups = await Promise.all(
          groupsResponse.map(async (group) => ({
            group,
            specialties: await requestApi.getSpecialtyGroupSpecialties(group.id),
          })),
        );

        if (!active) return;
        setGroups(groupsResponse);
        setSpecialties(
          specialtyGroups.flatMap(({ group, specialties: items }) =>
            items.map((specialty) => ({
              ...specialty,
              groupId: group.id,
              groupName: group.name,
            })),
          ),
        );
      } catch (error) {
        if (active) {
          setSpecialtiesError(
            normalizeError(error).message ||
              "دریافت فهرست تخصص‌ها انجام نشد.",
          );
        }
      } finally {
        if (active) setSpecialtiesLoading(false);
      }
    }

    void loadSpecialties();
    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const setField = <K extends keyof OnboardingFormValues>(
    key: K,
    value: OnboardingFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setServerError(null);
  };

  const validateStep = (stepToValidate: number): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (stepToValidate === 0) {
      if (values.name.trim().length < 2) {
        nextErrors.name = "نام و نام خانوادگی را وارد کنید.";
      }
      const email = values.email?.trim() ?? "";
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        nextErrors.email = "یک نشانی ایمیل معتبر وارد کنید.";
      }
      if (values.password.length < 8) {
        nextErrors.password = "رمز عبور باید دست‌کم ۸ نویسه باشد.";
      }
    }

    if (stepToValidate === 1) {
      if (values.specialtyIds.length === 0) {
        nextErrors.specialtyIds = "دست‌کم یک تخصص انتخاب کنید.";
      }
      if (values.skills.length === 0) {
        nextErrors.skills = "دست‌کم یک مهارت اضافه کنید.";
      }
    }

    if (stepToValidate === 2) {
      if (values.providerAddress.trim().length < 5) {
        nextErrors.providerAddress =
          "نشانی کامل را وارد کنید (حداقل ۵ نویسه).";
      }

      const radius = Number(values.serviceAreaRadiusKm);
      if (
        !values.serviceAreaRadiusKm.trim() ||
        !Number.isFinite(radius) ||
        radius < 1 ||
        radius > 200
      ) {
        nextErrors.serviceAreaRadiusKm =
          "شعاع خدمت‌رسانی باید بین ۱ تا ۲۰۰ کیلومتر باشد.";
      }

      const hasLatitude = values.serviceAreaLatitude.trim() !== "";
      const hasLongitude = values.serviceAreaLongitude.trim() !== "";
      const latitude = Number(values.serviceAreaLatitude);
      const longitude = Number(values.serviceAreaLongitude);
      if (hasLatitude !== hasLongitude) {
        nextErrors.coordinates = "هر دو مختصات را وارد کنید یا هر دو را خالی بگذارید.";
      } else if (
        hasLatitude &&
        (!Number.isFinite(latitude) ||
          latitude < -90 ||
          latitude > 90 ||
          !Number.isFinite(longitude) ||
          longitude < -180 ||
          longitude > 180)
      ) {
        nextErrors.coordinates = "مختصات واردشده معتبر نیست.";
      }
    }

    return nextErrors;
  };

  const addSkills = (input: string) => {
    const additions = input
      .split(/[,\n،]/)
      .map((skill) => skill.trim())
      .filter(Boolean);
    if (additions.length === 0) return;

    const seen = new Set(values.skills.map((skill) => skill.toLocaleLowerCase()));
    const unique = additions.filter((skill) => {
      const normalized = skill.toLocaleLowerCase();
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
    setField("skills", [...values.skills, ...unique]);
    setSkillDraft("");
  };

  const toggleSpecialty = (specialtyId: string) => {
    const selected = values.specialtyIds.includes(specialtyId);
    setField(
      "specialtyIds",
      selected
        ? values.specialtyIds.filter((id) => id !== specialtyId)
        : [...values.specialtyIds, specialtyId],
    );
  };

  const requestCurrentLocation = () => {
    setLocationMessage(null);
    if (!navigator.geolocation) {
      setLocationMessage("این مرورگر از تعیین موقعیت مکانی پشتیبانی نمی‌کند.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setField(
          "serviceAreaLatitude",
          String(Number(position.coords.latitude.toFixed(6))),
        );
        setField(
          "serviceAreaLongitude",
          String(Number(position.coords.longitude.toFixed(6))),
        );
        setLocationMessage("موقعیت مکانی با موفقیت ثبت شد.");
        setLocating(false);
      },
      () => {
        setLocationMessage(
          "دریافت موقعیت انجام نشد؛ اجازه‌ی دسترسی را بررسی کنید یا مختصات را دستی وارد کنید.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    );
  };

  const updateDocument = (
    type: ProviderDocumentType,
    update: Partial<DocumentUploadState>,
  ) => {
    setDocumentUploads((current) => ({
      ...current,
      [type]: { ...current[type], ...update },
    }));
  };

  const uploadDocuments = async () => {
    if (!accessToken || submitting) return;

    const missingDocuments = requiredDocuments.filter(
      ({ type }) =>
        documentUploads[type].status !== "uploaded" &&
        !documentUploads[type].file,
    );
    if (missingDocuments.length > 0) {
      setDocumentUploads((current) => {
        const next = { ...current };
        for (const { type } of missingDocuments) {
          next[type] = {
            ...next[type],
            status: "error",
            error: "بارگذاری این مدرک الزامی است.",
          };
        }
        return next;
      });
      return;
    }

    const pendingDocuments = requiredDocuments.filter(
      ({ type }) =>
        documentUploads[type].status !== "uploaded" &&
        documentUploads[type].file !== null,
    );
    const failedDocuments = new Set<ProviderDocumentType>();
    setSubmitting(true);

    await Promise.all(
      pendingDocuments.map(async ({ type }) => {
        const file = documentUploads[type].file;
        if (!file) return;
        updateDocument(type, {
          status: "uploading",
          progress: 0,
          error: undefined,
        });
        try {
          await uploadVerificationDocument(type, file, accessToken, (progress) =>
            updateDocument(type, { progress }),
          );
          updateDocument(type, {
            status: "uploaded",
            progress: 100,
            error: undefined,
          });
        } catch (error) {
          failedDocuments.add(type);
          updateDocument(type, {
            status: "error",
            error:
              normalizeError(error).message ||
              "بارگذاری انجام نشد؛ دوباره تلاش کنید.",
          });
        }
      }),
    );

    setSubmitting(false);
    if (failedDocuments.size === 0) {
      setAccessToken(null);
      setCompleted(true);
      return;
    }

    setServerError(
      "بارگذاری بعضی از مدارک انجام نشد؛ موارد ناموفق را دوباره ارسال کنید.",
    );
  };

  const submit = async () => {
    if (!token || submitting) return;

    if (step === 3) {
      await uploadDocuments();
      return;
    }

    const validationErrors = validateStep(step);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await providerApi.completeOnboarding({
        token,
        name: values.name.trim(),
        ...(values.email?.trim() ? { email: values.email.trim() } : {}),
        password: values.password,
        bio: values.bio.trim(),
        specialtyIds: values.specialtyIds,
        skills: values.skills,
        providerAddress: values.providerAddress.trim(),
        providerAddressType: values.providerAddressType,
        serviceAreaLatitude:
          values.serviceAreaLatitude.trim() === ""
            ? null
            : Number(values.serviceAreaLatitude),
        serviceAreaLongitude:
          values.serviceAreaLongitude.trim() === ""
            ? null
            : Number(values.serviceAreaLongitude),
        serviceAreaRadiusKm: Number(values.serviceAreaRadiusKm),
      });
      if (!response.accessToken) {
        throw new Error("دسترسی لازم برای بارگذاری مدارک دریافت نشد.");
      }
      setValues((current) => ({ ...current, password: "" }));
      setAccessToken(response.accessToken);
      setStep(3);
    } catch (error) {
      setServerError(
        normalizeError(error).message ||
          "ثبت اطلاعات انجام نشد؛ لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentSpecialtyIds = new Set(specialties.map(({ id }) => id));
  const selectedSpecialties = values.specialtyIds.filter((id) =>
    currentSpecialtyIds.has(id),
  );

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#f5f8f7] px-4 py-6 text-foreground sm:px-6 sm:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-36 left-[-6rem] h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[-5rem] h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <header className="mb-6 flex items-center justify-between gap-3 sm:mb-9">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="هلپا۲۴، صفحه اصلی"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <span className="text-lg font-extrabold text-foreground">هلپا۲۴</span>
          </Link>
          <Link
            href="/login"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-foreground/65 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            ورود به حساب
          </Link>
        </header>

        <div className="overflow-hidden rounded-[1.75rem] border border-foreground/10 bg-card shadow-[0_24px_80px_-40px_rgba(15,52,43,0.35)]">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-[#123f3b] px-5 py-7 text-white sm:px-9 sm:py-9">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 -top-16 h-48 w-48 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-1 top-6 h-32 w-32 rounded-full border border-white/10"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="max-w-xl">
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  <ShieldCheck size={14} aria-hidden="true" />
                  دعوت‌نامه‌ی همکاری
                </p>
                <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                  به خانواده‌ی هلپا۲۴ خوش آمدید
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                  چند قدم کوتاه تا ساخت حساب ارائه‌دهندگی و معرفی خدمات شما.
                </p>
              </div>
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:flex">
                <Sparkles size={25} aria-hidden="true" />
              </div>
            </div>
          </div>

          {!token ? (
            <div
              role="alert"
              className="px-5 py-12 text-center sm:px-10 sm:py-16"
            >
              <CircleHelp
                size={38}
                className="mx-auto mb-4 text-amber-600"
                aria-hidden="true"
              />
              <h2 className="text-xl font-bold">پیوند دعوت معتبر نیست</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground/60">
                برای تکمیل ثبت‌نام باید از پیوندی که از طریق پیامک دریافت
                کرده‌اید وارد شوید. اگر قبلاً ثبت‌نام کرده‌اید، وارد حساب خود
                شوید.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                رفتن به صفحه ورود
              </Link>
            </div>
          ) : completed ? (
            <div
              role="status"
              className="px-5 py-12 text-center sm:px-10 sm:py-16"
            >
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 size={34} aria-hidden="true" />
              </span>
              <p className="mb-2 text-sm font-semibold text-primary">
                ثبت‌نام با موفقیت انجام شد
              </p>
              <h2 className="text-2xl font-extrabold">
                حساب ارائه‌دهندگی شما آماده است
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-foreground/60">
                اطلاعات شما ثبت شد. برای ورود و ادامه‌ی کار، از ایمیل و رمز
                عبوری که انتخاب کردید استفاده کنید.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-base font-medium text-primary-foreground shadow-lg shadow-primary/15 transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                ورود به حساب
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="border-b border-foreground/5 px-5 py-5 sm:px-9 sm:py-6">
                <ol
                  aria-label="مراحل تکمیل ثبت‌نام"
                  className="grid grid-cols-4 gap-2 sm:gap-4"
                >
                  {steps.map(({ label, icon: Icon }, index) => {
                    const isDone = index < step;
                    const isCurrent = index === step;
                    return (
                      <li
                        key={label}
                        aria-current={isCurrent ? "step" : undefined}
                        className="min-w-0"
                      >
                        <div
                          className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl border transition-colors sm:h-10 sm:w-10 ${
                            isDone
                              ? "border-primary bg-primary text-white"
                              : isCurrent
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-foreground/10 bg-foreground/[0.03] text-foreground/40"
                          }`}
                        >
                          {isDone ? (
                            <Check size={17} aria-hidden="true" />
                          ) : (
                            <Icon size={17} aria-hidden="true" />
                          )}
                        </div>
                        <p
                          className={`truncate text-[11px] font-medium sm:text-sm ${
                            isCurrent || isDone
                              ? "text-foreground"
                              : "text-foreground/45"
                          }`}
                        >
                          {label}
                        </p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-foreground/5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              index <= step ? "w-full bg-primary" : "w-0"
                            }`}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <form
                className="px-5 py-6 sm:px-9 sm:py-8"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
              >
                {serverError && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
                  >
                    {serverError}
                  </div>
                )}

                {step === 0 && (
                  <section aria-labelledby="account-step-heading">
                    <SectionHeading
                      id="account-step-heading"
                      eyebrow="مرحله ۱ از ۴"
                      title="حساب کاربری‌تان را بسازید"
                      description="اطلاعات ورود شما محرمانه است و فقط برای دسترسی به پنل ارائه‌دهندگی استفاده می‌شود."
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label
                          htmlFor="provider-name"
                          className="text-sm font-medium"
                        >
                          نام و نام خانوادگی
                        </label>
                        <Input
                          id="provider-name"
                          autoComplete="name"
                          value={values.name}
                          onChange={(event) =>
                            setField("name", event.currentTarget.value)
                          }
                          placeholder="مثلاً علی رضایی"
                          error={!!errors.name}
                          aria-invalid={!!errors.name}
                          aria-describedby={
                            errors.name ? "provider-name-error" : undefined
                          }
                        />
                        <FieldError
                          id="provider-name-error"
                          message={errors.name}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="provider-email"
                          className="text-sm font-medium"
                        >
                          ایمیل <span className="text-xs font-normal text-foreground/45">(اختیاری)</span>
                        </label>
                        <Input
                          id="provider-email"
                          type="email"
                          dir="ltr"
                          autoComplete="email"
                          inputMode="email"
                          value={values.email}
                          onChange={(event) =>
                            setField("email", event.currentTarget.value)
                          }
                          placeholder="name@example.com"
                          error={!!errors.email}
                          aria-invalid={!!errors.email}
                          aria-describedby={
                            errors.email ? "provider-email-error" : undefined
                          }
                        />
                        <FieldError
                          id="provider-email-error"
                          message={errors.email}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label
                          htmlFor="provider-password"
                          className="text-sm font-medium"
                        >
                          رمز عبور
                        </label>
                        <div className="relative">
                          <Input
                            id="provider-password"
                            type={showPassword ? "text" : "password"}
                            dir="ltr"
                            autoComplete="new-password"
                            value={values.password}
                            onChange={(event) =>
                              setField("password", event.currentTarget.value)
                            }
                            placeholder="حداقل ۸ نویسه"
                            error={!!errors.password}
                            aria-invalid={!!errors.password}
                            aria-describedby={
                              errors.password
                                ? "provider-password-error"
                                : "provider-password-hint"
                            }
                            className="pl-16"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((shown) => !shown)}
                            className="absolute inset-y-0 left-3 rounded px-1 text-xs font-medium text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={
                              showPassword ? "پنهان کردن رمز" : "نمایش رمز"
                            }
                          >
                            {showPassword ? "پنهان" : "نمایش"}
                          </button>
                        </div>
                        {errors.password ? (
                          <FieldError
                            id="provider-password-error"
                            message={errors.password}
                          />
                        ) : (
                          <p
                            id="provider-password-hint"
                            className="text-xs text-foreground/45"
                          >
                            رمز عبور باید دست‌کم ۸ نویسه باشد.
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-5 flex items-center gap-2 text-xs text-foreground/50">
                      <LockKeyhole
                        size={15}
                        className="shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      رمز عبور فقط برای ساخت حساب ارسال می‌شود و در مرورگر
                      ذخیره نخواهد شد.
                    </p>
                  </section>
                )}

                {step === 1 && (
                  <section aria-labelledby="expertise-step-heading">
                    <SectionHeading
                      id="expertise-step-heading"
                      eyebrow="مرحله ۲ از ۴"
                      title="خدماتی که ارائه می‌کنید"
                      description="تخصص‌های مرتبط و مهارت‌های اصلی‌تان را انتخاب کنید تا مشتری‌ها راحت‌تر شما را پیدا کنند."
                    />

                    <fieldset
                      aria-invalid={!!errors.specialtyIds}
                      aria-describedby={
                        errors.specialtyIds
                          ? "provider-specialties-error"
                          : undefined
                      }
                    >
                      <legend className="mb-2 text-sm font-semibold">
                        انتخاب تخصص‌ها
                        <span className="mr-1 text-destructive">*</span>
                      </legend>
                      {specialtiesLoading ? (
                        <div
                          role="status"
                          className="flex items-center gap-2 rounded-xl bg-foreground/[0.03] px-4 py-5 text-sm text-foreground/55"
                        >
                          <LoaderCircle
                            size={18}
                            className="animate-spin text-primary"
                            aria-hidden="true"
                          />
                          در حال دریافت تخصص‌ها…
                        </div>
                      ) : specialtiesError ? (
                        <div
                          role="alert"
                          className="rounded-xl border border-destructive/20 bg-destructive/5 p-4"
                        >
                          <p className="text-sm leading-6 text-destructive">
                            {specialtiesError}
                          </p>
                          <button
                            type="button"
                            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
                            className="mt-2 rounded text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            تلاش دوباره
                          </button>
                        </div>
                      ) : specialties.length === 0 ? (
                        <p
                          role="status"
                          className="rounded-xl bg-foreground/[0.03] px-4 py-5 text-sm leading-6 text-foreground/60"
                        >
                          هنوز تخصصی برای انتخاب ثبت نشده است. کمی بعد دوباره
 تلاش کنید.
                        </p>
                      ) : (
                        <div className="max-h-72 space-y-4 overflow-y-auto rounded-xl border border-foreground/10 p-3 sm:p-4">
                          {groups.map((group) => {
                            const groupSpecialties = specialties.filter(
                              (specialty) => specialty.groupId === group.id,
                            );
                            if (groupSpecialties.length === 0) return null;
                            return (
                              <div key={group.id}>
                                <h3 className="mb-2 text-xs font-semibold text-foreground/50">
                                  {group.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {groupSpecialties.map((specialty) => {
                                    const selected =
                                      values.specialtyIds.includes(
                                        specialty.id,
                                      );
                                    return (
                                      <button
                                        key={specialty.id}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                          toggleSpecialty(specialty.id)
                                        }
                                        className={`inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                          selected
                                            ? "border-primary bg-primary/10 font-semibold text-primary"
                                            : "border-foreground/10 bg-background text-foreground/75 hover:border-primary/40"
                                        }`}
                                      >
                                        {selected && (
                                          <Check
                                            size={14}
                                            aria-hidden="true"
                                          />
                                        )}
                                        {specialty.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      {selectedSpecialties.length > 0 && (
                        <p
                          className="mt-2 text-xs text-foreground/50"
                          aria-live="polite"
                        >
                          {selectedSpecialties.length} تخصص انتخاب شده
                        </p>
                      )}
                      <FieldError
                        id="provider-specialties-error"
                        message={errors.specialtyIds}
                      />
                    </fieldset>

                    <fieldset
                      className="mt-6"
                      aria-invalid={!!errors.skills}
                      aria-describedby={
                        errors.skills ? "provider-skills-error" : undefined
                      }
                    >
                      <legend className="mb-2 text-sm font-semibold">
                        مهارت‌ها
                        <span className="mr-1 text-destructive">*</span>
                      </legend>
                      <div className="flex gap-2">
                        <Input
                          id="provider-skill-draft"
                          value={skillDraft}
                          onChange={(event) =>
                            setSkillDraft(event.currentTarget.value)
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" ||
                              event.key === "," ||
                              event.key === "،"
                            ) {
                              event.preventDefault();
                              addSkills(skillDraft);
                            }
                          }}
                          placeholder="مهارت را بنویسید و Enter بزنید"
                          aria-describedby="provider-skills-hint"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addSkills(skillDraft)}
                          disabled={!skillDraft.trim()}
                        >
                          افزودن
                        </Button>
                      </div>
                      <p
                        id="provider-skills-hint"
                        className="mt-2 text-xs text-foreground/45"
                      >
                        برای نمونه: نصب، تعمیر، عیب‌یابی. برای افزودن چند مورد
                        از ویرگول استفاده کنید.
                      </p>
                      {values.skills.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {values.skills.map((skill) => (
                            <li key={skill}>
                              <button
                                type="button"
                                onClick={() =>
                                  setField(
                                    "skills",
                                    values.skills.filter(
                                      (item) => item !== skill,
                                    ),
                                  )
                                }
                                aria-label={`حذف مهارت ${skill}`}
                                className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-secondary px-3 text-sm text-secondary-foreground transition-colors hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                {skill}
                                <span aria-hidden="true">×</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <FieldError
                        id="provider-skills-error"
                        message={errors.skills}
                      />
                    </fieldset>

                    <div className="mt-6 space-y-1.5">
                      <label
                        htmlFor="provider-bio"
                        className="text-sm font-semibold"
                      >
                        معرفی کوتاه <span className="text-foreground/40">(اختیاری)</span>
                      </label>
                      <textarea
                        id="provider-bio"
                        rows={3}
                        maxLength={1000}
                        value={values.bio}
                        onChange={(event) =>
                          setField("bio", event.currentTarget.value)
                        }
                        placeholder="کمی درباره تجربه و شیوه کارتان بنویسید"
                        className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm leading-6 text-foreground outline-none placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
                      />
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section aria-labelledby="location-step-heading">
                    <SectionHeading
                      id="location-step-heading"
                      eyebrow="مرحله ۳ از ۴"
                      title="نشانی و محدوده‌ی خدمت‌رسانی"
                      description="نشانی شما برای هماهنگی‌های داخلی است و در پروفایل عمومی نمایش داده نمی‌شود."
                    />

                    <fieldset>
                      <legend className="mb-2 text-sm font-semibold">
                        این نشانی مربوط به کجاست؟
                      </legend>
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          [
                            ["HOME", "منزل", "نشانی محل سکونت"],
                            ["BUSINESS", "محل کسب", "نشانی محل کار"],
                          ] as const
                        ).map(([type, label, detail]) => {
                          const selected = values.providerAddressType === type;
                          return (
                            <button
                              key={type}
                              type="button"
                              aria-pressed={selected}
                              onClick={() =>
                                setField("providerAddressType", type)
                              }
                              className={`rounded-xl border p-3 text-right transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:p-4 ${
                                selected
                                  ? "border-primary bg-primary/[0.06]"
                                  : "border-foreground/10 hover:border-primary/40"
                              }`}
                            >
                              <span className="block text-sm font-semibold">
                                {label}
                              </span>
                              <span className="mt-1 block text-xs text-foreground/50">
                                {detail}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div className="mt-5 space-y-1.5">
                      <label
                        htmlFor="provider-address"
                        className="text-sm font-semibold"
                      >
                        نشانی کامل
                        <span className="mr-1 text-destructive">*</span>
                      </label>
                      <textarea
                        id="provider-address"
                        rows={3}
                        maxLength={500}
                        value={values.providerAddress}
                        onChange={(event) =>
                          setField("providerAddress", event.currentTarget.value)
                        }
                        placeholder="استان، شهر، خیابان، کوچه و پلاک"
                        aria-invalid={!!errors.providerAddress}
                        aria-describedby={
                          errors.providerAddress
                            ? "provider-address-error"
                            : "provider-address-hint"
                        }
                        className={`w-full resize-y rounded-xl border bg-background px-3 py-2.5 text-sm leading-6 outline-none placeholder:text-foreground/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
                          errors.providerAddress
                            ? "border-destructive"
                            : "border-border"
                        }`}
                      />
                      {errors.providerAddress ? (
                        <FieldError
                          id="provider-address-error"
                          message={errors.providerAddress}
                        />
                      ) : (
                        <p
                          id="provider-address-hint"
                          className="flex items-center gap-1.5 text-xs text-foreground/45"
                        >
                          <LockKeyhole size={13} aria-hidden="true" />
                          نشانی محرمانه است و برای مشتری‌ها نمایش داده نمی‌شود.
                        </p>
                      )}
                    </div>

                    <div className="mt-6 space-y-2">
                      <label
                        htmlFor="provider-service-radius"
                        className="text-sm font-semibold"
                      >
                        شعاع خدمت‌رسانی (کیلومتر)
                        <span className="mr-1 text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="provider-service-radius"
                          type="text"
                          inputMode="numeric"
                          value={values.serviceAreaRadiusKm}
                          onChange={(event) =>
                            setField(
                              "serviceAreaRadiusKm",
                              toEnglishDigits(event.currentTarget.value),
                            )
                          }
                          aria-invalid={!!errors.serviceAreaRadiusKm}
                          aria-describedby={
                            errors.serviceAreaRadiusKm
                              ? "provider-service-radius-error"
                              : "provider-service-radius-hint"
                          }
                          className="max-w-36"
                        />
                        <span className="text-sm text-foreground/55">
                          کیلومتر از نشانی شما
                        </span>
                      </div>
                      {errors.serviceAreaRadiusKm ? (
                        <FieldError
                          id="provider-service-radius-error"
                          message={errors.serviceAreaRadiusKm}
                        />
                      ) : (
                        <p
                          id="provider-service-radius-hint"
                          className="text-xs text-foreground/45"
                        >
                          عددی بین ۱ تا ۲۰۰ کیلومتر انتخاب کنید.
                        </p>
                      )}
                    </div>

                    <div className="mt-6 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold">
                            موقعیت روی نقشه
                            <span className="mr-1 text-xs font-normal text-foreground/40">
                              (اختیاری)
                            </span>
                          </h3>
                          <p className="mt-1 text-xs leading-5 text-foreground/50">
                            برای نمایش محدوده‌ی دقیق‌تر، موقعیت فعلی را ثبت
                            کنید.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={requestCurrentLocation}
                          disabled={locating}
                          className="gap-1.5"
                        >
                          {locating ? (
                            <LoaderCircle
                              size={15}
                              className="animate-spin"
                              aria-hidden="true"
                            />
                          ) : (
                            <Navigation size={15} aria-hidden="true" />
                          )}
                          موقعیت فعلی
                        </Button>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label
                            htmlFor="provider-latitude"
                            className="text-xs font-medium text-foreground/70"
                          >
                            عرض جغرافیایی
                          </label>
                          <Input
                            id="provider-latitude"
                            type="text"
                            inputMode="decimal"
                            dir="ltr"
                            value={values.serviceAreaLatitude}
                            onChange={(event) => {
                              setField(
                                "serviceAreaLatitude",
                                toEnglishDigits(event.currentTarget.value),
                              );
                              setErrors((current) => ({
                                ...current,
                                coordinates: undefined,
                              }));
                            }}
                            aria-invalid={!!errors.coordinates}
                            aria-describedby={
                              errors.coordinates
                                ? "provider-coordinates-error"
                                : undefined
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor="provider-longitude"
                            className="text-xs font-medium text-foreground/70"
                          >
                            طول جغرافیایی
                          </label>
                          <Input
                            id="provider-longitude"
                            type="text"
                            inputMode="decimal"
                            dir="ltr"
                            value={values.serviceAreaLongitude}
                            onChange={(event) => {
                              setField(
                                "serviceAreaLongitude",
                                toEnglishDigits(event.currentTarget.value),
                              );
                              setErrors((current) => ({
                                ...current,
                                coordinates: undefined,
                              }));
                            }}
                            aria-invalid={!!errors.coordinates}
                            aria-describedby={
                              errors.coordinates
                                ? "provider-coordinates-error"
                                : undefined
                            }
                          />
                        </div>
                      </div>
                      <FieldError
                        id="provider-coordinates-error"
                        message={errors.coordinates}
                      />
                      {locationMessage && (
                        <p
                          role="status"
                          className="mt-2 text-xs leading-5 text-foreground/60"
                        >
                          {locationMessage}
                        </p>
                      )}
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section aria-labelledby="documents-step-heading">
                    <SectionHeading
                      id="documents-step-heading"
                      eyebrow="مرحله ۴ از ۴"
                      title="مدارک موردنیاز را بارگذاری کنید"
                      description="برای تکمیل ثبت‌نام، هر پنج مدرک را انتخاب و ارسال کنید. فایل‌ها فقط برای بررسی هویت استفاده می‌شوند."
                    />

                    <div className="mb-5 rounded-xl border border-primary/15 bg-primary/[0.05] px-4 py-3 text-sm leading-6 text-foreground/70">
                      حساب شما ساخته شده است. مدارک از طریق ارتباط امن و با
                      دسترسی موقت بارگذاری می‌شوند؛ رمز عبورتان دیگر در صفحه
                      نگهداری نمی‌شود.
                    </div>

                    <ul className="space-y-3">
                      {requiredDocuments.map(({ type, label, description }) => {
                        const upload = documentUploads[type];
                        const inputId = `provider-document-${type.toLowerCase()}`;
                        return (
                          <li
                            key={type}
                            className="rounded-2xl border border-foreground/10 bg-background p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <div className="flex min-w-0 flex-1 items-start gap-3">
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                    upload.status === "uploaded"
                                      ? "bg-emerald-500/10 text-emerald-700"
                                      : upload.status === "error"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-primary/10 text-primary"
                                  }`}
                                >
                                  {upload.status === "uploaded" ? (
                                    <CheckCircle2 size={19} aria-hidden="true" />
                                  ) : upload.status === "uploading" ? (
                                    <LoaderCircle
                                      size={19}
                                      className="animate-spin"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <FileUp size={19} aria-hidden="true" />
                                  )}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-semibold">
                                    {label}
                                    <span className="mr-1 text-destructive">
                                      *
                                    </span>
                                  </h3>
                                  <p className="mt-1 text-xs leading-5 text-foreground/50">
                                    {description}
                                  </p>
                                  {upload.file && (
                                    <p
                                      className="mt-1 truncate text-xs text-foreground/60"
                                      title={upload.file.name}
                                    >
                                      {upload.file.name}
                                    </p>
                                  )}
                                  <FilePreview file={upload.file} />
                                </div>
                              </div>

                              <div className="shrink-0 sm:pr-12">
                                <input
                                  id={inputId}
                                  type="file"
                                  accept="image/*,application/pdf"
                                  aria-invalid={!!upload.error}
                                  aria-describedby={
                                    upload.error ? `${inputId}-error` : undefined
                                  }
                                  disabled={
                                    submitting || upload.status === "uploaded"
                                  }
                                  onChange={(event) => {
                                    const file = event.currentTarget.files?.[0];
                                    event.currentTarget.value = "";
                                    if (!file) return;
                                    const error = validateFile(
                                      file,
                                      FILE_RULES.document,
                                    );
                                    if (error) {
                                      updateDocument(type, {
                                        file: null,
                                        status: "error",
                                        progress: 0,
                                        error,
                                      });
                                      return;
                                    }
                                    updateDocument(type, {
                                      file,
                                      status: "idle",
                                      progress: 0,
                                      error: undefined,
                                    });
                                    setServerError(null);
                                  }}
                                  className="peer sr-only"
                                />
                                <label
                                  htmlFor={inputId}
                                  className={`peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors ${
                                    upload.status === "uploaded"
                                      ? "cursor-not-allowed border-emerald-600/20 bg-emerald-600/5 text-emerald-700"
                                      : submitting
                                        ? "cursor-not-allowed border-border text-foreground/40"
                                        : "cursor-pointer border-foreground/10 bg-card text-foreground hover:border-primary/40"
                                  }`}
                                >
                                  {upload.status === "uploaded" ? (
                                    <>
                                      <Check size={15} aria-hidden="true" />
                                      ارسال شد
                                    </>
                                  ) : (
                                    <>
                                      <FileUp size={15} aria-hidden="true" />
                                      {upload.file
                                        ? "تغییر فایل"
                                        : "انتخاب فایل"}
                                    </>
                                  )}
                                </label>
                              </div>
                            </div>

                            {upload.status === "uploading" && (
                              <div
                                className="mt-3"
                                role="status"
                                aria-label={`در حال بارگذاری ${label}`}
                              >
                                <div className="mb-1 flex justify-between text-xs text-foreground/55">
                                  <span>در حال بارگذاری…</span>
                                  <span>{upload.progress}٪</span>
                                </div>
                                <div
                                  className="h-1.5 overflow-hidden rounded-full bg-foreground/10"
                                  role="progressbar"
                                  aria-valuemin={0}
                                  aria-valuemax={100}
                                  aria-valuenow={upload.progress}
                                  aria-label={`پیشرفت بارگذاری ${label}`}
                                >
                                  <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{ width: `${upload.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {upload.status === "uploaded" && (
                              <p className="mt-2 text-xs text-emerald-700">
                                مدرک با موفقیت ارسال شد.
                              </p>
                            )}
                            {upload.error && (
                              <p
                                id={`${inputId}-error`}
                                role="alert"
                                className="mt-2 text-xs leading-5 text-destructive"
                              >
                                {upload.error}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <p className="mt-4 text-xs leading-6 text-foreground/50">
                      فرمت مجاز: تصویر یا PDF؛ حداکثر حجم هر فایل ۵ مگابایت.
                    </p>
                  </section>
                )}

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-foreground/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {step > 0 && step < 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setErrors({});
                          setStep((current) => current - 1);
                        }}
                        disabled={submitting}
                        className="w-full gap-2 sm:w-auto"
                      >
                        <ChevronLeft
                          size={17}
                          className="rotate-180"
                          aria-hidden="true"
                        />
                        مرحله قبل
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={
                      submitting ||
                      (step === 1 &&
                        (specialtiesLoading ||
                          !!specialtiesError ||
                          specialties.length === 0)) ||
                      (step === 3 && !accessToken)
                    }
                    className="w-full gap-2 shadow-lg shadow-primary/15 sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                          aria-hidden="true"
                        />
                        {step === 3
                          ? "در حال ارسال مدارک…"
                          : "در حال ثبت اطلاعات…"}
                      </>
                    ) : step === 3 ? (
                      <>
                        ارسال مدارک و تکمیل ثبت‌نام
                        <FileCheck2 size={17} aria-hidden="true" />
                      </>
                    ) : step === 2 ? (
                      <>
                        تکمیل ثبت‌نام
                        <CheckCircle2 size={17} aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        مرحله بعد
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>

        {!completed && (
          <p className="mt-5 flex items-center justify-center gap-2 px-2 text-center text-xs leading-5 text-foreground/45">
            <ShieldCheck
              size={15}
              className="shrink-0 text-primary/70"
              aria-hidden="true"
            />
            اطلاعات شما با امنیت نگهداری می‌شود و نشانی‌تان محرمانه می‌ماند.
          </p>
        )}
      </div>
    </main>
  );
}
