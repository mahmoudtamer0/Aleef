import { ChatsShell } from "@/components/ChatsShell/ChatsShell";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return <ChatsShell>{children}</ChatsShell>;
}
