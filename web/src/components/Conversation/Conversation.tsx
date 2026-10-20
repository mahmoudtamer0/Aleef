"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, UserRound } from "lucide-react";
import { ChatAvatar } from "@/components/ChatAvatar/ChatAvatar";
import { ChatComposer } from "@/components/ChatComposer/ChatComposer";
import { ErrorState } from "@/components/ErrorState/ErrorState";
import { ImageLightbox } from "@/components/ImageLightbox/ImageLightbox";
import { MessageList } from "@/components/MessageList/MessageList";
import { Skeleton } from "@/components/Skeleton/Skeleton";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { chatKeys, markChatRead, useChats, useConversation } from "@/hooks/useChats";
import { useSocket } from "@/hooks/useSocket";
import styles from "./Conversation.module.css";

// The open chat. Messages come from REST once, then the socket pushes new ones into the same cache.
export function Conversation({ chatId }: { chatId: string }) {
  const { user } = useAuth();
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();
  const query = useConversation(chatId);
  const chats = useChats();
  const [serverError, setServerError] = useState<string | null>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);

  // 1) join the chat's room so the server sends us this chat's messages live (and again after a reconnect)
  useEffect(() => {
    if (!socket || !connected) return;
    socket.emit("join_chat", { chatId });
    return () => {
      socket.emit("leave_chat", { chatId });
    };
  }, [socket, connected, chatId]);

  // 2) opening the chat clears its unread badge in the list and lowers the number next to "Chats"
  useEffect(() => {
    markChatRead(queryClient, chatId);
    // a moment later (the server needs to process "join_chat") ask the server for the exact total
    const id = setTimeout(() => queryClient.invalidateQueries({ queryKey: chatKeys.unread }), 1000);
    return () => clearTimeout(id);
  }, [chatId, queryClient]);

  // 3) the server can refuse a message (empty, too long...) with an "error_message" event
  useEffect(() => {
    if (!socket) return;
    const onError = (payload: { errMessage?: string }) => setServerError(payload?.errMessage ?? "The message could not be sent.");
    socket.on("error_message", onError);
    return () => {
      socket.off("error_message", onError);
    };
  }, [socket]);
  useEffect(() => {
    if (!serverError) return;
    const id = setTimeout(() => setServerError(null), 5000);
    return () => clearTimeout(id);
  }, [serverError]);

  const person = query.data?.person ?? chats.data?.find((c) => c.id === chatId)?.person;
  const closed = query.data?.messages.some((m) => m.system) ?? false; // the backend closes expired chats with a system message
  const isDoctor = person?.role?.toLowerCase() === "doctor";

  function send({ text, image }: { text: string; image: string | null }) {
    // `message` must always be a string: the server calls .trim() on it
    socket?.emit("send_message", { chatId, message: text, image });
  }

  return (
    <section className={styles.card} aria-label={person ? `Chat with ${person.name}` : "Chat"}>
      <header className={styles.header}>
        <div aria-hidden className={styles.orb} />
        <Link href={routes.chats} aria-label="Back to chats" className={`${styles.back} d-lg-none`}>
          <ArrowLeft aria-hidden size={20} />
        </Link>
        {person ? <ChatAvatar name={person.name} src={person.photo} size={46} onDark /> : <Skeleton width={46} height={46} radius={23} onDark />}
        <div className={styles.who}>
          {person ? <h2 className={styles.name}>{person.name}</h2> : <Skeleton width={150} height={20} radius={8} onDark />}
          <span className={styles.status}>
            <span className={`${styles.dot} ${connected ? "" : styles.dotOff}`} />
            {connected ? (isDoctor ? "Doctor" : "Pet owner") : "Connecting…"}
          </span>
        </div>
        {person && isDoctor && (
          <Link href={routes.doctor(person.id)} aria-label={`View ${person.name}'s profile`} className={styles.profile}>
            <UserRound aria-hidden size={20} />
          </Link>
        )}
      </header>

      {!connected && !query.isLoading && <div className={`${styles.banner} ${styles.offline}`}>Reconnecting… your messages will send once we&apos;re back.</div>}
      {serverError && (
        <div role="alert" className={`${styles.banner} ${styles.alert}`}>
          {serverError}
          <button type="button" onClick={() => setServerError(null)} className={styles.dismiss}>OK</button>
        </div>
      )}

      {query.isLoading ? (
        <div className={styles.skeletons}>
          <div className={styles.skeletonTheirs}><Skeleton height={44} radius={20} /></div>
          <div className={styles.skeletonMine}><Skeleton height={44} radius={20} /></div>
          <div className={styles.skeletonTheirs}><Skeleton height={70} radius={20} /></div>
          <div className={styles.skeletonMine}><Skeleton height={44} radius={20} /></div>
        </div>
      ) : query.isError || !query.data ? (
        <div className={styles.failed}><ErrorState message="We couldn't open this chat." onRetry={() => query.refetch()} /></div>
      ) : (
        <MessageList messages={query.data.messages} myId={user?.id} person={query.data.person} onOpenImage={setOpenImage} />
      )}

      <ChatComposer disabled={closed || !connected} disabledNote={closed ? "This chat is closed." : undefined} onSend={send} />
      <ImageLightbox src={openImage} onClose={() => setOpenImage(null)} />
    </section>
  );
}
