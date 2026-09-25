import { directorySpecialists } from "@/src/features/catalog/api/mock-data";
import { SpecialistCard } from "@/src/features/home/components/specialist-card";

export function SimilarSpecialists({
  categoryId,
  excludeId,
}: {
  categoryId: string;
  excludeId: string;
}) {
  const similar = directorySpecialists
    .filter((s) => s.categoryId === categoryId && s.id !== excludeId)
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">متخصصان مشابه</h2>
      <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {similar.map((s) => (
          <li key={s.id}>
            <SpecialistCard specialist={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}