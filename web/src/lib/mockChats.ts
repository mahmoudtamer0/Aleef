import type { ChatConversation, ChatMessage, ChatPerson, ChatSummary } from "@/types";
import { mockUser } from "@/lib/mock";

// Mock mode only: a few conversations so the whole chat UI can be tried without a backend.
const ME = mockUser.id;

export const mockPeople: Record<string, ChatPerson> = {
  c1: { id: "d1", name: "Dr. Ramy Medawer", photo: null, role: "Doctor" },
  c2: { id: "d2", name: "Dr. Sara Hassan", photo: null, role: "Doctor" },
  c3: { id: "d3", name: "Dr. Omar Fathy", photo: null, role: "Doctor" },
};

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const DAY = 1440;

function m(chatId: string, id: string, senderId: string, text: string, minutesAgo: number, image?: string): ChatMessage {
  return { id: `${chatId}-${id}`, chatId, text, image: image ?? null, senderId, createdAt: ago(minutesAgo) };
}

const conversations: Record<string, ChatMessage[]> = {
  c1: [
    m("c1", "1", ME, "Hello doctor, Cheetos has been sneezing a little.", 2 * DAY + 30),
    m("c1", "2", "d1", "Hello! Since when? Any change in his appetite?", 2 * DAY + 24),
    m("c1", "3", ME, "Two days. His appetite is normal.", 2 * DAY + 20),
    m("c1", "4", "d1", "Good. Keep an eye on him and we'll check him at the appointment.", DAY + 90),
    m("c1", "5", "d1", "Please bring his vaccination card.", 55),
    m("c1", "6", "d1", "Is 9:00 still good for you?", 54),
  ],
  c2: [m("c2", "1", "d2", "Your booking is confirmed.", 3 * DAY), m("c2", "2", ME, "Thank you!", 3 * DAY - 5)],
  c3: [m("c3", "1", ME, "Can I move the visit to next week?", 6 * DAY), m("c3", "2", "d3", "Of course, pick any free day from the booking page.", 6 * DAY - 12)],
};

const unread: Record<string, number> = { c1: 2, c2: 0, c3: 0 };

// the mock server "remembers" what was read
export const clearMockUnread = (chatId: string) => {
  unread[chatId] = 0;
};
export const mockUnreadTotal = () => Object.values(unread).reduce((sum, n) => sum + n, 0);

export function mockChatList(): ChatSummary[] {
  return Object.keys(conversations)
    .map((id) => {
      const messages = conversations[id];
      const last = messages[messages.length - 1];
      return { id, person: mockPeople[id], lastMessage: last, unreadCount: unread[id] ?? 0, updatedAt: last.createdAt };
    })
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function mockConversation(chatId: string): ChatConversation {
  const id = conversations[chatId] ? chatId : "c1";
  return { chatId, person: mockPeople[id], messages: conversations[id].map((x) => ({ ...x, chatId })) };
}
