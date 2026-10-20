import { Button } from "@/components/Button/Button";
import { CancelAppointmentButton } from "@/components/CancelAppointmentButton/CancelAppointmentButton";
import { routes } from "@/config/routes";
import { getStatusInfo } from "@/lib/appointmentStatus";
import styles from "./StatusBanner.module.css";

type Props = { appointmentId: string; status: string; reason?: string; chatId: string | null; doctorId: string };

// One sentence about where the appointment stands, plus the next thing the user can do.
export function StatusBanner({ appointmentId, status, reason, chatId, doctorId }: Props) {
  const info = getStatusInfo(status);
  if (!info.message) return null;

  const isActive = ["pending", "accepted"].includes(status.toLowerCase()); // the only ones the backend lets you cancel

  return (
    <div role="status" className={`rise ${styles.banner} ${styles[info.tone]}`} style={{ animationDelay: "150ms" }}>
      <div>
        <b className={styles.message}>{info.message}</b>
        {reason && <p className={styles.reason}>Reason: {reason}</p>}
      </div>

      <div className={styles.actions}>
        {chatId && <Button href={routes.chat(chatId)}>Start chat →</Button>}
        {isActive && <CancelAppointmentButton appointmentId={appointmentId} />}
        {!isActive && <Button href={routes.bookDoctor(doctorId)} variant="outlineGreen">Book again</Button>}
      </div>
    </div>
  );
}
