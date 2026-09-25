"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getSession } from "next-auth/react";
import { Loader2, Plus, X } from "lucide-react";

import { SectionCard } from "@/src/components/shared/section-card";
import { providerApi } from "../../api/provider.api";
import type { ProviderSkill } from "../../types/provider.types";

const SKILL_SUGGESTIONS = [
  "لوله‌کشی",
  "رفع نشتی",
  "نصب شیرآلات",
  "تأسیسات",
  "رفع گرفتگی",
  "نصب آبگرمکن",
];

export function SkillsSection({ initial }: { initial: ProviderSkill[] }) {
  const [skills, setSkills] = useState<ProviderSkill[]>(initial);
  const [draft, setDraft] = useState("");
  const [pendingAdd, setPendingAdd] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  const names = skills.map((s) => s.name);
  const remaining = SKILL_SUGGESTIONS.filter((s) => !names.includes(s));

  const addSkill = async (raw: string) => {
    const name = raw.trim();
    if (!name || names.includes(name) || pendingAdd) return;

    setPendingAdd(true);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        return;
      }

      const created = await providerApi.addSkill(name, session.accessToken);
      // اگر بک‌اند id واقعی برمی‌گرداند از created استفاده کن؛
      // در غیر این صورت پروفایل را دوباره fetch کن
      setSkills((prev) => [...prev, created as ProviderSkill]);
      setDraft("");
      toast.success("تخصص اضافه شد");
    } catch {
      toast.error("افزودن تخصص با مشکل مواجه شد");
    } finally {
      setPendingAdd(false);
    }
  };

  const removeSkill = async (skill: ProviderSkill) => {
    setPendingRemoveId(skill.id);
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        return;
      }

      await providerApi.removeSkill(skill.id, session.accessToken);
      setSkills((prev) => prev.filter((s) => s.id !== skill.id));
      toast.success("تخصص حذف شد");
    } catch {
      toast.error("حذف تخصص با مشکل مواجه شد");
    } finally {
      setPendingRemoveId(null);
    }
  };

  return (
    <SectionCard
      id="skills"
      title="تخصص‌ها"
      description="هر تخصص بلافاصله ذخیره می‌شود؛ نیازی به دکمه‌ی ذخیره نیست."
    >
      <div
        className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3 py-2 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10"
      >
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pe-1.5 ps-3 text-sm text-primary"
          >
            {skill.name}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              disabled={pendingRemoveId === skill.id}
              aria-label={`حذف ${skill.name}`}
              className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {pendingRemoveId === skill.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <X size={12} />
              )}
            </button>
          </span>
        ))}

        <input
          value={draft}
          disabled={pendingAdd}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === "،") {
              e.preventDefault();
              addSkill(draft);
            }
          }}
          onBlur={() => addSkill(draft)}
          placeholder="مثلاً رفع نشتی"
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-foreground/40 disabled:cursor-not-allowed"
        />

        {pendingAdd && (
          <Loader2 size={16} className="animate-spin text-foreground/40" />
        )}
      </div>

      {remaining.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-foreground/45">پیشنهاد:</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSkill(s)}
              disabled={pendingAdd}
              className="inline-flex items-center gap-1 rounded-full border border-dashed border-foreground/20 px-2.5 py-1 text-xs text-foreground/60 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              <Plus size={12} />
              {s}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}