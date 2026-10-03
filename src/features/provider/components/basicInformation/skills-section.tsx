"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Check, Loader2, Wrench } from "lucide-react";
import Image from "next/image";
import { SectionCard } from "@/src/components/shared/section-card";
import { providerApi } from "../../api/provider.api";
import type {
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
  accessToken,
}: {
  initial?: ProviderSpecialty[];
  accessToken: string;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initial.map((specialty) => specialty.id),
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        setLoadingGroups(true);
        setError(null);
        const response = await providerApi.getSpecialtyGroups(accessToken);
        setGroups(response);
      } catch {
        setError("دریافت گروههای تخصصی انجام نشد.");
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
        setError("دریافت تخصصهای این گروه انجام نشد.");
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
      toast.success("انتخاب تخصصها با موفقیت ذخیره شد");
    } catch {
      setError("ذخیرهسازی تخصصها انجام نشد. لطفا دوباره تلاش کنید.");
      toast.error("ذخیرهسازی تخصصها انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard
      id="skills"
      title="تخصصها و مهارت ها"
      description="انتخابهای فعلی شما روی حساب متخصص شما ذخیره میشود. حداکثر ۲۰ تخصص قابل انتخاب است."
      action={
        <button
          type="button"
          onClick={saveSpecialties}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : null}
          {saving ? "در حال ذخیره" : "ذخیرهی انتخابها"}
        </button>
      }
    >
      {error ? (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

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
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1.5 text-sm text-primary"
            >
              {specialty.name}
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/15 text-[10px]">
                ×
              </span>
            </button>
          ))
        )}
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
        <div className="grid gap-3 md:grid-cols-2">
          {groups.map((group) => {
            const Icon = getIcon(group.icon);
            const isSelected = activeGroupId === group.id;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={[
                  "flex items-center gap-3 rounded-2xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
                    <Icon size={18} />
                  )}
                </span>

                <span className="text-sm font-medium">{group.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {activeGroupId && (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-foreground">
              تخصصهای گروه انتخابشده
            </h3>
            <span className="text-xs text-foreground/50">
              {currentSpecialties.length} مورد
            </span>
          </div>

          {loadingGroupId === activeGroupId ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-2xl bg-foreground/[0.05]"
                />
              ))}
            </div>
          ) : currentSpecialties.length === 0 ? (
            <div className="rounded-xl border border-dashed border-foreground/15 bg-background px-3 py-4 text-center text-sm text-foreground/55">
              تخصصی برای این گروه وجود ندارد.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {currentSpecialties.map((specialty) => {
                const Icon = getIcon(specialty.icon);
                const isChecked = selectedIds.includes(specialty.id);

                return (
                  <button
                    key={specialty.id}
                    type="button"
                    aria-pressed={isChecked}
                    onClick={() => toggleSpecialty(specialty.id)}
                    className={[
                      "relative flex items-start gap-3 rounded-2xl border p-3 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
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
