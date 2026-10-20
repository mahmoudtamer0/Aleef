import { useCallback, useEffect, useRef, useState } from "react";
import "./Chats.css";
import type { Chat, Message } from "../../types/chat";

const LIMIT = 10;

export default function ChatMonitoring() {

    const [chats, setChats] = useState<Chat[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalChats, setTotalChats] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const getInitials = (name: string) => {
        return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (date: string) => {
        const current = new Date();
        const target = new Date(date);
        const yesterday = new Date();
        yesterday.setDate(current.getDate() - 1);
        if (target.toDateString() === current.toDateString()) return "Today";
        if (target.toDateString() === yesterday.toDateString()) return "Yesterday";
        return target.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const groupMessages = (msgs: Message[]) => {
        const grouped: { label: string; items: Message[] }[] = [];
        msgs.forEach((msg) => {
            const date = new Date(msg.createdAt).toDateString();
            const lastGroup = grouped[grouped.length - 1];
            if (lastGroup && lastGroup.label === date) {
                lastGroup.items.push(msg);
            } else {
                grouped.push({ label: date, items: [msg] });
            }
        });
        return grouped;
    };

    const fetchChats = useCallback(async () => {
        setLoadingChats(true);
        try {
            const params = new URLSearchParams();
            params.append("page", String(page));
            params.append("limit", String(LIMIT));
            if (search) params.append("search", search);
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/chats/all?${params.toString()}`,
                { headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` } }
            );
            const data = await response.json();
            setChats(data.chats || []);
            setTotalPages(data.totalPages || 1);
            setTotalChats(data.totalChats || 0);
        } catch (error) {
            console.log(error);
            setChats([]);
        } finally {
            setLoadingChats(false);
        }
    }, [page, search]);

    useEffect(() => { fetchChats(); }, [fetchChats]);
    useEffect(() => { setPage(1); }, [search]);

    const fetchMessages = async (chat: Chat) => {
        setSelectedChat(chat);
        setLoadingMessages(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/chats/${chat.id}/messages/admin`,
                { headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` } }
            );
            const data = await response.json();
            setMessages(data.messages?.messages || data.messages || []);
        } catch (error) {
            console.log(error);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };

    const getChatName = (chat: Chat) => {
        const members = chat.memberDetails || [];
        if (members.length < 2) return "Unknown";
        return `${members[0].name} ↔ ${members[1].name}`;
    };

    return (
        <div className="cm-page">

            <div className="cm-page-header">
                <h1 className="cm-page-title">Chat Monitoring</h1>
                <p className="cm-page-subtitle">Monitor chats between users and doctors</p>
            </div>

            <div className={`cm-layout ${selectedChat ? "chat-selected" : ""}`}>

                {/* ── Sidebar ── */}
                <div className="cm-sidebar">

                    <div className="cm-sidebar-header">
                        <div className="cm-sidebar-top">
                            <span className="cm-sidebar-title">Conversations</span>
                            {totalChats > 0 && (
                                <span className="cm-sidebar-count">{totalChats}</span>
                            )}
                        </div>

                        <form className="cm-search-form" onSubmit={handleSearch}>
                            <div className="cm-search-wrap">
                                <input
                                    type="text"
                                    className="cm-search-input"
                                    placeholder="Search..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        className="cm-search-clear"
                                        onClick={() => { setSearchInput(""); setSearch(""); }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="cm-chat-list">
                        {loadingChats ? (
                            <div className="cm-list-loading"><div className="cm-spinner" /></div>
                        ) : chats.length === 0 ? (
                            <div className="cm-list-empty">No conversations found</div>
                        ) : (
                            chats.map((chat) => {
                                const members = chat.memberDetails || [];
                                const firstMember = members[0];
                                const secondMember = members[1];
                                const active = selectedChat?.id === chat.id;
                                return (
                                    <div
                                        key={chat.id}
                                        className={`cm-chat-item ${active ? "cm-chat-item--active" : ""}`}
                                        onClick={() => fetchMessages(chat)}
                                    >
                                        <div className="cm-avatar">
                                            {firstMember?.profilePic ? (
                                                <img src={firstMember.profilePic} alt={firstMember.name} className="cm-avatar-img" />
                                            ) : (
                                                <div className="cm-avatar-fallback">
                                                    {getInitials(firstMember?.name || "?")}
                                                </div>
                                            )}
                                        </div>
                                        <div className="cm-chat-item-info">
                                            <div className="cm-chat-item-name">{firstMember?.name || "Unknown"}</div>
                                            <div className="cm-chat-item-sub">{secondMember?.name || "Unknown"}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="cm-sidebar-pagination">
                            <button className="cm-page-btn" disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>Prev</button>
                            <span className="cm-page-info">{page} / {totalPages}</span>
                            <button className="cm-page-btn" disabled={page === totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
                        </div>
                    )}

                </div>

                {/* ── Main ── */}
                <div className="cm-main">
                    {!selectedChat ? (
                        <div className="cm-empty-state">
                            <p>Select a chat to start monitoring</p>
                        </div>
                    ) : (
                        <>
                            <div className="cm-chat-header">
                                {/* زرار رجوع على الموبايل فقط */}
                                <button
                                    className="cm-back-btn"
                                    onClick={() => setSelectedChat(null)}
                                >
                                    ←
                                </button>
                                <div>
                                    <div className="cm-chat-header-title">{getChatName(selectedChat)}</div>
                                    <div className="cm-chat-header-sub">Conversation monitoring</div>
                                </div>
                            </div>

                            <div className="cm-messages">
                                {loadingMessages ? (
                                    <div className="cm-messages-loading"><div className="cm-spinner" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="cm-messages-empty">No messages found</div>
                                ) : (
                                    groupMessages(messages).map((group) => (
                                        <div key={group.label}>
                                            <div className="cm-date-sep">
                                                <span>{formatDate(group.items[0].createdAt)}</span>
                                            </div>
                                            {group.items.map((msg) => {
                                                const isDoctor = msg.senderModel === "Doctor";
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`cm-msg-row ${isDoctor ? "cm-msg-row--right" : "cm-msg-row--left"}`}
                                                    >
                                                        {!isDoctor && (
                                                            <div className="cm-msg-avatar">
                                                                {msg.sender?.profilePic ? (
                                                                    <img src={msg.sender.profilePic} alt={msg.sender.name} />
                                                                ) : (
                                                                    <div className="cm-msg-avatar-fallback">
                                                                        {getInitials(msg.sender?.name || "?")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className={`cm-bubble ${isDoctor ? "cm-bubble--doctor" : "cm-bubble--user"}`}>
                                                            <div className="cm-bubble-sender">{msg.sender?.name}</div>
                                                            <div className="cm-bubble-text">
                                                                {msg.isDeleted ? (
                                                                    <em className="cm-deleted">Message deleted</em>
                                                                ) : (
                                                                    msg.text
                                                                )}
                                                            </div>
                                                            <div className="cm-bubble-time">{formatTime(msg.createdAt)}</div>
                                                        </div>

                                                        {isDoctor && (
                                                            <div className="cm-msg-avatar">
                                                                {msg.sender?.profilePic ? (
                                                                    <img src={msg.sender.profilePic} alt={msg.sender.name} />
                                                                ) : (
                                                                    <div className="cm-msg-avatar-fallback">
                                                                        {getInitials(msg.sender?.name || "?")}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}