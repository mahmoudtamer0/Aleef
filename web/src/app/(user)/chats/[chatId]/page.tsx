import type { Metadata } from "next";
import { Conversation } from "@/components/Conversation/Conversation";

export const metadata: Metadata = { title: "Chat" };

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  return <Conversation key={chatId} chatId={chatId} />;
}
