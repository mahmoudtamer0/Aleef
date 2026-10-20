"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/Button/Button";
import { ChatListItem } from "@/components/ChatListItem/ChatListItem";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import styles from "./ChatList.module.css";

// Left side: all my chats, newest first. Updates live (the socket writes into the same cache).
export function ChatList() {
  const { chatId } = useParams<{ chatId?: string }>();
  const { user } = useAuth();
  const { data: chats, isLoading, isError, refetch } = useChats();
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const visible = chats?.filter((c) => c.person.name.toLowerCase().includes(term)) ?? [];

  return (
    <section className={styles.card} aria-label="Chats">
      <header className={styles.head}>
        <h1 className={styles.title}>Messages</h1>
        <label className={styles.search}>
          <Search aria-hidden size={18} />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats" aria-label="Search chats" className={styles.input} />
        </label>
      </header>

      <div className={styles.items}>
        {isLoading ? (
          <div className={styles.skeletons}>
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} height={52} radius={16} />)}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't load your chats." onRetry={() => refetch()} />
        ) : chats && chats.length === 0 ? (
          <div className={styles.empty}>
            <MessageCircle aria-hidden size={36} />
            <b className={styles.emptyTitle}>No conversations yet</b>
            <span>A chat opens when a doctor accepts your appointment.</span>
            <Button href={routes.appointments} size="sm">Find a doctor</Button>
          </div>
        ) : visible.length === 0 ? (
          <p className={styles.noMatch}>No chats match &ldquo;{search}&rdquo;.</p>
        ) : (
          visible.map((chat) => <ChatListItem key={chat.id} chat={chat} active={chat.id === chatId} myId={user?.id} />)
        )}
      </div>
    </section>
  );
}
