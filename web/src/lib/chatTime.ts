const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

// "09:41"
export const chatClock = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

// Chat list: today -> "09:41", yesterday -> "Yesterday", this week -> "Mon", older -> "24 Jun"
export function chatListTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (sameDay(d, now)) return chatClock(iso);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";
  const days = (now.getTime() - d.getTime()) / 86_400_000;
  return days < 7 ? d.toLocaleDateString("en-GB", { weekday: "short" }) : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Separator inside a conversation: "Today", "Yesterday", "Wed, 24 June 2026"
export function chatDayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (sameDay(d, now)) return "Today";
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}
