import { Briefcase, Home, MapPin, Pencil, Star, Trash2 } from "lucide-react";

import type { Address } from "../types/customer.types";
import { ADDRESS_TYPE } from "../utils/status-maps";

const ICONS = { home: Home, work: Briefcase, other: MapPin };

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: Props) {
  const Icon = ICONS[address.type];

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={19} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{address.title}</h3>
              <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-[11px] text-foreground/55">
                {ADDRESS_TYPE[address.type]}
              </span>
              {address.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <Star size={11} className="fill-primary" />
                  پیش‌فرض
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-6 text-foreground/65">
              {address.fullAddress}، پلاک {address.plaque}
              {address.unit && `، واحد ${address.unit}`}
            </p>
            <p className="mt-1 text-xs text-foreground/45">
              {address.receiverName} · <span dir="ltr">{address.receiverPhone}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-foreground/10 pt-3">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            تنظیم به‌عنوان پیش‌فرض
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(address)}
            aria-label={`ویرایش آدرس ${address.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/55 transition-colors hover:bg-foreground/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(address.id)}
            aria-label={`حذف آدرس ${address.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/55 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}