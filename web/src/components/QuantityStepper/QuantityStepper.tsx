"use client";

import { Minus, Plus } from "lucide-react";
import styles from "./QuantityStepper.module.css";

type Props = { value: number; onChange: (value: number) => void; min?: number; max?: number; label?: string };

// [-] 2 [+]
export function QuantityStepper({ value, onChange, min = 1, max = 99, label = "Quantity" }: Props) {
  return (
    <div role="group" aria-label={label} className={styles.stepper}>
      <button type="button" aria-label="Decrease" disabled={value <= min} onClick={() => onChange(value - 1)} className={styles.button}>
        <Minus aria-hidden size={18} />
      </button>
      <output aria-live="polite" className={styles.value}>{value}</output>
      <button type="button" aria-label="Increase" disabled={value >= max} onClick={() => onChange(value + 1)} className={styles.button}>
        <Plus aria-hidden size={18} />
      </button>
    </div>
  );
}
