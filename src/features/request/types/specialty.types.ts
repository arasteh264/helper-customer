export type Specialty = {
  id: string;
  name: string;
  slug?: string;
  icon?: string | null;
  activeProvidersCount: number;
  pricingMode?: "QUOTE" | "HOURLY";
  hourlyRateToman?: number | null;
  hourlyUnitLabel?: string | null;
};

export type SpecialtyGroup = {
  id: string;
  name: string;
  slug?: string;
  icon?: string | null;
  specialties?: Specialty[];
};
