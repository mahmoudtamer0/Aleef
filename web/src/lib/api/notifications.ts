import { api, toList } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockDelay } from "@/lib/mock";
import { markAllMockNotificationsRead, mockNotificationList, mockUnreadNotifications } from "@/lib/mockNotifications";
import type { AppNotification, NotificationData } from "@/types";

const parseData = (value: unknown): Record<string, any> => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value && typeof value === "object" ? (value as Record<string, any>) : {};
};

const pick = (value: unknown) => (value != null ? String(value) : undefined);

// "APPOINTMENT_ACCEPTED" -> "appointment", "MESSAGE" -> "chat" (when the backend did not send data.type)
const typeFromEvent = (type?: string) => {
  const t = (type ?? "").toUpperCase();
  if (t.startsWith("APPOINTMENT")) return "appointment";
  if (t === "MESSAGE" || t.startsWith("CHAT")) return "chat";
  return undefined;
};

const toData = (data: Record<string, any>, fallbackType?: string): NotificationData => ({
  type: data.type ?? fallbackType,
  appointmentId: pick(data.appointmentId ?? data.appointment_id),
  chatId: pick(data.chatId ?? data.chat_id),
  productId: pick(data.productId ?? data.product_id),
  orderId: pick(data.orderId ?? data.order_id),
});

// A row of the `notifications` table.
// TODO: tell me the real column names (especially where the "data" / type lives) and I will match them.
const toNotification = (raw: any): AppNotification => ({
  id: String(raw?.id),
  title: raw?.title ?? "",
  body: raw?.body ?? raw?.message ?? "",
  createdAt: new Date(raw?.created_at ?? raw?.createdAt ?? Date.now()).toISOString(),
  read: !!(raw?.is_read ?? raw?.isRead),
  data: toData(parseData(raw?.data), raw?.type),
});

// The payload of the socket's "notification" event: { type, title, body, data }
export const toLiveNotification = (raw: any): AppNotification => ({
  id: `live-${crypto.randomUUID()}`,
  title: raw?.title ?? "",
  body: raw?.body ?? "",
  createdAt: new Date().toISOString(),
  read: false,
  data: toData(parseData(raw?.data), typeFromEvent(raw?.type)),
});

const toCount = (body: any): number => Number(typeof body === "number" || typeof body === "string" ? body : (body?.count ?? body?.unreadCount ?? body?.unread ?? 0)) || 0;

export async function getUnreadNotificationsCount(): Promise<number> {
  if (env.useMock) return mockDelay(mockUnreadNotifications(), 300);
  const res = await api.get(endpoints.unreadNotificationsCount);
  return toCount(res.data?.data ?? res.data);
}

export async function getNotifications(): Promise<AppNotification[]> {
  if (env.useMock) return mockDelay(mockNotificationList(), 500);
  const res = await api.get(endpoints.notifications);
  return toList(res.data, "notifications").map(toNotification);
}

export async function markAllNotificationsRead(): Promise<void> {
  if (env.useMock) {
    await mockDelay(null, 200);
    markAllMockNotificationsRead();
    return;
  }
  await api.patch(endpoints.markNotificationsRead);
}
