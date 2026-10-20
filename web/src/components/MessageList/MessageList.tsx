"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { MessageBubble } from "@/components/MessageBubble/MessageBubble";
import { chatDayLabel } from "@/lib/chatTime";
import type { ChatMessage, ChatPerson } from "@/types";
import styles from "./MessageList.module.css";

type Props = { messages: ChatMessage[]; myId?: string; person: ChatPerson; onOpenImage: (src: string) => void };

type Row =
  | { kind: "day"; key: string; label: string }
  | { kind: "message"; key: string; message: ChatMessage; mine: boolean; showAvatar: boolean; groupEnd: boolean; newGroup: boolean };

const GROUP_GAP_MS = 5 * 60_000;

// day separators + grouping of messages sent close together by the same person
function buildRows(messages: ChatMessage[], myId?: string): Row[] {
  const rows: Row[] = [];
  let lastDay = "";
  messages.forEach((m, i) => {
    const day = new Date(m.createdAt).toDateString();
    if (day !== lastDay) {
      rows.push({ kind: "day", key: `day-${day}`, label: chatDayLabel(m.createdAt) });
      lastDay = day;
    }
    const near = (a?: ChatMessage, b?: ChatMessage) =>
      !!a && !!b && !a.system && !b.system && a.senderId === b.senderId && Math.abs(+new Date(b.createdAt) - +new Date(a.createdAt)) < GROUP_GAP_MS && new Date(a.createdAt).toDateString() === new Date(b.createdAt).toDateString();
    const sameAsPrev = near(messages[i - 1], m);
    const sameAsNext = near(m, messages[i + 1]);
    rows.push({ kind: "message", key: m.id, message: m, mine: m.senderId === myId, showAvatar: !sameAsNext, groupEnd: !sameAsNext, newGroup: !sameAsPrev });
  });
  return rows;
}

export function MessageList({ messages, myId, person, onOpenImage }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const lastCount = useRef(messages.length);
  const [unseen, setUnseen] = useState(0);
  const rows = useMemo(() => buildRows(messages, myId), [messages, myId]);

  const scrollToBottom = (smooth: boolean) => scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });

  // opening a chat: start at the newest message
  useLayoutEffect(() => scrollToBottom(false), []);

  // a new message: follow it if the user is at the bottom (or wrote it), otherwise show the "New messages" button
  useEffect(() => {
    const added = messages.length - lastCount.current;
    lastCount.current = messages.length;
    if (added <= 0) return;
    if (nearBottom.current || messages[messages.length - 1]?.senderId === myId) {
      scrollToBottom(true);
      setUnseen(0);
    } else {
      setUnseen((n) => n + added);
    }
  }, [messages, myId]);

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom.current) setUnseen(0);
  }

  return (
    <div className={styles.wrap}>
      <div ref={scroller} onScroll={onScroll} className={styles.scroller} role="log" aria-live="polite" aria-label="Messages">
        {messages.length === 0 && <p className={styles.empty}>No messages yet. Say hello to {person.name}!</p>}
        {rows.map((row) =>
          row.kind === "day" ? (
            <span key={row.key} className={styles.day}>{row.label}</span>
          ) : (
            <div key={row.key} className={row.newGroup ? styles.groupGap : undefined}>
              <MessageBubble message={row.message} mine={row.mine} person={person} showAvatar={row.showAvatar} groupEnd={row.groupEnd} onOpenImage={onOpenImage} />
            </div>
          ),
        )}
      </div>

      {unseen > 0 && (
        <button type="button" className={styles.newPill} onClick={() => scrollToBottom(true)}>
          <ArrowDown aria-hidden size={16} /> {unseen} new {unseen === 1 ? "message" : "messages"}
        </button>
      )}
    </div>
  );
}
