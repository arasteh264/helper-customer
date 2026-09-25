import { ProviderProfile, ProviderWorkingHour, VerificationDoc } from "../types/provider.types";

// completion.ts
export function getProfileCompletion(
  provider: ProviderProfile,
  verificationDocs: VerificationDoc[],
  workingHours: ProviderWorkingHour[],
) {
  const docVerified = (type: string) =>
    verificationDocs.some((d) => d.type === type && d.status === "APPROVED");

  const items = [
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
      done: provider.skills.length >= 3,
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

  const percent = items.reduce(
    (sum, i) => sum + (i.done ? i.weight : 0),
    0,
  );

  return { percent, items };
}