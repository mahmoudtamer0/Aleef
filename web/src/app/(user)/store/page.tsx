// Server Component: the whole page is one client component (search, sort and infinite scroll need state).
import type { Metadata } from "next";
import { StoreProducts } from "@/components/StoreProducts/StoreProducts";

export const metadata: Metadata = { title: "Store" };

export default function StorePage() {
  return <StoreProducts />;
}
