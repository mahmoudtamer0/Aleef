"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import styles from "./AuthGuard.module.css";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") router.replace(routes.login);
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className={styles.loader} role="status" aria-label="Loading">
        <span className={styles.logo}>ALEEF</span>
      </div>
    );
  }
  return <>{children}</>;
}
