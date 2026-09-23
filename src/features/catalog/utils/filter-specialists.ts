import type { DirectorySpecialist, SpecialistFilters } from "../types/catalog.types";

export function filterSpecialists(
  list: DirectorySpecialist[],
  filters: SpecialistFilters
): DirectorySpecialist[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = list.filter((s) => {
    if (query && !`${s.name} ${s.field}`.toLowerCase().includes(query)) return false;
    if (filters.categoryId && s.categoryId !== filters.categoryId) return false;
    if (filters.city && s.city !== filters.city) return false;
    if (s.rating < filters.minRating) return false;
    if (filters.verifiedOnly && !s.verified) return false;
    return true;
  });

  switch (filters.sort) {
    case "rating":
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case "price_asc":
      return [...filtered].sort((a, b) => a.startingPrice - b.startingPrice);
    case "price_desc":
      return [...filtered].sort((a, b) => b.startingPrice - a.startingPrice);
    default:
      // پیشنهادی: ترکیبی از امتیاز و تعداد نظرات
      return [...filtered].sort((a, b) => b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1));
  }
}