import type { Metadata } from "next";

import { AboutHero } from "@/src/features/about/components/about-hero";
import { MissionSection } from "@/src/features/about/components/mission-section";
import { StatsBar } from "@/src/features/about/components/stats-bar";
import { ValuesGrid } from "@/src/features/about/components/values-grid";
import { TimelineSection } from "@/src/features/about/components/timeline-section";
import { TeamGrid } from "@/src/features/about/components/team-grid";
import { CtaSection } from "@/src/features/home/components/cta-section";

export const metadata: Metadata = {
  title: "درباره‌ی هلپر",
  description: "هلپر شما را به متخصصان تأییدشده در هر زمینه‌ای وصل می‌کند. داستان، ارزش‌ها و تیم ما را بشناسید.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <StatsBar />
      <MissionSection />
      <ValuesGrid />
      <TimelineSection />
      <TeamGrid />
      <CtaSection />
    </main>
  );
}