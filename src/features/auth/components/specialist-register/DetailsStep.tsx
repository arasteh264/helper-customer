"use client";

import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { PersonalSection } from "./PersonalSection";
import { PasswordSection } from "./PasswordSection";

interface Props {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function DetailsStep({ onSubmit }: Props) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <PersonalSection />
      <PasswordSection />

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 w-full gap-2 text-base shadow-lg shadow-primary/20"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            در حال ثبت‌نام…
          </>
        ) : (
          "ثبت‌نام و دریافت کد تأیید"
        )}
      </Button>
    </form>
  );
}
