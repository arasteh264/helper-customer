import type {
  DirectorySpecialist,
  SpecialistFilters,
} from "../types/catalog.types";

export function filterSpecialists(
  list: DirectorySpecialist[],
  filters: SpecialistFilters,
): DirectorySpecialist[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = list.filter((s) => {
    if (query && !`${s.name} ${s.field}`.toLowerCase().includes(query))
      return false;
    if (
      filters.categoryId &&
      !(s.categoryIds?.length ? s.categoryIds : [s.categoryId]).includes(
        filters.categoryId,
      )
    ) {
      return false;
    }
    if (s.rating < filters.minRating) return false;
    if (filters.verifiedOnly && !s.verified) return false;
    return true;
  });

  switch (filters.sort) {
    case "rating":
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case "distance":
      return [...filtered].sort((a, b) => {
        if (a.distanceKm == null)
          return b.distanceKm == null ? b.rating - a.rating : 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm || b.rating - a.rating;
      });
    default:
      // پیشنهادی: ترکیبی از امتیاز و تعداد نظرات
      return [...filtered].sort(
        (a, b) =>
          b.rating * Math.log(b.reviews + 1) -
          a.rating * Math.log(a.reviews + 1),
      );
  }
}
