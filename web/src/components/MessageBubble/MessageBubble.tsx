import Image from "next/image";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { chatClock } from "@/lib/chatTime";
import { cx } from "@/lib/utils";
import type { ChatMessage, ChatPerson } from "@/types";
import styles from "./MessageBubble.module.css";

type Props = {
  message: ChatMessage;
  mine: boolean;
  person: ChatPerson;
  /** the other person's avatar, shown at the end of their group of messages */
  showAvatar: boolean;
  /** last message of a group: gets the "tail" corner */
  groupEnd: boolean;
  onOpenImage: (src: string) => void;
};

export function MessageBubble({ message, mine, person, showAvatar, groupEnd, onOpenImage }: Props) {
  if (message.system) {
    return (
      <div className={styles.system}>
        <span className={styles.systemText}>{message.text}</span>
      </div>
    );
  }

  const hasPhoto = !!message.image && !message.deleted;

  return (
    <div className={cx(styles.row, mine && styles.mine)}>
      {!mine && <span className={styles.avatarSlot}>{showAvatar && <ChatAvatar name={person.name} src={person.photo} size={32} />}</span>}

      <div className={cx(styles.bubble, mine ? styles.mineBubble : styles.theirs, groupEnd && (mine ? styles.mineEnd : styles.theirsEnd), hasPhoto && styles.photoBubble)}>
        {hasPhoto && message.image && (
          <button type="button" aria-label="Open photo" onClick={() => onOpenImage(message.image as string)} className={styles.photo}>
            <Image src={message.image} alt="Photo in chat" fill sizes="260px" style={{ objectFit: "cover" }} />
          </button>
        )}
        {message.deleted ? (
          <p className={styles.deleted}>This message was deleted</p>
        ) : (
          message.text && <p className={cx(styles.text, hasPhoto && styles.caption)}>{message.text}</p>
        )}
        <time dateTime={message.createdAt} className={styles.time}>{chatClock(message.createdAt)}</time>
      </div>
    </div>
  );
}
