"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Modal } from "@/src/components/shared/modal";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ApiError } from "@/src/lib/api/error";
import type { ServiceRequest } from "../types/customer.types";
import { requestApi } from "@/src/features/request/api/request.api";
import {
  editRequestSchema,
  type EditRequestValues,
} from "@/src/features/request/schemas/edit-request.schema";
import { toEnglishDigits } from "@/src/utils/format";

const AddressMap = dynamic(
  () => import("@/src/features/request/components/addressmap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 animate-pulse rounded-xl bg-foreground/[0.06]" />
    ),
  },
);

function toLocalDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function RequestEditDialog({
  request,
}: {
  request: ServiceRequest;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude?: number;
    longitude?: number;
  }>({
    latitude: request.latitude,
    longitude: request.longitude,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditRequestValues>({
    resolver: zodResolver(editRequestSchema),
    defaultValues: {
      title: request.title,
      description: request.description,
      address: request.addressLabel,
      scheduledAt: toLocalDateTime(request.scheduledAt),
      budgetMin: request.budget ? String(request.budget.min) : "",
      budgetMax: request.budget ? String(request.budget.max) : "",
    },
  });

  const openEditor = () => {
    reset({
      title: request.title,
      description: request.description,
      address: request.addressLabel,
      scheduledAt: toLocalDateTime(request.scheduledAt),
      budgetMin: request.budget ? String(request.budget.min) : "",
      budgetMax: request.budget ? String(request.budget.max) : "",
    });
    setCoordinates({
      latitude: request.latitude,
      longitude: request.longitude,
    });
    setOpen(true);
  };

  const onSubmit = async (values: EditRequestValues) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        toast.error("نشست شما منقضی شده؛ دوباره وارد شوید.");
        return;
      }

      await requestApi.updateMyRequest(
        request.id,
        {
          title: values.title,
          description: values.description,
          address: values.address,
          latitude: coordinates.latitude ?? null,
          longitude: coordinates.longitude ?? null,
          scheduledAt: values.scheduledAt
            ? new Date(values.scheduledAt).toISOString()
            : null,
          budgetMin:
            values.budgetMin === "" ? null : Number(values.budgetMin),
          budgetMax:
            values.budgetMax === "" ? null : Number(values.budgetMax),
        },
        session.accessToken,
      );
      toast.success("جزئیات درخواست ویرایش شد.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? error.message
          : "ویرایش درخواست انجام نشد. دوباره تلاش کنید.",
      );
    }
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={openEditor}
          className="gap-2"
        >
          <Pencil size={16} />
          ویرایش درخواست
        </Button>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="ویرایش درخواست خدمات"
        description="اطلاعات و نشانی درخواست را اصلاح کنید."
        size="lg"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="request-edit-title">عنوان درخواست</Label>
            <Input
              id="request-edit-title"
              error={!!errors.title}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-edit-description">شرح درخواست</Label>
            <textarea
              id="request-edit-description"
              rows={4}
              maxLength={1000}
              aria-invalid={!!errors.description}
              className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="request-edit-address">نشانی محل انجام کار</Label>
            <textarea
              id="request-edit-address"
              rows={3}
              aria-invalid={!!errors.address}
              className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-3.5 py-3 text-sm leading-7 outline-none transition-colors focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
            <p className="text-xs text-foreground/50">
              برای اصلاح موقعیت مکانی، پین نقشه را جابه‌جا کنید.
            </p>
            <AddressMap
              key={open ? `open-${request.id}` : `closed-${request.id}`}
              latitude={coordinates.latitude}
              longitude={coordinates.longitude}
              onMove={(latitude, longitude) =>
                setCoordinates({ latitude, longitude })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="request-edit-scheduled-at">
                زمان مدنظر (اختیاری)
              </Label>
              <Input
                id="request-edit-scheduled-at"
                type="datetime-local"
                dir="ltr"
                error={!!errors.scheduledAt}
                {...register("scheduledAt")}
              />
              {errors.scheduledAt && (
                <p className="text-xs text-destructive">
                  {errors.scheduledAt.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-edit-budget-min">
                حداقل بودجه (اختیاری)
              </Label>
              <Input
                id="request-edit-budget-min"
                dir="ltr"
                inputMode="numeric"
                error={!!errors.budgetMin}
                {...register("budgetMin", { setValueAs: toEnglishDigits })}
              />
              {errors.budgetMin && (
                <p className="text-xs text-destructive">
                  {errors.budgetMin.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="request-edit-budget-max">
                حداکثر بودجه (اختیاری)
              </Label>
              <Input
                id="request-edit-budget-max"
                dir="ltr"
                inputMode="numeric"
                error={!!errors.budgetMax}
                {...register("budgetMax", { setValueAs: toEnglishDigits })}
              />
              {errors.budgetMax && (
                <p className="text-xs text-destructive">
                  {errors.budgetMax.message}
                </p>
              )}
              <p className="text-xs text-foreground/50">
                برای حذف بودجه، هر دو فیلد را خالی بگذارید.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting ? "در حال ذخیره…" : "ذخیره‌ی تغییرات"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
