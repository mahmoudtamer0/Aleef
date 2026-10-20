import { useQuery } from "@tanstack/react-query";
import { getRecentProducts } from "@/lib/api/products";

export const useRecentProducts = () => useQuery({ queryKey: ["products", "recent"], queryFn: () => getRecentProducts(4) });
