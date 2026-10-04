"use client";

import { useEffect, useState } from "react";
import {
  normalizeSpecialtyGroup,
  type CatalogCategory,
} from "@/src/features/catalog/utils/category-mapping";
import { requestApi } from "@/src/features/request/api/request.api";

export function useSpecialtyCategories() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    requestApi
      .getSpecialtyGroups()
      .then((items) => {
        if (!active) return;
        setCategories(items.map(normalizeSpecialtyGroup));
        setError(null);
      })
      .catch(() => {
        if (active) setError("دریافت دسته‌بندی‌ها انجام نشد.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { categories, loading, error };
}