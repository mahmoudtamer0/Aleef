import { Check } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./CheckoutSteps.module.css";

const steps = ["Cart", "Details", "Done"];

// Cart -> Details -> Done. `current` is the 0-based step the user is on.
export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol className={styles.steps} aria-label="Checkout progress">
      {steps.flatMap((label, i) => [
        <li key={label} aria-current={i === current ? "step" : undefined} className={cx(styles.step, i < current && styles.done, i === current && styles.current)}>
          <span className={styles.badge}>{i < current ? <Check aria-hidden size={16} /> : i + 1}</span>
          <span className={styles.label}>{label}</span>
        </li>,
        i < steps.length - 1 ? <li key={`${label}-line`} aria-hidden className={cx(styles.line, i < current && styles.lineDone)} /> : null,
      ])}
    </ol>
  );
}
