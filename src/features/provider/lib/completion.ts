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
  isVerified?: boolean;
  skills?: Array<string | { name?: string }>;
  specialties?: Array<string | { name?: string }>;
  avatarUrl?: string | null;
};

export function getProfileCompletion(
  provider: CompletionProviderInput,
  verificationDocs: VerificationDoc[],
  workingHours: ProviderWorkingHour[],
) {
  const docVerified = (type: string) =>
    verificationDocs.some((d) => d.type === type && d.status === "verified");

  const skills = Array.isArray(provider.specialties)
    ? provider.specialties
    : Array.isArray(provider.skills)
      ? provider.skills
      : [];

  const items: CompletionItem[] = [
    {
      id: "bio",
      label: "نوشتن معرفی (حداقل ۵۰ کاراکتر)",
      weight: 25,
      done: (provider.bio?.trim().length ?? 0) >= 50,
      anchor: "bio",
    },
    {
      id: "skills",
      label: "افزودن حداقل ۳ تخصص",
      weight: 20,
      done: skills.length >= 3,
      anchor: "skills",
    },
    {
      id: "working-hours",
      label: "تعیین ساعات کاری",
      weight: 20,
      done: workingHours.some((w) => w.isActive),
      anchor: "availability",
    },
    {
      id: "avatar",
      label: "آپلود عکس پروفایل",
      weight: 15,
      done: !!provider.avatarUrl,
      anchor: "avatar",
    },
    {
      id: "national-id",
      label: "تأیید کارت ملی",
      weight: 20,
      done: Boolean(provider.isVerified) || docVerified("NATIONAL_CARD"),
      anchor: "documents",
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = items.reduce(
    (sum, item) => sum + (item.done ? item.weight : 0),
    0,
  );
  const percent = totalWeight
    ? Math.round((completedWeight / totalWeight) * 100)
    : 0;

  return { percent, items };
}
