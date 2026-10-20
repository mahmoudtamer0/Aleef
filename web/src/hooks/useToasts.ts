import { create } from "zustand";

export type Toast = { id: string; title: string; body: string; href: string; type?: string };

// The little popups at the top right ("Appointment Accepted"...). Any code can add one: useToasts.getState().push({...})
export const useToasts = create<{ toasts: Toast[]; push: (toast: Omit<Toast, "id">) => void; dismiss: (id: string) => void }>((set) => ({
  toasts: [],
  push: (toast) => set((s) => ({ toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }].slice(-3) })), // at most 3 at once
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
