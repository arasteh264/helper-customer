export type NotificationTopic =
  | "messages"
  | "workUpdates"
  | "opportunities"
  | "payments"
  | "promotions";

export type NotificationChannel = "inApp" | "sms" | "email";

export type UserNotificationPreferences = Record<
  NotificationTopic,
  Record<NotificationChannel, boolean>
>;

export type NotificationRole = "CUSTOMER" | "PROVIDER";

export type NotificationType =
  | "CHAT_MESSAGE"
  | "SERVICE_REQUEST_STATUS"
  | "PROVIDER_OFFER"
  | "NEW_OPPORTUNITY"
  | "PAYMENT_UPDATE";

export interface UserNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  serviceRequestId?: string | null;
  chatMessageId?: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface UserNotificationsPage {
  items: UserNotification[];
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}
