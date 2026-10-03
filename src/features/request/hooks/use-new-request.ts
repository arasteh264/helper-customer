"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { requestApi } from "../api/request.api";
import type { ProviderMatch } from "../api/request.api";
import { newRequestSchema } from "../schemas/new-request.schema";
import {
  EMPTY_DRAFT,
  type NewRequestDraft,
  type WizardStepId,
} from "../types/request.types";

const STEPS: WizardStepId[] = [
  "category",
  "details",
  "address",
  "schedule",
  "review",
];

/** آیا مقادیر لازم برای رد شدن از این مرحله پر شده‌اند؟ (اعتبارسنجی کامل موقع ثبت نهایی انجام می‌شود) */
function isStepComplete(step: WizardStepId, draft: NewRequestDraft) {
  switch (step) {
    case "category":
      return !!draft.categoryId;
    case "details":
      return (
        draft.title.trim().length >= 5 && draft.description.trim().length >= 20
      );
    case "address":
      return draft.address.trim().length >= 8;
    case "schedule":
      return draft.urgency !== "scheduled" || !!draft.scheduledAt;
    default:
      return true;
  }
}

export function useNewRequest(
  accessToken: string,
  options: { preferredProviderId?: string } = {},
) {
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<NewRequestDraft>(() => ({
    ...EMPTY_DRAFT,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    code: string;
    matches: ProviderMatch[];
    preferredProviderId?: string;
  } | null>(null);

  const step = STEPS[stepIndex];
  const canGoNext = isStepComplete(step, draft);
  const isLast = stepIndex === STEPS.length - 1;
  const isFirst = stepIndex === 0;

  const update = (patch: Partial<NewRequestDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const goNext = () => {
    if (!canGoNext) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goToStep = (id: WizardStepId) => {
    const target = STEPS.indexOf(id);
    // فقط اجازه‌ی رفتن به مراحلی که پیش‌نیازشان کامل است
    const reachable = STEPS.slice(0, target).every((s) =>
      isStepComplete(s, draft),
    );
    if (reachable) setStepIndex(target);
  };

  const submit = async () => {
    const parsed = newRequestSchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ?? "لطفاً اطلاعات را کامل کنید",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestApi.submit(draft, accessToken);
      const failures = await Promise.allSettled(
        draft.photoFiles.map((file) =>
          requestApi.uploadPhoto(res.id, file, accessToken),
        ),
      );
      if (failures.some((failure) => failure.status === "rejected")) {
        toast.error("درخواست ثبت شد، اما بارگذاری بعضی عکس‌ها انجام نشد.");
      }
      let matches: ProviderMatch[] = [];
      try {
        matches = await requestApi.getMatches(res.id, accessToken);
      } catch {
        toast.error(
          "درخواست ثبت شد؛ دریافت پیشنهاد متخصصان کمی بعد دوباره انجام می‌شود.",
        );
      }
      setResult({
        id: res.id,
        code: `R-${res.id.slice(0, 8).toUpperCase()}`,
        matches,
        preferredProviderId: options.preferredProviderId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / STEPS.length) * 100),
    [stepIndex],
  );

  return {
    steps: STEPS,
    step,
    stepIndex,
    progress,
    draft,
    update,
    canGoNext,
    isFirst,
    isLast,
    goNext,
    goBack,
    goToStep,
    submit,
    submitting,
    result,
  };
}
