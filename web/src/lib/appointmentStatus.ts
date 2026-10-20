export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

// Backend status -> what the user reads, plus a color family.
// TODO: add any other statuses your backend uses.
export function getStatusInfo(status: string): { label: string; tone: StatusTone; message: string } {
  switch (status.toLowerCase()) {
    case "accepted":
      return { label: "Confirmed", tone: "success", message: "Your appointment is confirmed." };
    case "pending":
      return { label: "Pending", tone: "warning", message: "Waiting for the doctor to confirm your appointment." };
    case "rejected":
      return { label: "Rejected", tone: "danger", message: "The doctor couldn't accept this appointment." };
    case "completed":
      return { label: "Completed", tone: "info", message: "This visit is completed." };
    case "cancelled-by-owner":
      return { label: "Cancelled", tone: "neutral", message: "You cancelled this appointment." };
    case "cancelled":
    case "cancelled-by-doctor":
    case "canceled":
      return { label: "Cancelled", tone: "neutral", message: "This appointment was cancelled." };
    default:
      return { label: status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "", tone: "neutral", message: "" };
  }
}
