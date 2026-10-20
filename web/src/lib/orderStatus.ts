import type { StatusTone } from "@/lib/appointmentStatus";

// Backend order status -> what the user reads, a color family, and the step on the progress bar (-1 = no bar).
// TODO: add any other statuses your backend uses.
export function getOrderStatus(status: string): { label: string; tone: StatusTone; step: number } {
  switch (status.toLowerCase()) {
    case "pending":
      return { label: "Pending", tone: "warning", step: 0 };
    case "shipped":
    case "processing":
    case "out_for_delivery":
      return { label: "On the way", tone: "info", step: 1 };
    case "delivered":
      return { label: "Delivered", tone: "success", step: 2 };
    case "cancelled":
    case "canceled":
      return { label: "Cancelled", tone: "danger", step: -1 };
    default:
      return { label: status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "", tone: "neutral", step: -1 };
  }
}
