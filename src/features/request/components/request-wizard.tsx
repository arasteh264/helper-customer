"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import type { ServiceCategory } from "../api/request.api";
import { useNewRequest } from "../hooks/use-new-request";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { CategoryStep } from "./category-step";
import { DetailsStep } from "./details-step";
import { AddressStep } from "./address-step";
import { ScheduleStep } from "./schedule-step";
import { ReviewStep } from "./review-step";
import { SuccessScreen } from "./success-screen";

export function RequestWizard({
  categories,
  accessToken,
  preferredProviderId,
  initialCategoryName,
}: {
  categories: ServiceCategory[];
  accessToken: string;
  preferredProviderId?: string;
  initialCategoryName?: string;
}) {
  const wizard = useNewRequest(accessToken, {
    preferredProviderId,
    initialCategoryName,
  });
  const categoryName =
    categories.find((category) => category.name === wizard.draft.categoryId)
      ?.name ?? wizard.draft.categoryId;

  if (wizard.result) {
    return (
      <SuccessScreen
        code={wizard.result.code}
        requestId={wizard.result.id}
        accessToken={accessToken}
        matches={wizard.result.matches}
        initiallyInvitedProviderId={wizard.result.preferredProviderId}
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

      <div className="mt-8 rounded-2xl border border-foreground/10 bg-card p-5 sm:p-8">
        {wizard.step === "category" && (
          <CategoryStep
            value={wizard.draft.categoryId}
            categories={categories}
            onChange={(categoryId) => wizard.update({ categoryId })}
          />
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

      {/* ناوبری */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={wizard.goBack}
          disabled={wizard.isFirst}
          className="inline-flex items-center gap-1.5 rounded-xl border border-foreground/15 px-4 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={17} className="rtl:rotate-180" />
          مرحله‌ی قبل
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
            مرحله‌ی بعد
            <ChevronLeft size={17} className="rtl:rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
