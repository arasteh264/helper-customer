"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Loader2,
  Plus,
  Search,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import { SectionCard } from "@/src/components/shared/section-card";
import { Button } from "@/src/components/ui/button";
import { normalizeError } from "@/src/lib/api/error";
import { providerApi } from "../../api/provider.api";
import type {
  ProviderSkill,
  ProviderSpecialty,
  ProviderSpecialtyGroup,
} from "../../types/provider.types";

const iconMap: Record<string, typeof Wrench> = {
  wrench: Wrench,
};

const getIcon = (iconName?: string | null) => {
  const normalized = (iconName ?? "").toLowerCase().replace(/[^a-z]/g, "");
  return iconMap[normalized] ?? Wrench;
};

export function SkillsSection({
  initial = [],
  initialSkills = [],
  accessToken,
}: {
  initial?: ProviderSpecialty[];
  initialSkills?: ProviderSkill[];
  accessToken: string;
}) {
  const [skills, setSkills] = useState<ProviderSkill[]>(initialSkills);
  const [skillDraft, setSkillDraft] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null);
  const [skillError, setSkillError] = useState<string | null>(null);
  const initialSelectedIds = initial.map((specialty) => specialty.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialSelectedIds,
  );
  const [groups, setGroups] = useState<ProviderSpecialtyGroup[]>([]);
  const [groupCache, setGroupCache] = useState<
    Record<string, ProviderSpecialty[]>
  >({});
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const activeGroupId = selectedGroupId ?? groups[0]?.id ?? null;
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingGroupId, setLoadingGroupId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [specialtyQuery, setSpecialtyQuery] = useState("");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoadingGroups(true);
        setError(null);
        const response = await providerApi.getSpecialtyGroups(accessToken);
        setGroups(response);
      } catch {
        setError("دریافت گروه‌های تخصصی انجام نشد.");
      } finally {
        setLoadingGroups(false);
      }
    };

    loadGroups();
  }, [accessToken]);

  useEffect(() => {
    if (!activeGroupId || groupCache[activeGroupId]) return;

    const loadSpecialties = async () => {
      try {
        setLoadingGroupId(activeGroupId);
        const specialties = await providerApi.getSpecialtyGroupSpecialties(
          activeGroupId,
          accessToken,
        );
        setGroupCache((prev) => ({ ...prev, [activeGroupId]: specialties }));
      } catch {
        setError("دریافت تخصص‌های این گروه انجام نشد.");
      } finally {
        setLoadingGroupId(null);
      }
    };

    loadSpecialties();
  }, [accessToken, activeGroupId, groupCache]);

  const selectedSpecialties = useMemo(() => {
    const byId = new Map<string, ProviderSpecialty>();

    for (const list of Object.values(groupCache)) {
      for (const specialty of list) byId.set(specialty.id, specialty);
    }

    initial.forEach((specialty) => {
      if (!byId.has(specialty.id)) byId.set(specialty.id, specialty);
    });

    return selectedIds
      .map((id) => byId.get(id))
      .filter((item): item is ProviderSpecialty => !!item);
  }, [groupCache, initial, selectedIds]);

  const currentSpecialties = activeGroupId
    ? (groupCache[activeGroupId] ?? [])
    : [];
  const filteredSpecialties = currentSpecialties.filter((specialty) =>
    specialty.name
      .toLocaleLowerCase("fa-IR")
      .includes(specialtyQuery.trim().toLocaleLowerCase("fa-IR")),
  );
  const specialtySelectionChanged =
    selectedIds.length !== initialSelectedIds.length ||
    selectedIds.some((id) => !initialSelectedIds.includes(id));

  const toggleSpecialty = (specialtyId: string) => {
    setSelectedIds((prev) => {
      const exists = prev.includes(specialtyId);
      if (exists) return prev.filter((id) => id !== specialtyId);
      if (prev.length >= 20) {
        toast.error("حداکثر ۲۰ تخصص قابل انتخاب است.");
        return prev;
      }
      return [...prev, specialtyId];
    });
  };

  const saveSpecialties = async () => {
    if (saving) return;

    try {
      setSaving(true);
      setError(null);
      if (!accessToken) {
        toast.error("جلسه کاربری شما منقضی شده است");
        return;
      }

      await providerApi.updateSpecialties(selectedIds, accessToken);
      toast.success("انتخاب تخصص‌ها با موفقیت ذخیره شد");
      router.refresh();
    } catch {
      setError("ذخیره‌ی تخصص‌ها انجام نشد. لطفاً دوباره تلاش کنید.");
      toast.error("ذخیره‌ی تخصص‌ها انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = skillDraft.trim();
    if (!name) {
      setSkillError("نام مهارت را وارد کنید.");
      return;
    }
    if (
      skills.some(
        (skill) => skill.name.toLocaleLowerCase("fa-IR") === name.toLocaleLowerCase("fa-IR"),
      )
    ) {
      setSkillError("این مهارت قبلاً اضافه شده است.");
      return;
    }

    setAddingSkill(true);
    setSkillError(null);
    try {
      const created = await providerApi.addSkill(name, accessToken);
      setSkills((current) => [...current, created]);
      setSkillDraft("");
      toast.success("مهارت اضافه شد");
    } catch (error) {
      const message = normalizeError(error).message;
      setSkillError(message || "افزودن مهارت انجام نشد. دوباره تلاش کنید.");
    } finally {
      setAddingSkill(false);
    }
  };

  const removeSkill = async (skill: ProviderSkill) => {
    if (removingSkillId) return;
    setRemovingSkillId(skill.id);
    setSkillError(null);
    try {
      await providerApi.removeSkill(skill.id, accessToken);
      setSkills((current) => current.filter((item) => item.id !== skill.id));
      toast.success("مهارت حذف شد");
    } catch (error) {
      const message = normalizeError(error).message;
      setSkillError(message || "حذف مهارت انجام نشد. دوباره تلاش کنید.");
    } finally {
      setRemovingSkillId(null);
    }
  };

  return (
    <SectionCard
      id="skills"
      title="تخصص‌ها و مهارت‌ها"
      description="تخصص‌های مرتبط با کارتان را انتخاب کنید تا درخواست‌های مناسب‌تری دریافت کنید. حداکثر ۲۰ مورد قابل انتخاب است."
    >
      {error ? (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mb-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-foreground/55">
          انتخاب‌شده:{" "}
          {new Intl.NumberFormat("fa-IR").format(selectedIds.length)} از ۲۰
        </p>
        <button
          type="button"
          onClick={saveSpecialties}
          disabled={saving || !specialtySelectionChanged}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {saving ? <Loader2 size={17} className="animate-spin" /> : null}
          {saving ? "در حال ذخیره…" : "ذخیره‌ی تخصص‌ها"}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3 py-2">
        {selectedSpecialties.length === 0 ? (
          <span className="text-sm text-foreground/50">
            هیچ تخصصی انتخاب نشده است.
          </span>
        ) : (
          selectedSpecialties.map((specialty) => (
            <button
              key={specialty.id}
              type="button"
              onClick={() => toggleSpecialty(specialty.id)}
              aria-label={`حذف تخصص ${specialty.name}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {specialty.name}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                <X size={13} aria-hidden="true" />
              </span>
            </button>
          ))
        )}
      </div>

      <div className="mb-5 rounded-xl border border-foreground/10 bg-background p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-foreground">مهارت‌های شما</h3>
        <p className="mt-1 text-xs leading-5 text-foreground/55">
          مهارت‌های مشخصی را که در انجام خدمات دارید اضافه کنید.
        </p>
        <form
          onSubmit={addSkill}
          className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2"
        >
          <label htmlFor="provider-skill-input" className="sr-only">
            نام مهارت
          </label>
          <input
            id="provider-skill-input"
            type="text"
            maxLength={100}
            value={skillDraft}
            onChange={(event) => setSkillDraft(event.target.value)}
            placeholder="مثلاً نصب شیرآلات"
            className="h-11 min-w-0 rounded-xl border border-foreground/15 bg-card px-3 text-sm outline-none placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
          />
          <Button
            type="submit"
            disabled={addingSkill || !skillDraft.trim()}
            className="min-h-11 min-w-11 gap-2 px-3"
            aria-label="افزودن مهارت"
          >
            {addingSkill ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Plus size={17} />
            )}
            <span className="hidden sm:inline">افزودن</span>
          </Button>
        </form>
        {skills.length > 0 ? (
          <ul
            className="mt-3 flex flex-wrap gap-2"
            aria-label="مهارت‌های ثبت‌شده"
          >
            {skills.map((skill) => (
              <li key={skill.id}>
                <button
                  type="button"
                  onClick={() => void removeSkill(skill)}
                  disabled={Boolean(removingSkillId)}
                  aria-label={`حذف مهارت ${skill.name}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 text-sm text-foreground/75 transition-colors hover:border-destructive/30 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
                >
                  {removingSkillId === skill.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  {skill.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-lg bg-foreground/[0.03] px-3 py-2 text-xs text-foreground/55">
            هنوز مهارتی ثبت نکرده‌اید.
          </p>
        )}
        {skillError ? (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {skillError}
          </p>
        ) : null}
      </div>

      {loadingGroups ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-foreground/[0.05]"
            />
          ))}
        </div>
      ) : (
        <>
          {groups.length > 0 ? (
            <div className="mb-3 md:hidden">
              <label
                htmlFor="provider-specialty-group"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                دسته‌ی تخصص
              </label>
              <select
                id="provider-specialty-group"
                value={activeGroupId ?? ""}
                onChange={(event) => {
                  setSelectedGroupId(event.target.value);
                  setSpecialtyQuery("");
                }}
                className="h-11 w-full rounded-xl border border-foreground/15 bg-background px-3 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div className="hidden gap-3 md:grid md:grid-cols-2">
            {groups.map((group) => {
              const isSelected = activeGroupId === group.id;
              const groupKey = (group.slug ?? group.id ?? "").toLowerCase();

              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setSpecialtyQuery("");
                  }}
                  className={[
                    "flex min-h-14 min-w-0 items-center gap-3 rounded-2xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-foreground/15 bg-background text-foreground/70 hover:border-primary/30",
                  ].join(" ")}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                    {group.icon ? (
                      <Image
                        src={group.icon}
                        alt={group.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg
                        viewBox="0 0 64 64"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <use href={`/icons/category-sprite.svg#${groupKey || "default"}`} />
                      </svg>
                    )}
                  </span>

                  <span className="text-sm font-medium">{group.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {activeGroupId && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="min-w-0 text-sm font-medium text-foreground">
              تخصص‌های گروه انتخاب‌شده
            </h3>
            <span className="text-xs text-foreground/50">
              {new Intl.NumberFormat("fa-IR").format(
                filteredSpecialties.length,
              )}{" "}
              مورد
            </span>
          </div>

          <label className="relative mb-3 block">
            <span className="sr-only">جست‌وجو بین تخصص‌های این گروه</span>
            <Search
              size={17}
              aria-hidden="true"
              className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <input
              type="search"
              value={specialtyQuery}
              onChange={(event) => setSpecialtyQuery(event.target.value)}
              placeholder="جست‌وجو بین تخصص‌های این گروه"
              className="h-11 w-full rounded-xl border border-foreground/15 bg-background pe-10 ps-3 text-sm outline-none placeholder:text-foreground/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
            />
          </label>

          {loadingGroupId === activeGroupId ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-2xl bg-foreground/[0.05]"
                />
              ))}
            </div>
          ) : filteredSpecialties.length === 0 ? (
            <div className="rounded-xl border border-dashed border-foreground/15 bg-background px-3 py-4 text-center text-sm text-foreground/55">
              {currentSpecialties.length === 0
                ? "تخصصی برای این گروه وجود ندارد."
                : "تخصصی با این جست‌وجو پیدا نشد."}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredSpecialties.map((specialty) => {
                const Icon = getIcon(specialty.icon);
                const isChecked = selectedIds.includes(specialty.id);

                return (
                  <button
                    key={specialty.id}
                    type="button"
                    aria-pressed={isChecked}
                    onClick={() => toggleSpecialty(specialty.id)}
                    className={[
                      "relative flex min-h-[4.5rem] min-w-0 items-start gap-3 rounded-2xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isChecked
                        ? "border-primary bg-primary/8"
                        : "border-foreground/10 bg-background hover:border-primary/25",
                    ].join(" ")}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">
                        {specialty.name}
                      </span>
                      <span className="mt-1 block text-xs text-foreground/55">
                        {new Intl.NumberFormat("fa-IR").format(
                          specialty.activeProvidersCount ?? 0,
                        )}{" "}
                        متخصص فعال
                      </span>
                    </span>
                    {isChecked ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check size={12} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
