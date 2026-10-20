import axios from "axios";
import { env } from "@/config/env";
import { tokenStorage } from "@/lib/storage";

export const UNAUTHORIZED_EVENT = "aleef:unauthorized";

export const api = axios.create({ baseURL: env.apiUrl, timeout: 15_000 });

// Every request carries the saved token.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 from the backend means the session is over.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

// Backend envelopes vary ({data: [...]}, {pets: [...]}, [...]). Normalise them in one place.
export function toList(body: any, ...keys: string[]): any[] {
  const inner = body?.data ?? body;
  if (Array.isArray(inner)) return inner;
  for (const key of [...keys, "items", "results"]) {
    if (Array.isArray(inner?.[key])) return inner[key];
  }
  return [];
}

export function toObject(body: any, ...keys: string[]): any {
  const inner = body?.data ?? body;
  for (const key of keys) if (inner?.[key]) return inner[key];
  return inner;
}

// The backend's error text if it sent one, otherwise a friendly default.
export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    console.log(error);
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}
