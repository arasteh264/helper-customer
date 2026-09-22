"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, Home, MapPin, MapPinPlus, Navigation } from "lucide-react";

import type { Address } from "@/src/features/customer/types/customer.types";
import { useAddresses } from "@/src/features/customer/hooks/use-addresses";
import { AddressFormDialog } from "@/src/features/customer/components/address-form-dialog";

const ICONS = { home: Home, work: Briefcase, other: MapPin } as const;

export function AddressStep({
  initialAddresses,
  value,
  onChange,
}: {
  initialAddresses: Address[];
  value: string;
  onChange: (addressId: string) => void;
}) {
  const { addresses, create, isPending } = useAddresses(initialAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        toast.success("موقعیت شما دریافت شد. لطفاً آدرس دقیق را هم کامل کنید.");
        setDialogOpen(true);
      },
      () => toast.error("دسترسی به موقعیت مکانی داده نشد")
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground">تعمیر در کدام آدرس انجام شود؟</h2>
      <p className="mt-1 text-sm text-foreground/55">
        یکی از آدرس‌های ذخیره‌شده را انتخاب کنید یا آدرس جدید اضافه کنید.
      </p>

      {addresses.length > 0 && (
        <ul className="mt-5 space-y-3">
          {addresses.map((addr) => {
            const Icon = ICONS[addr.type];
            const selected = value === addr.id;
            return (
              <li key={addr.id}>
                <button
                  type="button"
                  onClick={() => onChange(addr.id)}
                  aria-pressed={selected}
                  className={[
                    "flex w-full items-start gap-3 rounded-2xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    selected
                      ? "border-primary bg-primary/[0.05]"
                      : "border-foreground/10 bg-card hover:border-primary/30",
                  ].join(" ")}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      selected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{addr.title}</p>
                    <p className="mt-0.5 truncate text-xs leading-5 text-foreground/60">
                      {addr.fullAddress}، پلاک {addr.plaque}
                      {addr.unit && `، واحد ${addr.unit}`}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-foreground/20 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <MapPinPlus size={17} />
          افزودن آدرس جدید
        </button>
        <button
          type="button"
          onClick={useCurrentLocation}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-foreground/20 px-4 py-2.5 text-sm text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Navigation size={17} />
          استفاده از موقعیت فعلی
        </button>
      </div>

      <AddressFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (values) => {
          const result = await create(values);
          if (result.ok) onChange(result.data.id);
        }}
        isPending={isPending}
      />
    </div>
  );
}