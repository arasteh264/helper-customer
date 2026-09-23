"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import { SectionCard } from "@/src/components/shared/section-card";



const MAX_ITEMS = 8;
const MIN_RECOMMENDED = 3;
const MAX_SIZE = 3 * 1024 * 1024;

interface Item {
  id: string;
  url: string;
  local: boolean;
}

export function PortfolioUploader({ initial }: { initial: string[] }) {
  const [items, setItems] = useState<Item[]>(
    initial.map((url, i) => ({ id: `init-${i}`, url, local: false }))
  );
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // آزاد کردن آدرس‌های موقت هنگام خروج از صفحه
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => i.local && URL.revokeObjectURL(i.url));
    };
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const room = MAX_ITEMS - items.length;
    if (room <= 0) {
      toast.error(`حداکثر ${MAX_ITEMS} نمونه‌کار می‌توانید داشته باشید`);
      return;
    }

    const valid = files
      .filter((f) => {
        if (!f.type.startsWith("image/")) {
          toast.error(`«${f.name}» تصویر نیست`);
          return false;
        }
        if (f.size > MAX_SIZE) {
          toast.error(`حجم «${f.name}» بیشتر از ۳ مگابایت است`);
          return false;
        }
        return true;
      })
      .slice(0, room);

    if (valid.length === 0) return;

    // TODO: فایل‌ها را به API آپلود ارسال کنید
    setItems((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: `${Date.now()}-${f.name}`,
        url: URL.createObjectURL(f),
        local: true,
      })),
    ]);
    toast.success("نمونه‌کار اضافه شد");
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.local) URL.revokeObjectURL(target.url);
      return prev.filter((i) => i.id !== id);
    });
  };

  const fa = new Intl.NumberFormat("fa-IR");
  const enough = items.length >= MIN_RECOMMENDED;

  return (
    <SectionCard
      id="portfolio"
      title="نمونه‌کارها"
      description={`عکس کارهای قبلی‌تان را اضافه کنید (حداقل ${fa.format(MIN_RECOMMENDED)} و حداکثر ${fa.format(MAX_ITEMS)} عکس).`}
      action={
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            enough ? "bg-green-600/10 text-green-700" : "bg-amber-500/15 text-amber-700"
          }`}
        >
          {fa.format(items.length)} / {fa.format(MAX_ITEMS)}
        </span>
      }
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-xl border border-foreground/10 bg-foreground/[0.04]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={`نمونه‌کار ${fa.format(i + 1)}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`حذف نمونه‌کار ${fa.format(i + 1)}`}
              className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity hover:bg-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}

        {items.length < MAX_ITEMS && (
          <li>
            <input
              id="portfolio-input"
              type="file"
              accept="image/*"
              multiple
              onChange={onSelect}
              className="peer sr-only"
            />
            <label
              htmlFor="portfolio-input"
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground/20 text-center text-sm text-foreground/55 transition-colors hover:border-primary/50 hover:bg-primary/[0.04] hover:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
            >
              <ImagePlus size={26} />
              افزودن عکس
            </label>
          </li>
        )}
      </ul>
    </SectionCard>
  );
}