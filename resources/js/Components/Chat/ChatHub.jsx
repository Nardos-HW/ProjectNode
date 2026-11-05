import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import MessageBubble from '@/Components/Chat/MessageBubble';
import MessageComposer from '@/Components/Chat/MessageComposer';
import { useChatPolling } from '@/hooks/useChatPolling';
import { Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowDown,
    AlertTriangle,
    Search,
    MessageSquare,
    Sparkles,
} from 'lucide-react';
import axios from 'axios';

export default function ChatHub({
    conversations = [],
    activeConversation: initialActiveConversation = null,
    messages: initialMessages = [],
    hasEarlierMessages: initialHasEarlier = false,
    readUpTo: initialReadUpTo = null,
}) {
    const convList = useMemo(() => {
        const raw = conversations?.data || conversations || [];
        return Array.isArray(raw) ? raw : [];
    }, [conversations]);

    // Choose default active conversation
    const active = useMemo(() => {
        if (initialActiveConversation) {
            return initialActiveConversation?.data || initialActiveConversation;
        }
        return convList.length > 0 ? convList[0] : null;
    }, [initialActiveConversation, convList]);

    const initialList = initialMessages?.data || initialMessages || [];

    const [messages, setMessages] = useState(initialList);
    const [hasEarlier, setHasEarlier] = useState(initialHasEarlier);
    const [loadingEarlier, setLoadingEarlier] = useState(false);
    const [readUpTo, setReadUpTo] = useState(initialReadUpTo);
    const [canSend, setCanSend] = useState(active?.can_send ?? true);
    const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileView, setMobileView] = useState(active ? 'chat' : 'list');

    const scrollContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isNearBottomRef = useRef(true);

    // Update state when active conversation or initial messages change
    useEffect(() => {
        setMessages(initialList);
        setHasEarlier(initialHasEarlier);
        setReadUpTo(initialReadUpTo);
        setCanSend(active?.can_send ?? true);
        if (active) {
            setMobileView('chat');
        }
    }, [active?.id, initialMessages, initialHasEarlier, initialReadUpTo]);

    const scrollToBottom = (smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: smooth ? 'smooth' : 'auto',
            });
            setShowScrollBottomBtn(false);
        }
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const nearBottom = distanceFromBottom <= 120;
        isNearBottomRef.current = nearBottom;
        if (nearBottom) {
            setShowScrollBottomBtn(false);
        }
    };

    useEffect(() => {
        if (active) {
            scrollToBottom(false);
        }
    }, [active?.id]);

    const latestMessageId = messages.length > 0 ? Math.max(...messages.map((m) => m.id)) : 0;

    const handleNewMessages = useCallback((incoming) => {
        setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const fresh = incoming.filter((m) => !existingIds.has(m.id));
            if (fresh.length === 0) return prev;

            const next = [...prev, ...fresh].sort((a, b) => a.id - b.id);

            setTimeout(() => {
                if (isNearBottomRef.current) {
                    scrollToBottom(true);
                } else {
                    setShowScrollBottomBtn(true);
                }
            }, 50);

            return next;
        });
    }, []);

    const { pollingError, updateLastId } = useChatPolling({
        conversationId: active?.id,
        initialLastMessageId: latestMessageId,
        onNewMessages: handleNewMessages,
        onReadUpToChange: setReadUpTo,
        onCanSendChange: setCanSend,
    });

    const handleSend = async (bodyText) => {
        if (!active) return;

        const response = await axios.post(route('messages.store', active.id), {
            body: bodyText,
        });

        const createdMessage = response.data?.data || response.data;

        setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            if (existingIds.has(createdMessage.id)) return prev;
            return [...prev, createdMessage].sort((a, b) => a.id - b.id);
        });

        updateLastId(createdMessage.id);

        setTimeout(() => {
            scrollToBottom(true);
        }, 50);
    };

    const handleLoadEarlier = async () => {
        if (!active || loadingEarlier || messages.length === 0) return;

        const oldestId = messages[0].id;
        setLoadingEarlier(true);

        try {
            const response = await axios.get(
                route('messages.history', {
                    conversation: active.id,
                    before: oldestId,
                })
            );

            const { messages: earlier, has_earlier_messages } = response.data;

            if (Array.isArray(earlier) && earlier.length > 0) {
                const scrollContainer = scrollContainerRef.current;
                const oldScrollHeight = scrollContainer ? scrollContainer.scrollHeight : 0;

                setMessages((prev) => {
                    const existingIds = new Set(prev.map((m) => m.id));
                    const fresh = earlier.filter((m) => !existingIds.has(m.id));
                    return [...fresh, ...prev].sort((a, b) => a.id - b.id);
                });

                setHasEarlier(has_earlier_messages);

                setTimeout(() => {
                    if (scrollContainer) {
                        const newScrollHeight = scrollContainer.scrollHeight;
                        scrollContainer.scrollTop += newScrollHeight - oldScrollHeight;
                    }
                }, 20);
            } else {
                setHasEarlier(false);
            }
        } catch (err) {
            // Handled
        } finally {
            setLoadingEarlier(false);
        }
    };

    const myMessages = messages.filter((m) => m.is_mine);
    const latestMyMessageId = myMessages.length > 0 ? myMessages[myMessages.length - 1].id : null;

    const formatDateSeparator = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return date.toLocaleDateString([], {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        });
    };

    const formatRelativeTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;

        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    // Filter conversations
    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return convList;
        const query = searchQuery.toLowerCase();
        return convList.filter((c) => {
            const name = c.counterpart?.name?.toLowerCase() || '';
            const title = c.project?.title?.toLowerCase() || '';
            return name.includes(query) || title.includes(query);
        });
    }, [convList, searchQuery]);

    const selectConversation = (c) => {
        if (c.id === active?.id) {
            setMobileView('chat');
            return;
        }

        router.visit(route('messages.show', c.id), {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <div className="py-4 sm:py-6 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="h-[calc(100vh-8.5rem)] min-h-[580px] max-h-[850px] rounded-2xl bg-carbon-900 border border-carbon-800 shadow-2xl flex overflow-hidden">
                {/* LEFT COLUMN: Conversation List */}
                <aside
                    className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-carbon-800 bg-carbon-950 shrink-0 ${
                        mobileView === 'chat' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-carbon-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold font-display text-white tracking-wide">
                                Messages
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-carbon-850 text-neutral-300 border border-carbon-800">
                                {convList.length}
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="p-3 border-b border-carbon-800/80">
                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-carbon-900 border border-carbon-800 text-xs text-neutral-200 placeholder-neutral-500 focus:border-flame-500 focus:ring-1 focus:ring-flame-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-carbon-800/50">
                        {convList.length === 0 ? (
                            <div className="p-6 text-center text-neutral-400 space-y-2">
                                <MessageSquare className="w-8 h-8 mx-auto text-neutral-600" />
                                <div className="text-xs font-mono font-semibold text-neutral-300">
                                    No conversations yet
                                </div>
                                <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
                                    Accepted project applications automatically open a private chat
                                    here.
                                </p>
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="p-6 text-center text-xs text-neutral-500 font-mono">
                                No matching conversations found.
                            </div>
                        ) : (
                            filteredConversations.map((c) => {
                                const isActive = active?.id === c.id;
                                const counterpartName = c.counterpart?.name || 'Partner';
                                const initials = getInitials(counterpartName);
                                const lastTime = formatRelativeTime(c.last_message_at);

                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => selectConversation(c)}
                                        className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 relative ${
                                            isActive
                                                ? 'bg-carbon-850 border-l-2 border-l-flame-500'
                                                : 'hover:bg-carbon-900/60'
                                        }`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                                isActive
                                                    ? 'bg-flame-500/20 text-flame-500 border border-flame-500/40'
                                                    : 'bg-carbon-850 text-neutral-300 border border-carbon-800'
                                            }`}
                                        >
                                            {initials}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-1.5">
                                                <span
                                                    className={`text-xs font-bold font-display truncate ${
                                                        isActive ? 'text-white' : 'text-neutral-200'
                                                    }`}
                                                >
                                                    {counterpartName}
                                                </span>
                                                {lastTime && (
                                                    <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                                                        {lastTime}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-[11px] font-mono text-neutral-400 truncate">
                                                {c.project?.title}
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs text-neutral-500 truncate line-clamp-1">
                                                    {c.last_message || (
                                                        <span className="italic text-neutral-600">
                                                            No messages yet
                                                        </span>
                                                    )}
                                                </p>
                                                {c.unread_count > 0 && (
                                                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-flame-500 text-white shrink-0 shadow-sm">
                                                        {c.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* RIGHT COLUMN: Chat Area & Chatbox */}
                <main
                    className={`flex-1 flex flex-col min-w-0 bg-carbon-900 ${
                        mobileView === 'list' ? 'hidden md:flex' : 'flex'
                    }`}
                >
                    {active ? (
                        <>
                            {/* Chat Header */}
                            <header className="h-16 px-4 sm:px-6 border-b border-carbon-800 flex items-center justify-between bg-carbon-900/90 backdrop-blur shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button
                                        type="button"
                                        onClick={() => setMobileView('list')}
                                        className="md:hidden p-1.5 -ml-1 text-neutral-400 hover:text-white"
                                        aria-label="Back to conversation list"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>

                                    <div className="w-9 h-9 rounded-xl bg-flame-500/10 text-flame-500 border border-flame-500/30 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                        {getInitials(active.counterpart?.name)}
                                    </div>

                                    <div className="min-w-0">
                                        <h1 className="text-sm sm:text-base font-bold font-display text-white truncate">
                                            {active.counterpart?.name}
                                        </h1>
                                        <p className="text-xs font-mono text-neutral-400 truncate">
                                            Project:{' '}
                                            <Link
                                                href={route('projects.show', active.project?.id)}
                                                className="text-flame-500 hover:underline font-semibold"
                                            >
                                                {active.project?.title}
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-carbon-850 text-neutral-300 border border-carbon-700">
                                        Status: {active.project?.status}
                                    </span>
                                </div>
                            </header>

                            {/* Polling Error Alert */}
                            {pollingError && (
                                <div className="p-3 bg-red-950/60 border-b border-red-800/80 text-red-300 font-mono text-xs flex items-center gap-2 shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                                    <span>{pollingError}</span>
                                </div>
                            )}

                            {/* Messages Scroll View */}
                            <div
                                ref={scrollContainerRef}
                                onScroll={handleScroll}
                                role="log"
                                aria-live="polite"
                                className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-2.5 overscroll-contain relative"
                            >
                                {hasEarlier && (
                                    <div className="flex justify-center py-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleLoadEarlier}
                                            loading={loadingEarlier}
                                            disabled={loadingEarlier}
                                            className="text-xs font-mono"
                                        >
                                            Load earlier messages
                                        </Button>
                                    </div>
                                )}

                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-neutral-400">
                                        <div className="w-12 h-12 rounded-2xl bg-flame-500/10 border border-flame-500/20 flex items-center justify-center text-flame-500">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="text-sm font-display font-semibold text-white">
                                            Start your conversation with {active.counterpart?.name}
                                        </div>
                                        <p className="text-xs font-mono text-neutral-500 max-w-sm">
                                            Use the chatbox below to introduce yourself, discuss
                                            project milestones, or coordinate meetings.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const prevMsg = messages[index - 1];
                                        const showDateSeparator =
                                            !prevMsg ||
                                            new Date(msg.created_at).toDateString() !==
                                                new Date(prevMsg.created_at).toDateString();

                                        const isLatestMine = msg.id === latestMyMessageId;
                                        const isRead =
                                            isLatestMine && readUpTo !== null && msg.id <= readUpTo;

                                        return (
                                            <div key={msg.id}>
                                                {showDateSeparator && (
                                                    <div className="flex items-center justify-center my-4">
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-mono text-neutral-500 bg-carbon-850 border border-carbon-800 uppercase tracking-wider">
                                                            {formatDateSeparator(msg.created_at)}
                                                        </span>
                                                    </div>
                                                )}

                                                <MessageBubble
                                                    message={msg}
                                                    counterpartName={
                                                        active.counterpart?.name || 'Partner'
                                                    }
                                                    isLatestMine={isLatestMine}
                                                    isRead={isRead}
                                                />
                                            </div>
                                        );
                                    })
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Floating Scroll Bottom Button */}
                            {showScrollBottomBtn && (
                                <button
                                    type="button"
                                    onClick={() => scrollToBottom(true)}
                                    className="absolute bottom-24 right-8 px-3 py-1.5 rounded-full bg-flame-500 text-white text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 hover:bg-flame-600 transition-colors z-10"
                                >
                                    <span>New messages</span>
                                    <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {/* CHATBOX / MESSAGE COMPOSER - ALWAYS ANCHORED AT BOTTOM */}
                            <div className="p-3 sm:p-4 bg-carbon-950 border-t border-carbon-800 shrink-0">
                                <MessageComposer
                                    canSend={canSend}
                                    onSend={handleSend}
                                    disabled={Boolean(pollingError)}
                                />
                            </div>
                        </>
                    ) : (
                        /* Empty State when 0 conversations exist */
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-carbon-850 border border-carbon-800 flex items-center justify-center text-neutral-500">
                                <MessageSquare className="w-8 h-8 text-neutral-600" />
                            </div>
                            <h2 className="text-lg font-bold font-display text-white">
                                Direct Project Messages
                            </h2>
                            <p className="text-xs font-mono text-neutral-400 max-w-md">
                                Private, accepted-members-only 1-on-1 chats are automatically
                                created when an application to an AAU project is accepted.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                <Button href={route('projects.index')} variant="primary" size="sm">
                                    Browse Open Projects
                                </Button>
                                <Button
                                    href={route('applications.index')}
                                    variant="secondary"
                                    size="sm"
                                >
                                    My Applications
                                </Button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
