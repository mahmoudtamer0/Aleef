"use client";

import type { ReactNode } from "react";
import { useParams } from "next/navigation";
import { ChatList } from "@/components/ChatList/ChatList";
import { cx } from "@/lib/utils";
import styles from "./ChatsShell.module.css";

// Two panels: my chats on the left, the open chat in the middle (the page). The list stays mounted while you switch chats.
export function ChatsShell({ children }: { children: ReactNode }) {
  const { chatId } = useParams<{ chatId?: string }>();
  return (
    <div className={cx("rise", styles.shell, chatId && styles.chatOpen)}>
      <div className={styles.list}><ChatList /></div>
      <div className={styles.pane}>{children}</div>
    </div>
  );
}
