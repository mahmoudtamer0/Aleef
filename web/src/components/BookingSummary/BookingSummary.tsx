import { Button } from "@/components/Button/Button";
import styles from "./BookingSummary.module.css";

type Props = {
  doctorName: string;
  fee?: number;
  petName?: string;
  dateLabel?: string;
  timeLabel?: string;
  reason?: string;
  canSubmit: boolean;
  busy: boolean;
  error?: string;
  onSubmit: () => void;
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <span className={value ? styles.value : styles.missing}>{value ?? "Not chosen yet"}</span>
    </div>
  );
}

export function BookingSummary({ doctorName, fee, petName, dateLabel, timeLabel, reason, canSubmit, busy, error, onSubmit }: Props) {
  return (
    <aside className={styles.card}>
      <h2 className={styles.title}>Your booking</h2>
      <div className={styles.rows}>
        <Row label="Doctor" value={doctorName} />
        <Row label="Pet" value={petName} />
        <Row label="Day" value={dateLabel} />
        <Row label="Time" value={timeLabel} />
        <Row label="Reason" value={reason} />
      </div>
      {fee != null && (
        <div className={`d-flex justify-content-between ${styles.total}`}>
          <b>Total</b>
          <b className={styles.price}>EGP {fee}</b>
        </div>
      )}
      <Button className={styles.button} disabled={!canSubmit || busy} onClick={onSubmit}>
        {busy ? "Booking…" : "Confirm booking"}
      </Button>
      {!canSubmit && !busy && <p className={styles.hint}>Choose a pet, a day, a time and a reason to continue.</p>}
      {error && <p role="alert" className={styles.error}>{error}</p>}
    </aside>
  );
}
