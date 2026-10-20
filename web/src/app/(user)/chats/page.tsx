import type { Metadata } from "next";
import { ChatEmpty } from "@/components/ChatEmpty/ChatEmpty";

export const metadata: Metadata = { title: "Messages" };

export default function ChatsPage() {
  return <ChatEmpty />;
}
