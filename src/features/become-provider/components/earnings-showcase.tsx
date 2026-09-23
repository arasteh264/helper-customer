import { TrendingUp } from "lucide-react";

import { Container } from "@/src/components/shared/container";
import { SectionHeading } from "@/src/components/shared/section-heading";
import { earningExamples } from "../api/mock-data";
import { formatMoney, formatNumber } from "@/src/utils/format";

export function EarningsShowcase() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="برآورد درآمد"
          title="چقدر می‌توانید درآمد داشته باشید؟"
          description="این‌ها میانگین درآمد هفتگی متخصصان فعال در هلپر است؛ درآمد واقعی شما به تعداد کارها و منطقه بستگی دارد."
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {earningExamples.map((e) => {
            const weekly = e.jobsPerWeek * e.avgPrice;
            return (
              <li key={e.field} className="rounded-2xl border border-foreground/10 bg-card p-5">
                <p className="text-sm font-semibold text-foreground">{e.field}</p>
                <p className="mt-1 text-xs text-foreground/50">
                  حدود {formatNumber(e.jobsPerWeek)} کار در هفته
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-lg font-bold text-foreground">
                  <TrendingUp size={18} className="text-green-600" />
                  {formatMoney(weekly)}
                </p>
                <p className="mt-0.5 text-[11px] text-foreground/45">درآمد تقریبی هفتگی</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}