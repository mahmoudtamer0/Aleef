import { useQuery, type QueryClient } from "@tanstack/react-query";
import { getChats, getConversation, getUnreadMessagesCount } from "@/lib/api/chats";
import type { ChatConversation, ChatMessage, ChatSummary } from "@/types";

export const chatKeys = {
  list: ["chats", "list"] as const,
  conversation: (chatId: string) => ["chats", "conversation", chatId] as const,
  unread: ["chats", "unread"] as const,
};

// Left side: all my chats. The socket keeps it fresh (see the cache helpers below).
export const useChats = () => useQuery({ queryKey: chatKeys.list, queryFn: getChats, staleTime: 30_000 });

// The number next to "Chats" in the navbar: all unread messages together.
export const useUnreadMessagesCount = () => useQuery({ queryKey: chatKeys.unread, queryFn: getUnreadMessagesCount, staleTime: 60_000 });

// Middle: one chat with all its messages. Always reload when opened: messages may have arrived while we were away.
export const useConversation = (chatId: string) =>
  useQuery({ queryKey: chatKeys.conversation(chatId), queryFn: () => getConversation(chatId), staleTime: 0, refetchOnMount: "always" });

// ---------------- live updates: the SocketProvider calls these when the server pushes something ----------------

// "receive_message": add it to the open conversation (if we already have it, ignore).
export function addMessageToCache(queryClient: QueryClient, message: ChatMessage) {
  queryClient.setQueryData<ChatConversation>(chatKeys.conversation(message.chatId), (old) => {
    if (!old || old.messages.some((m) => m.id === message.id)) return old;
    return { ...old, messages: [...old.messages, message] };
  });
}

// If the chat list is loaded, the total unread is just the sum of its rows (always exact).
function syncUnreadFromList(queryClient: QueryClient) {
  const list = queryClient.getQueryData<ChatSummary[]>(chatKeys.list);
  if (list) queryClient.setQueryData<number>(chatKeys.unread, list.reduce((sum, c) => sum + c.unreadCount, 0));
}

// "chat_updated": new last message / unread count. The chat jumps to the top of the list.
// `isFromOther`: someone else wrote it and the chat is not open -> it is a new unread message for me.
export function updateChatInCache(queryClient: QueryClient, summary: ChatSummary, isFromOther = false) {
  const list = queryClient.getQueryData<ChatSummary[]>(chatKeys.list);
  queryClient.setQueryData<ChatSummary[]>(chatKeys.list, (old) => (old ? [summary, ...old.filter((c) => c.id !== summary.id)] : old));
  if (list) syncUnreadFromList(queryClient);
  else if (isFromOther) queryClient.setQueryData<number>(chatKeys.unread, (old) => (old === undefined ? old : old + 1));
}

// The user opened the chat: its unread badge goes away, and the total next to "Chats" goes down.
export function markChatRead(queryClient: QueryClient, chatId: string) {
  queryClient.setQueryData<ChatSummary[]>(chatKeys.list, (old) => old?.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)));
  syncUnreadFromList(queryClient);
}
