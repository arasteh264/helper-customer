import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  label: string;
  count: number;
  icon: LucideIcon;
  tint: string;
  href: string;
}

export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Specialist {
  id: string;
  name: string;
  field: string;
  rating: number;
  reviews: number;
  jobs: number;
  city: string;
  startingPrice: number;
  verified: boolean;
  image?: string;
  available?: boolean;
  distanceKm?: number | null;
  categoryId?:string
}

export interface Testimonial {
  name: string;
  city: string;
  service: string;
  text: string;
  rating: number;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}
export type CategoryDetail = {
  intro: string;
  sections: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
  startingPrice: number;
};