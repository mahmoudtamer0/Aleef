"use client";

import { Button } from "@/components/Button/Button";
import styles from "./ErrorState.module.css";

type Props = { message?: string; onRetry?: () => void };

export function ErrorState({ message = "We couldn't load this.", onRetry }: Props) {
  return (
    <div role="alert" className={styles.box}>
      <p className={styles.message}>{message}</p>
      {onRetry && <Button size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
