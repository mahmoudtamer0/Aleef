import { useSyncExternalStore } from "react";
import type { CartItem } from "@/types";

// The cart lives in localStorage. Every component that calls useCart() updates when it changes
// (and so do other open tabs). No server involved: the backend only prices the cart later.
const KEY = "aleef_cart";
const EMPTY: CartItem[] = [];
const MAX_PER_LINE = 99;

let snapshot: CartItem[] | null = null;
const listeners = new Set<() => void>();

function load(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((i) => i && typeof i.productId === "string" && Number(i.quantity) >= 1);
  } catch {
    return EMPTY;
  }
}

const getSnapshot = () => (snapshot ??= load());
const getServerSnapshot = () => EMPTY;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      snapshot = null; // another tab changed it: read again
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: CartItem[]) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: the cart still works until the tab closes */
  }
  listeners.forEach((l) => l());
}

const cap = (quantity: number, stock: number) => Math.max(1, Math.min(quantity, stock > 0 ? stock : MAX_PER_LINE, MAX_PER_LINE));

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  if (item.stock <= 0) return;
  const current = getSnapshot();
  const existing = current.find((i) => i.productId === item.productId);
  commit(
    existing
      ? current.map((i) => (i.productId === item.productId ? { ...i, ...item, quantity: cap(i.quantity + quantity, item.stock) } : i))
      : [...current, { ...item, quantity: cap(quantity, item.stock) }],
  );
}

export function setCartQuantity(productId: string, quantity: number) {
  commit(getSnapshot().map((i) => (i.productId === productId ? { ...i, quantity: cap(quantity, i.stock) } : i)));
}

export const removeFromCart = (productId: string) => commit(getSnapshot().filter((i) => i.productId !== productId));
export const clearCart = () => commit([]);

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, count, add: addToCart, setQuantity: setCartQuantity, remove: removeFromCart, clear: clearCart };
}
