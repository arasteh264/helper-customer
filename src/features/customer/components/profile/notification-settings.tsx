"use client";


import { Switch } from "@/src/components/shared/switch";
import { SectionCard } from "@/src/components/shared/section-card";
import { NOTIFICATION_CHANNELS, NOTIFICATION_TOPICS } from "../../utils/status-maps";
import { NotificationPrefs } from "../../types/customer.types";
import { useNotificationPrefs } from "../../hooks/use-notification-prefs";

export function NotificationSettings({ initial }: { initial: NotificationPrefs }) {
  const { prefs, toggle } = useNotificationPrefs(initial);

  return (
    <SectionCard title="اعلان‌ها" description="مشخص کنید هر موضوع را از چه طریقی اطلاع‌رسانی کنیم.">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-foreground/10 text-xs text-foreground/50">
              <th scope="col" className="pb-3 text-start font-medium">موضوع</th>
              {NOTIFICATION_CHANNELS.map((c) => (
                <th key={c.id} scope="col" className="pb-3 ps-4 text-center font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/[0.07]">
            {NOTIFICATION_TOPICS.map((topic) => (
              <tr key={topic.id}>
                <td className="py-4 pe-4">
                  <p className="font-medium text-foreground">{topic.label}</p>
                  <p className="mt-0.5 text-xs text-foreground/50">{topic.description}</p>
                </td>
                {NOTIFICATION_CHANNELS.map((c) => (
                  <td key={c.id} className="py-4 ps-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={prefs[topic.id][c.id]}
                        onChange={() => toggle(topic.id, c.id)}
                        label={`${topic.label} از طریق ${c.label}`}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}