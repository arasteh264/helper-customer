import { Container } from "@/src/components/shared/container";
import { stats } from "../api/moke-data";

export function StatsBar() {
  return (
    <section className="border-y border-foreground/10 bg-foreground/[0.03] py-10 sm:py-12">
      <Container>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <p className="text-2xl font-bold text-foreground sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs text-foreground/55 sm:text-sm">{s.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}