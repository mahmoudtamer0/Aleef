import { Check, PackageCheck, Truck } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./OrderProgress.module.css";

const steps = [
  { label: "Order placed", Icon: Check },
  { label: "On the way", Icon: Truck },
  { label: "Delivered", Icon: PackageCheck },
];

// Placed -> On the way -> Delivered. `step` is how far the order is (0, 1 or 2).
export function OrderProgress({ step }: { step: number }) {
  return (
    <div className={`rise ${styles.card}`} style={{ animationDelay: "150ms" }}>
      <ol className={styles.steps} aria-label="Order progress">
        {steps.map(({ label, Icon }, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className={cx(styles.step, i <= step && styles.done, i === step && styles.current)}>
            <span className={styles.badge}><Icon aria-hidden size={18} /></span>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}
