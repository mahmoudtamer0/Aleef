"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { env } from "@/config/env";
import { routes } from "@/config/routes";
import { tokenStorage } from "@/lib/storage";
import { UNAUTHORIZED_EVENT } from "@/lib/api/client";
import { getMe } from "@/lib/api/auth";
import type { User } from "@/types";

type Status = "loading" | "authenticated" | "guest";

export type AuthContextValue = {
  status: Status;
  user: User | null;
  isDemo: boolean;
  /** Call after a successful login/register with the user's own token. */
  signIn: (token: string) => void;
  /** Clears the session. Leaving the demo account also stops future auto-login. */
  signOut: (redirectTo?: string) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<Status>("loading");
  const [token, setToken] = useState<string | null>(null);

  // Boot: use the saved token, otherwise drop visitors straight into the demo account.
  useEffect(() => {
    let current = tokenStorage.get();
    if (!current && env.demoToken && !tokenStorage.demoOptedOut()) {
      current = env.demoToken;
      tokenStorage.set(current);
    }
    setToken(current);
    setStatus(current ? "authenticated" : "guest");
  }, []);

  const isDemo = !!token && !!env.demoToken && token === env.demoToken;

  const signOut = useCallback(
    (redirectTo: string = routes.login) => {
      if (isDemo) tokenStorage.setDemoOptOut();
      tokenStorage.clear();
      setToken(null);
      setStatus("guest");
      queryClient.clear();
      router.replace(redirectTo);
    },
    [isDemo, queryClient, router],
  );

  const signIn = useCallback((newToken: string) => {
    tokenStorage.set(newToken);
    setToken(newToken);
    setStatus("authenticated");
  }, []);

  // Any 401 from the API ends the session.
  useEffect(() => {
    const onUnauthorized = () => {
      tokenStorage.clear();
      setToken(null);
      setStatus("guest");
      queryClient.clear();
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [queryClient]);

  const { data: user = null } = useQuery({ queryKey: ["me", token], queryFn: getMe, enabled: status === "authenticated" });

  const value = useMemo(() => ({ status, user, isDemo, signIn, signOut }), [status, user, isDemo, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
