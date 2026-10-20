import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateCart, createOrder, getProduct, getProductsPage, getRecentProducts, type ProductSort } from "@/lib/api/products";
import type { CartItem } from "@/types";
import { useDebounce } from "./useDebounce";

// Home page: the newest few.
export const useRecentProducts = () => useQuery({ queryKey: ["products", "recent"], queryFn: () => getRecentProducts(4) });

// Store page: one "page" = one request. fetchNextPage() asks for the next one.
export function useProducts({ search, sort }: { search: string; sort?: ProductSort }) {
  return useInfiniteQuery({
    queryKey: ["products", "list", { search, sort }], // new filters = new list from page 1
    queryFn: ({ pageParam }) => getProductsPage({ page: pageParam, search, sort }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
  });
}

export const useProduct = (productId: string) => useQuery({ queryKey: ["products", "details", productId], queryFn: () => getProduct(productId) });

// The invoice for the local cart. The cart is sent to the backend, which does the maths.
// Quantity buttons can be clicked fast, so we wait 350ms after the last change before asking.
export function useCartTotals(items: CartItem[]) {
  const payload = JSON.stringify(items.map(({ productId, quantity }) => ({ productId, quantity })));
  const settled = useDebounce(payload, 350);

  const query = useQuery({
    queryKey: ["cart", "totals", settled],
    queryFn: () => calculateCart(JSON.parse(settled)),
    enabled: items.length > 0,
    staleTime: 0, // prices and stock can change: always recheck when the cart opens
    placeholderData: keepPreviousData, // keep showing the old invoice while the new one loads
  });
  // true while the numbers on screen belong to the previous cart
  const updating = query.isPlaceholderData || settled !== payload;
  return { ...query, updating };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    // stock changed: product lists must reload
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}
