import {
  ProviderProfile,
  ProviderWorkingHour,
  VerificationDoc,
} from "../types/provider.types";

export type CompletionItem = {
  id: string;
  label: string;
  weight: number;
  done: boolean;
  anchor: string;
};

export type CompletionProviderInput = {
  bio?: string | null;
  skills?: Array<string | { name?: string }>;
  avatarUrl?: string | null;
};

export function getProfileCompletion(
  provider: CompletionProviderInput,
  verificationDocs: VerificationDoc[],
  workingHours: ProviderWorkingHour[],
) {
  const docVerified = (type: string) =>
    verificationDocs.some((d) => d.type === type && d.status === "verified");

  const skills = Array.isArray(provider.skills) ? provider.skills : [];

  const items: CompletionItem[] = [
    {
      id: "bio",
      label: "نوشتن معرفی (حداقل ۵۰ کاراکتر)",
      weight: 15,
      done: (provider.bio?.trim().length ?? 0) >= 50,
      anchor: "bio",
    },
    {
      id: "skills",
      label: "افزودن حداقل ۳ تخصص",
      weight: 10,
      done: skills.length >= 3,
      anchor: "skills",
    },
    {
      id: "working-hours",
      label: "تعیین ساعات کاری",
      weight: 10,
      done: workingHours.some((w) => w.isActive),
      anchor: "availability",
    },
    {
      id: "avatar",
      label: "آپلود عکس پروفایل",
      weight: 10,
      done: !!provider.avatarUrl,
      anchor: "avatar",
    },
    {
      id: "national-id",
      label: "تأیید کارت ملی",
      weight: 15,
      done: docVerified("NATIONAL_CARD"),
      anchor: "documents",
    },
  ];

  const percent = items.reduce((sum, i) => sum + (i.done ? i.weight : 0), 0);

  return { percent, items };
}
