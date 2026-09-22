"use client";

import { useState } from "react";

import { customerApi } from "../api/customer.api";
import type { AddressValues } from "../schemas/address.schema";
import type { Address } from "../types/customer.types";
import { useMutation } from "./use-mutation";


/** مدیریت لیست آدرس‌ها روی کلاینت: افزودن، ویرایش، حذف و تعیین پیش‌فرض */
export function useAddresses(initial: Address[]) {
  const [addresses, setAddresses] = useState(initial);

  const { run: create, isPending: creating } = useMutation(
    async (values: AddressValues) => {
      const result = await customerApi.createAddress(values);
      setAddresses((prev) => {
        const nextAddress = { ...values, id: result.id };
        return values.isDefault
          ? [...prev.map((address) => ({ ...address, isDefault: false })), nextAddress]
          : [...prev, nextAddress];
      });
      return result;
    },
    { success: "آدرس جدید اضافه شد" }
  );

  const { run: update, isPending: updating } = useMutation(
    async (id: string, values: AddressValues) => {
      await customerApi.updateAddress(id, values);
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === id) return { ...a, ...values };
          return values.isDefault ? { ...a, isDefault: false } : a;
        })
      );
    },
    { success: "آدرس ویرایش شد" }
  );

  const { run: remove, isPending: removing } = useMutation(
    async (id: string) => {
      await customerApi.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    },
    { success: "آدرس حذف شد" }
  );

  return {
    addresses,
    create,
    update,
    remove,
    isPending: creating || updating || removing,
  };
}