"use client";

import { AlertCircle, RotateCcw, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import Image from "next/image";
import {
  useSpecialtyGroupSpecialties,
  useSpecialtyGroups,
} from "../hooks/use-grouped-specialties";
import type { Specialty } from "../types/specialty.types";
import { SpecialtyGroupSection } from "./specialty-group-section";

export function SpecialtyStep({
  value,
  onChange,
  accessToken,
}: {
  value: string;
  onChange: (id: string, name: string) => void;
  accessToken: string;
}) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
    refetch: refetchGroups,
  } = useSpecialtyGroups(accessToken);

  const {
    data: specialties = [],
    isLoading: specialtiesLoading,
    isError: specialtiesError,
    refetch: refetchSpecialties,
  } = useSpecialtyGroupSpecialties(selectedGroupId, accessToken);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
  );

  const selectedSpecialtyId = useMemo(() => {
    if (!selectedGroupId) return null;
    return specialties.find((specialty) => specialty.id === value)?.id ?? null;
  }, [specialties, selectedGroupId, value]);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleSpecialtySelect = (specialty: Specialty) => {
    onChange(specialty.id, specialty.name);
  };

  if (groupsError) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          چه نوع تعمیری نیاز دارید؟
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          این تخصص‌ها درخواست شما را دریافت می‌کنند.
        </p>

        <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>در بارگذاری گروه‌های خدمات خطایی رخ داد.</span>
          </div>
          <button
            type="button"
            onClick={() => refetchGroups()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-destructive px-3 py-2 text-xs font-medium text-white"
          >
            <RotateCcw size={14} />
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  if (groupsLoading) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          چه نوع تعمیری نیاز دارید؟
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          این تخصص‌ها درخواست شما را دریافت می‌کنند.
        </p>

        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl border border-foreground/10 bg-foreground/[0.05]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          چه نوع تعمیری نیاز دارید؟
        </h2>
        <p className="mt-1 text-sm text-foreground/55">
          این تخصص‌ها درخواست شما را دریافت می‌کنند.
        </p>

        <div className="mt-5 rounded-2xl border border-foreground/10 bg-card p-5 text-center text-sm text-foreground/65">
          گروه خدماتی برای نمایش موجود نیست.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">
        چه نوع تعمیری نیاز دارید؟
      </h2>
      <p className="mt-1 text-sm text-foreground/55">
        این تخصص‌ها درخواست شما را دریافت می‌کنند.
      </p>

      {!selectedGroup ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {groups.map((group) => {
            const groupKey = (group.slug ?? group.id ?? "").toLowerCase();
            const Icon = group.icon ? Wrench : Wrench;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleGroupSelect(group.id)}
                aria-pressed={selectedGroupId === group.id}
                className={[
                  "relative flex items-center gap-3 rounded-2xl border p-4 text-start transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  selectedGroupId === group.id
                    ? "border-primary bg-primary/8 shadow-sm"
                    : "border-foreground/10 bg-card hover:border-primary/30 hover:bg-primary/[0.02]",
                ].join(" ")}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10 text-primary">
                  {group.icon ? (
                    <Image
                      src={group.icon}
                      alt={group.name}
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                      className="h-6 w-6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <use href={`/icons/category-sprite.svg#${groupKey || "default"}`} />
                    </svg>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {group.name}
                  </p>

                  <p className="mt-1 text-xs text-foreground/55">
                    {new Intl.NumberFormat("fa-IR").format(0)} گروه
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {specialtiesError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              <div className="flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>در بارگذاری تخصص‌های این گروه خطایی رخ داد.</span>
              </div>
              <button
                type="button"
                onClick={() => refetchSpecialties()}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-destructive px-3 py-2 text-xs font-medium text-white"
              >
                <RotateCcw size={14} />
                تلاش مجدد
              </button>
            </div>
          ) : specialtiesLoading ? (
            <div className="space-y-3 rounded-2xl border border-foreground/10 p-4">
              <div className="h-5 w-32 animate-pulse rounded-md bg-foreground/[0.08]" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, cardIndex) => (
                  <div
                    key={cardIndex}
                    className="h-24 animate-pulse rounded-2xl bg-foreground/[0.06]"
                  />
                ))}
              </div>
            </div>
          ) : !specialties.length ? (
            <div className="rounded-2xl border border-foreground/10 bg-card p-5 text-center text-sm text-foreground/65">
              هیچ تخصصی برای این گروه ثبت نشده است.
            </div>
          ) : (
            <SpecialtyGroupSection
              group={{ ...selectedGroup, specialties }}
              selectedId={selectedSpecialtyId}
              expanded={true}
              onToggle={() => setSelectedGroupId(null)}
              onSelect={handleSpecialtySelect}
            />
          )}

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSelectedGroupId(null)}
              className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              بازگشت به گروه‌ها
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
