"use client";

import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { addMessageToCache, updateChatInCache } from "@/hooks/useChats";
import { addLiveNotification } from "@/hooks/useNotifications";
import { useToasts } from "@/hooks/useToasts";
import { toChatMessage, toChatSummary } from "@/lib/api/chats";
import { toLiveNotification } from "@/lib/api/notifications";
import { getNotificationHref } from "@/lib/notificationRoutes";
import { createSocket, type ChatSocket } from "@/lib/socket";
import { tokenStorage } from "@/lib/storage";

type SocketContextValue = { socket: ChatSocket | null; connected: boolean };

export const SocketContext = createContext<SocketContextValue | null>(null);

// Opens ONE socket for the whole logged-in app and turns what the server pushes into React Query cache updates.
// Components never listen to the socket for data: they just read the cache.
export function SocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const myId = useRef(user?.id); // a ref: the socket handlers below must always see the latest id
  myId.current = user?.id;
  const [socket, setSocket] = useState<ChatSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const wasConnected = useRef(false);

  useEffect(() => {
    const s = createSocket(tokenStorage.get());
    setSocket(s);

    const onConnect = () => {
      setConnected(true);
      // we were offline for a while: anything may have changed
      if (wasConnected.current) queryClient.invalidateQueries({ queryKey: ["chats"] });
      wasConnected.current = true;
    };
    const onDisconnect = () => setConnected(false);

    const onMessage = (raw: unknown) => {
      const message = toChatMessage(raw);
      if (message) addMessageToCache(queryClient, message);
    };
    const onChatUpdated = (raw: unknown) => {
      const summary = toChatSummary(raw);
      // a chat that is open on screen is already read
      const openChatId = window.location.pathname.match(/^\/chats\/([^/]+)/)?.[1];
      if (summary.id === openChatId) summary.unreadCount = 0;
      // someone else wrote it, and I am not looking at that chat: a new unread message
      const isFromOther = !!summary.lastMessage && summary.lastMessage.senderId !== myId.current && summary.id !== openChatId;
      updateChatInCache(queryClient, summary, isFromOther);
    };

    // The server says something happened ("Appointment Accepted"...): bell +1, a popup, and refresh what it is about.
    const onNotification = (raw: unknown) => {
      console.log("socket notification:", raw);
      const notification = toLiveNotification(raw);
      addLiveNotification(queryClient, notification);
      useToasts.getState().push({ title: notification.title, body: notification.body, href: getNotificationHref(notification.data), type: notification.data.type });
      // an appointment changed: the upcoming card and the details page must show the new status right away
      if (notification.data.type === "appointment") queryClient.invalidateQueries({ queryKey: ["appointments"] });
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("receive_message", onMessage);
    s.on("chat_updated", onChatUpdated);
    s.on("notification", onNotification);
    if (s.connected) onConnect();

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("receive_message", onMessage);
      s.off("chat_updated", onChatUpdated);
      s.off("notification", onNotification);
      s.disconnect();
      setSocket(null);
      setConnected(false);
      wasConnected.current = false;
    };
  }, [queryClient]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
