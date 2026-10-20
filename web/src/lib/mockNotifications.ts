import type { AppNotification } from "@/types";

// Mock mode only: a few notifications that can be marked as read, so the bell can be tried without a backend.
const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

let items: AppNotification[] = [
  { id: "n1", title: "Appointment Accepted ✅", body: "Doctor Ramy Medawer has accepted your appointment", createdAt: ago(12), read: false, data: { type: "appointment", appointmentId: "a1" } },
  { id: "n2", title: "Dr. Ramy Medawer", body: "Is 9:00 still good for you?", createdAt: ago(54), read: false, data: { type: "chat", chatId: "c1" } },
  { id: "n3", title: "Your order has shipped 🚚", body: "Order #26B879 is on its way", createdAt: ago(60 * 26), read: true, data: { type: "shop" } },
  { id: "n4", title: "Vaccine reminder 💉", body: "Misho's vaccine is due this week", createdAt: ago(60 * 50), read: true, data: { type: "appointment" } },
];

export const mockNotificationList = () => items.slice(0, 8);
export const mockUnreadNotifications = () => items.filter((n) => !n.read).length;
export const markAllMockNotificationsRead = () => {
  items = items.map((n) => ({ ...n, read: true }));
};
export const addMockNotification = (n: AppNotification) => {
  items = [n, ...items];
};
