const TOKEN_KEY = "aleef_token";
const OPTOUT_KEY = "aleef_demo_optout";

const safe = <T,>(fn: () => T, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    return fn();
  } catch {
    return fallback; // storage blocked (private mode, etc.)
  }
};

export const tokenStorage = {
  get: () => safe(() => localStorage.getItem(TOKEN_KEY), null as string | null),
  set: (token: string) => safe(() => localStorage.setItem(TOKEN_KEY, token), undefined),
  clear: () => safe(() => localStorage.removeItem(TOKEN_KEY), undefined),
  // Set when the visitor leaves the demo account, so we never auto-enter it again.
  demoOptedOut: () => safe(() => localStorage.getItem(OPTOUT_KEY) === "1", false),
  setDemoOptOut: () => safe(() => localStorage.setItem(OPTOUT_KEY, "1"), undefined),
};
