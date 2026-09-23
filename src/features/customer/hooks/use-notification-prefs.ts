"use client";

import { useState } from "react";

import { customerApi } from "../api/customer.api";
import type {
  NotificationChannel,
  NotificationPrefs,
  NotificationTopic,
} from "../types/customer.types";
import { useMutation } from "./use-mutation";


/** تنظیمات اعلان‌ها با ذخیره‌ی خوش‌بینانه: تغییر فوری در UI، ذخیره در پس‌زمینه */
export function useNotificationPrefs(initial: NotificationPrefs) {
  const [prefs, setPrefs] = useState(initial);
  const { run, isPending } = useMutation(customerApi.updateNotificationPrefs);

  const toggle = (topic: NotificationTopic, channel: NotificationChannel) => {
    const next: NotificationPrefs = {
      ...prefs,
      [topic]: { ...prefs[topic], [channel]: !prefs[topic][channel] },
    };
    setPrefs(next);
    run(next).then((result) => {
      if (!result.ok) setPrefs(prefs); // بازگردانی در صورت خطا
    });
  };

  return { prefs, toggle, isPending };
}