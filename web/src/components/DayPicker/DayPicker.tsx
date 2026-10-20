import { formatDayParts } from "@/lib/date";
import { cx } from "@/lib/utils";
import styles from "./DayPicker.module.css";

type Props = { days: string[]; selected: string | null; onSelect: (date: string) => void };

// A row of the days this doctor works (from the backend). Scrolls sideways if there are many.
export function DayPicker({ days, selected, onSelect }: Props) {
  return (
    <div role="radiogroup" aria-label="Choose a day" className={styles.list}>
      {days.map((date) => {
        const { weekday, day, month } = formatDayParts(date);
        return (
          <button key={date} type="button" role="radio" aria-checked={date === selected} onClick={() => onSelect(date)} className={cx(styles.day, date === selected && styles.on)}>
            <span className={styles.weekday}>{weekday}</span>
            <span className={styles.number}>{day}</span>
            <span className={styles.month}>{month}</span>
          </button>
        );
      })}
    </div>
  );
}
