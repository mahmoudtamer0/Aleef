import Link from "next/link";
import { Camera } from "lucide-react";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { routes } from "@/config/routes";
import { chatListTime } from "@/lib/chatTime";
import { cx } from "@/lib/utils";
import type { ChatSummary } from "@/types";
import styles from "./ChatListItem.module.css";

type Props = { chat: ChatSummary; active: boolean; myId?: string };

export function ChatListItem({ chat, active, myId }: Props) {
  const { person, lastMessage } = chat;
  const unread = active ? 0 : chat.unreadCount; // an open chat is already read
  const mine = lastMessage?.senderId === myId;

  return (
    <Link href={routes.chat(chat.id)} aria-current={active ? "page" : undefined} className={cx(styles.item, active && styles.active)}>
      <ChatAvatar name={person.name} src={person.photo} size={52} />
      <div className={styles.text}>
        <div className={styles.top}>
          <span className={styles.name}>{person.name}</span>
          {lastMessage && <span className={cx(styles.time, unread > 0 && styles.timeUnread)}>{chatListTime(lastMessage.createdAt)}</span>}
        </div>
        <div className={styles.bottom}>
          <span className={cx(styles.preview, unread > 0 && styles.previewUnread)}>
            {!lastMessage ? (
              "No messages yet"
            ) : lastMessage.deleted ? (
              "Message deleted"
            ) : (
              <>
                {mine && "You: "}
                {lastMessage.image && !lastMessage.text ? <><Camera aria-hidden size={15} /> Photo</> : lastMessage.system ? "Chat closed" : lastMessage.text}
              </>
            )}
          </span>
          {unread > 0 && <span className={styles.badge} aria-label={`${unread} unread`}>{unread > 99 ? "99+" : unread}</span>}
        </div>
      </div>
    </Link>
  );
}
