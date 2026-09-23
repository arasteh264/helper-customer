export interface DirectorySpecialist {
  id: string;
  name: string;
  field: string;
  categoryId: string;
  city: string;
  rating: number;
  reviews: number;
  jobs: number;
  startingPrice: number;
  verified: boolean;
  image?: string;
}

export type SortOption = "recommended" | "rating" | "price_asc" | "price_desc";

export interface SpecialistFilters {
  query: string;
  categoryId: string | null;
  city: string | null;
  minRating: number;
  verifiedOnly: boolean;
  sort: SortOption;
}

export const DEFAULT_FILTERS: SpecialistFilters = {
  query: "",
  categoryId: null,
  city: null,
  minRating: 0,
  verifiedOnly: false,
  sort: "recommended",
};