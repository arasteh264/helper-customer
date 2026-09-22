"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import type { Address } from "@/src/features/customer/types/customer.types";
import { useNewRequest } from "../hooks/use-new-request";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { CategoryStep } from "./category-step";
import { DetailsStep } from "./details-step";
import { AddressStep } from "./address-step";
import { ScheduleStep } from "./schedule-step";
import { ReviewStep } from "./review-step";
import { SuccessScreen } from "./success-screen";

export function RequestWizard({ initialAddresses }: { initialAddresses: Address[] }) {
  const wizard = useNewRequest();

  if (wizard.result) {
    return <SuccessScreen code={wizard.result.code} requestId={wizard.result.id} />;
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
            onChange={(categoryId) => wizard.update({ categoryId })}
          />
        )}

        {wizard.step === "details" && (
          <DetailsStep draft={wizard.draft} onChange={wizard.update} />
        )}

        {wizard.step === "address" && (
          <AddressStep
            initialAddresses={initialAddresses}
            value={wizard.draft.addressId}
            onChange={(addressId) => wizard.update({ addressId })}
          />
        )}

        {wizard.step === "schedule" && (
          <ScheduleStep draft={wizard.draft} onChange={wizard.update} />
        )}

        {wizard.step === "review" && (
          <ReviewStep draft={wizard.draft} addresses={initialAddresses} />
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
            {wizard.submitting && <Loader2 size={16} className="animate-spin" />}
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