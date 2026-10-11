"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { useNewRequest } from "../hooks/use-new-request";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { SpecialtyStep } from "./specialty-step";
import { DetailsStep } from "./details-step";
import { AddressStep } from "./address-step";
import { ScheduleStep } from "./schedule-step";
import { ReviewStep } from "./review-step";
import { SuccessScreen } from "./success-screen";

export function RequestWizard({
  accessToken,
  preferredProviderId,
  preferredProviderName,
  providerSpecialties = [],
  initialSpecialtyId,
  initialSpecialtyName,
  initialGroupName,
}: {
  accessToken: string;
  preferredProviderId?: string;
  preferredProviderName?: string;
  providerSpecialties?: { id: string; name: string }[];
  initialSpecialtyId?: string;
  initialSpecialtyName?: string;
  initialGroupName?: string;
}) {
  const initialSpecialty =
    providerSpecialties.find(({ id }) => id === initialSpecialtyId) ??
    providerSpecialties[0];
  const [selectedSpecialtyName, setSelectedSpecialtyName] = useState(
    initialSpecialty?.name ?? initialSpecialtyName ?? "",
  );
  const stepContentRef = useRef<HTMLDivElement>(null);
  const previousStepRef = useRef(0);
  const wizard = useNewRequest(accessToken, {
    preferredProviderId,
    preferredProviderName,
    initialSpecialtyId: initialSpecialty?.id ?? initialSpecialtyId,
    skipCategoryStep: !preferredProviderId && !!initialSpecialtyId,
  });
  const categoryName = selectedSpecialtyName || wizard.draft.categoryId;

  useEffect(() => {
    if (previousStepRef.current === wizard.stepIndex) return;
    previousStepRef.current = wizard.stepIndex;
    stepContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    stepContentRef.current
      ?.querySelector<HTMLElement>("input:not([type='file']), textarea, select, button")
      ?.focus({ preventScroll: true });
  }, [wizard.stepIndex]);

  if (wizard.result) {
    return (
      <SuccessScreen
        code={wizard.result.code}
        requestId={wizard.result.id}
        initialStatus={wizard.result.status}
        accessToken={accessToken}
        matches={wizard.result.matches}
        initiallyInvitedProviderId={wizard.result.preferredProviderId}
        initiallyInvitedProviderName={wizard.result.preferredProviderName}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <WizardStepIndicator
        steps={wizard.steps}
        currentIndex={wizard.stepIndex}
        onStepClick={wizard.goToStep}
      />

      {initialGroupName && initialSpecialtyId && selectedSpecialtyName && (
        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl border border-primary/15 bg-primary/[0.045] px-4 py-3 text-sm">
          <span className="text-foreground/60">خدمت انتخاب‌شده:</span>
          <span className="font-semibold text-foreground">
            {selectedSpecialtyName}
          </span>
          {initialGroupName && (
            <span className="text-xs text-foreground/50">
              از گروه {initialGroupName}
            </span>
          )}
        </div>
      )}

      <div
        ref={stepContentRef}
        tabIndex={-1}
        className="mt-5 scroll-mt-24 rounded-2xl border border-foreground/10 bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:mt-8 sm:p-8"
      >
        {wizard.step === "category" && (
          providerSpecialties.length > 0 ? (
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                چه خدمتی از {preferredProviderName} می‌خواهید؟
              </h2>
              <p className="mt-1 text-sm text-foreground/55">
                فقط تخصص‌هایی را می‌توانید انتخاب کنید که این متخصص ارائه می‌دهد.
              </p>
              <label
                htmlFor="provider-specialty"
                className="mt-5 block text-sm font-medium text-foreground"
              >
                زمینه‌ی خدمت
              </label>
              <select
                id="provider-specialty"
                value={wizard.draft.categoryId}
                onChange={(event) => {
                  const specialty = providerSpecialties.find(
                    ({ id }) => id === event.target.value,
                  );
                  if (!specialty) return;
                  setSelectedSpecialtyName(specialty.name);
                  wizard.update({ categoryId: specialty.id });
                }}
                className="mt-2 h-12 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              >
                {providerSpecialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <SpecialtyStep
              value={wizard.draft.categoryId}
              accessToken={accessToken}
              onChange={(categoryId, name) => {
                setSelectedSpecialtyName(name);
                wizard.update({ categoryId });
              }}
            />
          )
        )}

        {wizard.step === "details" && (
          <DetailsStep
            draft={wizard.draft}
            onChange={wizard.update}
            categoryName={categoryName}
          />
        )}

        {wizard.step === "address" && (
          <AddressStep
            value={wizard.draft.address}
            plaque={wizard.draft.plaque}
            unit={wizard.draft.unit}
            latitude={wizard.draft.latitude}
            longitude={wizard.draft.longitude}
            onChange={wizard.update}
          />
        )}

        {wizard.step === "schedule" && (
          <ScheduleStep draft={wizard.draft} onChange={wizard.update} />
        )}

        {wizard.step === "review" && (
          <ReviewStep draft={wizard.draft} categoryName={categoryName} />
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={wizard.goBack}
          disabled={wizard.isFirst}
          className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          مرحله‌ قبل
                    <ChevronRight size={17} className="rtl:rotate-180" />

        </button>

        {wizard.isLast ? (
          <button
            type="button"
            onClick={wizard.submit}
            disabled={wizard.submitting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {wizard.submitting && (
              <Loader2 size={16} className="animate-spin" />
            )}
            ثبت نهایی درخواست
          </button>
        ) : (
          <button
            type="button"
            onClick={wizard.goNext}
            disabled={!wizard.canGoNext}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
                        <ChevronLeft size={17} className="rtl:rotate-180" />

            مرحله‌ی بعد
          </button>
        )}
      </div>
    </div>
  );
}
