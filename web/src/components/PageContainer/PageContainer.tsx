import type { ReactNode } from "react";
import { Container } from "@/components/Container/Container";
import styles from "./PageContainer.module.css";

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main>
      <Container className={styles.stack}>{children}</Container>
    </main>
  );
}