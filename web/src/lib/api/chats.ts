import { api, toList } from "./client";
import { endpoints } from "@/config/endpoints";
import { env } from "@/config/env";
import { mockChatList, mockConversation, mockUnreadTotal } from "@/lib/mockChats";
import { mockDelay } from "@/lib/mock";
import type { ChatConversation, ChatMessage, ChatPerson, ChatSummary } from "@/types";

const ZERO_ID = "00000000-0000-0000-0000-000000000000";

// Field names come from the backend (getChats / getChatMessages) and from the socket events.
const toPerson = (raw: any): ChatPerson => ({
  id: String(raw?.id ?? raw?._id ?? ""),
  name: raw?.name ?? "Unknown",
  photo: raw?.profilePic ?? null,
  role: raw?.role ?? undefined,
});

// `sender` is an object in messages and sockets, but just an id in the chat list's lastMessage.
export const toChatMessage = (raw: any): ChatMessage | null => {
  if (!raw || raw.id == null) return null; // a chat with no messages yet has an empty lastMessage
  const sender = raw.sender;
  const senderId = sender && typeof sender === "object" ? String(sender.id ?? "") : String(sender ?? "");
  return {
    id: String(raw.id),
    chatId: String(raw.chatId ?? ""),
    text: raw.text ?? "",
    image: raw.image ?? null,
    senderId,
    createdAt: new Date(raw.createdAt ?? Date.now()).toISOString(),
    deleted: !!raw.isDeleted,
    system: String(raw.id) === ZERO_ID || senderId === ZERO_ID,
  };
};

// Used for the REST list AND for the socket's "chat_updated" event (same shape).
export const toChatSummary = (raw: any): ChatSummary => ({
  id: String(raw?.id),
  person: toPerson(raw?.person),
  lastMessage: toChatMessage(raw?.lastMessage),
  unreadCount: Number(raw?.unreadCount ?? 0),
  updatedAt: new Date(raw?.updatedAt ?? Date.now()).toISOString(),
});

export async function getChats(): Promise<ChatSummary[]> {
  if (env.useMock) return mockDelay(mockChatList(), 600);
  const res = await api.get(endpoints.chats);
  return toList(res.data, "chats").map(toChatSummary);
}

export async function getConversation(chatId: string): Promise<ChatConversation> {
  if (env.useMock) return mockDelay(mockConversation(chatId), 600);
  const res = await api.get(endpoints.chatMessages(chatId));
  const body = res.data?.data ?? res.data;
  return {
    chatId: String(body?.chatId ?? chatId),
    person: toPerson(body?.user),
    messages: (body?.messages ?? []).map(toChatMessage).filter((m: ChatMessage | null): m is ChatMessage => m !== null),
  };
}

// Photos go over REST first; the backend answers with a url, and THAT url is what we send through the socket.
export async function uploadChatImage(file: File): Promise<string> {
  if (env.useMock) return mockDelay(URL.createObjectURL(file), 700);
  const form = new FormData();
  form.append("image", file); // TODO: use the field name your multer setup expects
  const res = await api.post(endpoints.chatUpload, form);
  const url = res.data?.image ?? res.data?.data?.image;
  if (!url) throw new Error("Upload failed");
  return String(url);
}

// The total number of unread messages (the badge next to "Chats").
// TODO: the backend route is not built yet. It should answer with the number (or { count }).
export async function getUnreadMessagesCount(): Promise<number> {
  if (env.useMock) return mockDelay(mockUnreadTotal(), 300);
  const res = await api.get(endpoints.unreadMessagesCount);
  const body = res.data?.data ?? res.data;
  return Number(typeof body === "number" || typeof body === "string" ? body : (body?.count ?? body?.unreadCount ?? 0)) || 0;
}
