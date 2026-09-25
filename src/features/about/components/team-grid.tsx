import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { team } from "../api/moke-data";

export function TeamGrid() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading align="center" eyebrow="تیم ما" title="آدم‌های پشت هلپر" />

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {team.map((member) => (
            <li key={member.name} className="flex flex-col items-center text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {member.name.charAt(0)}
              </span>
              <p className="mt-3 text-sm font-semibold text-foreground">{member.name}</p>
              <p className="mt-0.5 text-xs text-foreground/55">{member.role}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}