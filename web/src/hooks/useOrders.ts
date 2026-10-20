import { useQuery } from "@tanstack/react-query";
import { getMyOrders, getOrder } from "@/lib/api/orders";

export const useOrders = () => useQuery({ queryKey: ["orders", "list"], queryFn: getMyOrders });
export const useOrder = (orderId: string) => useQuery({ queryKey: ["orders", "details", orderId], queryFn: () => getOrder(orderId) });
