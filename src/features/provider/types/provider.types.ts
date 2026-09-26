export type VerificationStatus =
  | "verified"
  | "pending"
  | "rejected"
  | "missing";

export interface Provider {
  id: string;
  fullName: string;
  headline: string;
  bio: string;
  avatar?: string;
  city: string;
  experienceYears: number;
  startingPrice: number; // تومان
  phone: string;
  email: string;
  skills: string[];
  serviceAreas: string[];
  portfolio: string[]; // آدرس تصاویر نمونه‌کار
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  responseRate: number; // درصد
  memberSince: string; // ISO
}

export interface VerificationDoc {
  id: string;
  type?: string;
  label: string;
  description: string;
  status: VerificationStatus;
  /** دلیل رد شدن (فقط برای status = rejected) */
  note?: string;
}

export interface DaySchedule {
  id: string;
  label: string;
  enabled: boolean;
  from: string; // "08:00"
  to: string; // "18:00"
}

export type JobStatus =
  | "new"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Job {
  id: string;
  title: string;
  service: string;
  customerName: string;
  /** فقط بعد از پذیرش کار در دسترس است */
  customerPhone?: string;
  address: string;
  scheduledAt: string; // ISO
  price: number; // تومان
  status: JobStatus;
  note?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string; // ISO
  service: string;
}

export type TransactionType =
  | "earning"
  | "withdrawal"
  | "commission"
  | "refund";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string; // ISO
  description: string;
  type: TransactionType;
  /** مبلغ با علامت: مثبت = واریز به کیف پول، منفی = کسر */
  amount: number;
  status: TransactionStatus;
}

export interface BankAccount {
  bankName: string;
  holder: string;
  sheba: string; // IR + ۲۴ رقم
  verified: boolean;
}

export interface FinanceSummary {
  withdrawable: number;
  pending: number;
  totalEarned: number;
  commissionRate: number; // درصد
  minWithdrawal: number;
  monthly: { label: string; amount: number }[];
  bank: BankAccount;
}
// src/features/provider/types/provider.types.ts

export interface ProviderSkill {
  id: string;
  name: string;
}

export interface ProviderWorkingHour {
  dayOfWeek: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface ProviderProfile {
  id: string;
  bio: string | null;
  rating: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationNote: string | null;
  verifiedAt: string | null;
  isAvailable: boolean;
  avatarUrl: string | null;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  skills: ProviderSkill[];
  workingHours: ProviderWorkingHour[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProviderProfileValues {
  bio?: string;
  isAvailable?: boolean;
  workingHours?: ProviderWorkingHour[];
}
