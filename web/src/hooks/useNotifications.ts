import { useMutation, useQuery, type QueryClient } from "@tanstack/react-query";
import { getNotifications, getUnreadNotificationsCount, markAllNotificationsRead } from "@/lib/api/notifications";
import type { AppNotification } from "@/types";

export const notificationKeys = {
  unread: ["notifications", "unread"] as const,
  list: ["notifications", "list"] as const,
};

// The number on the bell.
export const useUnreadNotificationsCount = () => useQuery({ queryKey: notificationKeys.unread, queryFn: getUnreadNotificationsCount, staleTime: 60_000 });

// The last 8 notifications. Only loaded when the bell is opened (enabled), and always fresh.
export const useNotifications = (enabled: boolean) => useQuery({ queryKey: notificationKeys.list, queryFn: getNotifications, enabled, staleTime: 0 });

export function useMarkAllNotificationsRead(queryClient: QueryClient) {
  return useMutation({
    mutationFn: markAllNotificationsRead,
    // the badge goes away. (The list keeps its "unread" highlight until it is opened again.)
    onSuccess: () => queryClient.setQueryData<number>(notificationKeys.unread, 0),
  });
}

// ---------------- live: the SocketProvider calls this when the "notification" event arrives ----------------
export function addLiveNotification(queryClient: QueryClient, notification: AppNotification) {
  // +1 on the bell (if the count is not loaded yet, it will include this one when it loads)
  queryClient.setQueryData<number>(notificationKeys.unread, (old) => (old === undefined ? old : old + 1));
  // and at the top of the list, if the list was already loaded
  queryClient.setQueryData<AppNotification[]>(notificationKeys.list, (old) => (old ? [notification, ...old].slice(0, 8) : old));
}
