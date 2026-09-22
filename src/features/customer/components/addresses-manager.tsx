"use client";

import { useState } from "react";
import { MapPinPlus } from "lucide-react";

import type { Address } from "../types/customer.types";
import { useAddresses } from "../hooks/use-addresses";
import { AddressCard } from "./address-card";
import { AddressFormDialog } from "./address-form-dialog";

export function AddressesManager({ initial }: { initial: Address[] }) {
  const { addresses, create, update, remove, isPending } = useAddresses(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>(undefined);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (address: Address) => {
    setEditing(address);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("این آدرس حذف شود؟")) remove(id);
  };

  const handleSetDefault = (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (address) update(id, { ...address, unit: address.unit ?? "", isDefault: true });
  };

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <MapPinPlus size={18} />
          افزودن آدرس جدید
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-foreground/15 bg-card px-6 py-14 text-center text-sm text-foreground/55">
          هنوز آدرسی ثبت نکرده‌اید.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id}>
              <AddressCard
                address={a}
                onEdit={openEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            </li>
          ))}
        </ul>
      )}

      <AddressFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={(values) => (editing ? update(editing.id, values) : create(values))}
        initial={editing}
        isPending={isPending}
      />
    </div>
  );
}