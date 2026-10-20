import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { routes } from "@/config/routes";
import styles from "./BookingSuccess.module.css";

type Props = { doctorName: string; petName: string; dateLabel: string; timeLabel: string };

export function BookingSuccess({ doctorName, petName, dateLabel, timeLabel }: Props) {
  return (
    <div role="status" className={`rise ${styles.card}`}>
      <span className={styles.icon}><CalendarCheck aria-hidden size={32} /></span>
      <h2 className={styles.title}>Appointment booked</h2>
      <p className={styles.text}>
        {petName} is booked with {doctorName} on {dateLabel} at {timeLabel}.
      </p>
      <div className={styles.actions}>
        <Button href={routes.appointments}>View my appointments</Button>
        <Button href={routes.doctors} variant="outlineGreen">Find another doctor</Button>
      </div>
    </div>
  );
}
