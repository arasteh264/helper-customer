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
  label: string;
  description: string;
  status: VerificationStatus;
  /** دلیل رد شدن (فقط برای status = rejected) */
  note?: string;
}

export type JobStatus =
  | "new"
  | "accepted"
  | "awaiting_payment"
  | "in_progress"
  | "awaiting_confirmation"
  | "disputed"
  | "completed"
  | "cancelled"
  | "declined";

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
  proposedPriceToman?: number;
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  customerConfirmed?: boolean;
  customerConfirmedAt?: string | null;
  status: JobStatus;
  note?: string;
  images?: string[];
  disputeReason?: string | null;
  disputeDescription?: string | null;
  disputeResolved?: boolean;
  disputeResolution?: "PROVIDER" | "BUYER" | null;
  disputeResolutionNote?: string | null;
  disputeMessages?: {
    id: string;
    body: string;
    createdAt: string;
    authorName: string;
    authorRole: string;
  }[];
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
  grossEarnings?: number | null;
  netEarnings?: number | null;
  commissionAmount?: number | null;
  commissionRate: number; // درصد
  minWithdrawal: number;
  monthly: { label: string; amount: number }[];
  bank: BankAccount | null;
}
