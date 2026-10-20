import { routes } from "@/config/routes";
import type { NotificationData } from "@/types";

// Where a notification takes the user when it is clicked. Add a case when the backend gets a new `data.type`.
export function getNotificationHref(data: NotificationData): string {
  switch (data.type) {
    case "appointment":
      return data.appointmentId ? routes.appointment(data.appointmentId) : routes.appointments;
    case "chat":
      return data.chatId ? routes.chat(data.chatId) : routes.chats;
    case "shop":
    case "order":
      return data.productId ? routes.product(data.productId) : routes.store;
    default:
      return routes.home;
  }
}
