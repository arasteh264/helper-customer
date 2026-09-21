import type { BadgeTone } from "../components/ui/status-badge";
import { JobStatus, TransactionStatus, TransactionType, VerificationStatus } from "../types/types";


export const JOB_STATUS: Record<JobStatus, { label: string; tone: BadgeTone }> = {
  new: { label: "درخواست جدید", tone: "info" },
  accepted: { label: "پذیرفته‌شده", tone: "warning" },
  in_progress: { label: "در حال انجام", tone: "warning" },
  completed: { label: "تکمیل‌شده", tone: "success" },
  cancelled: { label: "لغوشده", tone: "neutral" },
};

export const VERIFICATION_STATUS: Record<VerificationStatus, { label: string; tone: BadgeTone }> = {
  verified: { label: "تأییدشده", tone: "success" },
  pending: { label: "در حال بررسی", tone: "warning" },
  rejected: { label: "ردشده", tone: "danger" },
  missing: { label: "بارگذاری نشده", tone: "neutral" },
};

export const TRANSACTION_TYPE: Record<TransactionType, string> = {
  earning: "درآمد",
  withdrawal: "برداشت",
  commission: "کارمزد",
  refund: "بازگشت وجه",
};

export const TRANSACTION_STATUS: Record<TransactionStatus, { label: string; tone: BadgeTone }> = {
  completed: { label: "انجام‌شده", tone: "success" },
  pending: { label: "در انتظار تسویه", tone: "warning" },
  failed: { label: "ناموفق", tone: "danger" },
};