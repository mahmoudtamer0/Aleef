import { mockUser } from "@/lib/mock";
import { clearMockUnread, mockPeople } from "@/lib/mockChats";
import { addMockNotification } from "@/lib/mockNotifications";

type Handler = (...args: any[]) => void;

const replies = ["Thanks for the details!", "Noted. Anything else I should know?", "Sounds good, see you then.", "Please send me a photo if you can."];

// Pretends to be the server in mock mode: echoes your message and, a moment later, the doctor answers.
export class MockSocket {
  connected = false;
  private handlers = new Map<string, Set<Handler>>();

  constructor() {
    setTimeout(() => {
      this.connected = true;
      this.fire("connect");
    }, 300);

    // a few seconds later the "doctor" accepts an appointment, so you can watch the bell and the toast react
    setTimeout(() => {
      const payload = {
        type: "APPOINTMENT_ACCEPTED",
        title: "Appointment Accepted ✅",
        body: "Doctor Ramy Medawer has accepted your appointment",
        data: { type: "appointment", appointmentId: "a1" },
      };
      addMockNotification({ id: `n-${Date.now()}`, title: payload.title, body: payload.body, createdAt: new Date().toISOString(), read: false, data: { type: "appointment", appointmentId: "a1" } });
      this.fire("notification", payload);
    }, 8000);
  }

  on(event: string, cb: Handler) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(cb);
    return this;
  }
  off(event: string, cb: Handler) {
    this.handlers.get(event)?.delete(cb);
    return this;
  }
  disconnect() {
    this.connected = false;
    this.handlers.clear();
  }

  emit(event: string, data?: any) {
    if (event === "join_chat") clearMockUnread(data?.chatId);
    if (event !== "send_message") return this;
    const { chatId, message, image } = data ?? {};
    const mine = { id: crypto.randomUUID(), chatId, text: message, image: image ?? null, sender: { id: mockUser.id, name: mockUser.name }, createdAt: new Date().toISOString(), isDeleted: false };
    const person = mockPeople[chatId] ?? mockPeople.c1;

    this.fire("receive_message", mine);
    this.fire("chat_updated", { id: chatId, person: { _id: person.id, name: person.name, profilePic: null }, lastMessage: mine, unreadCount: 0, updatedAt: mine.createdAt });

    setTimeout(() => {
      const reply = { id: crypto.randomUUID(), chatId, text: replies[Math.floor(Math.random() * replies.length)], image: null, sender: { id: person.id, name: person.name }, createdAt: new Date().toISOString(), isDeleted: false };
      this.fire("receive_message", reply);
      this.fire("chat_updated", { id: chatId, person: { _id: person.id, name: person.name, profilePic: null }, lastMessage: reply, unreadCount: 1, updatedAt: reply.createdAt });
    }, 1600);
    return this;
  }

  private fire(event: string, ...args: any[]) {
    this.handlers.get(event)?.forEach((cb) => cb(...args));
  }
}
