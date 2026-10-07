import { VerificationDoc } from "../types/provider.types";

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
  providerAddress?: string | null;
};

export function getProfileCompletion(
  provider: CompletionProviderInput,
  verificationDocs: VerificationDoc[],
) {
  const docVerified = (type: string) =>
    verificationDocs.some((d) => d.type === type && d.status === "verified");

  const skills = [
    ...(Array.isArray(provider.specialties) ? provider.specialties : []),
    ...(Array.isArray(provider.skills) ? provider.skills : []),
  ];
  const uniqueSkills = new Set(
    skills.map((skill) =>
      typeof skill === "string" ? skill : (skill.name ?? ""),
    ),
  );

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
      label:
        uniqueSkills.size > 0 && uniqueSkills.size < 3
          ? `افزودن ${3 - uniqueSkills.size} تخصص دیگر`
          : "افزودن حداقل ۳ تخصص",
      weight: 20,
      done: uniqueSkills.size >= 3,
      anchor: "skills",
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
    {
      id: "private-address",
      label: "ثبت نشانی محرمانه‌ی منزل یا محل کسب",
      weight: 10,
      done: (provider.providerAddress?.trim().length ?? 0) >= 5,
      anchor: "private-address",
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
