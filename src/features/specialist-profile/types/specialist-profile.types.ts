export interface ProfileReview {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string; // ISO
}

export interface SpecialistProfile {
  id: string;
  name: string;
  headline: string;
  field: string;
  city: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  responseRate: number; // درصد
  experienceYears: number;
  memberSince: string; // ISO
  startingPrice: number;
  bio: string;
  skills: string[];
  serviceAreas: string[];
  /** به‌جای عکس واقعی، رنگ گرادیان هر نمونه‌کار (چون تصویر واقعی نداریم) */
  portfolioTints: string[];
  availableDays: string[];
  reviews: ProfileReview[];
  /** true یعنی این پروفایل کامل و واقعی است؛ false یعنی از داده‌ی خلاصه‌ی دایرکتوری ساخته شده */
  hasFullProfile: boolean;
}