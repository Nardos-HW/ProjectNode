import { useState, useRef, useEffect, useCallback } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import MessageBubble from '@/Components/Chat/MessageBubble';
import MessageComposer from '@/Components/Chat/MessageComposer';
import { useChatPolling } from '@/hooks/useChatPolling';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowDown, AlertTriangle } from 'lucide-react';
import axios from 'axios';

export default function Show({
    conversation,
    messages: initialMessages,
    has_earlier_messages: initialHasEarlier = false,
    read_up_to: initialReadUpTo = null,
}) {
    const conv = conversation?.data || conversation;
    const initialList = initialMessages?.data || initialMessages || [];

    const [messages, setMessages] = useState(initialList);
    const [hasEarlier, setHasEarlier] = useState(initialHasEarlier);
    const [loadingEarlier, setLoadingEarlier] = useState(false);
    const [readUpTo, setReadUpTo] = useState(initialReadUpTo);
    const [canSend, setCanSend] = useState(conv.can_send);
    const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);

    const scrollContainerRef = useRef(null);
    const messagesEndRef = useRef(null);
    const isNearBottomRef = useRef(true);

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
        scrollToBottom(false);
    }, []);

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
        conversationId: conv.id,
        initialLastMessageId: latestMessageId,
        onNewMessages: handleNewMessages,
        onReadUpToChange: setReadUpTo,
        onCanSendChange: setCanSend,
    });

    const handleSend = async (bodyText) => {
        const response = await axios.post(route('messages.store', conv.id), {
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
        if (loadingEarlier || messages.length === 0) return;

        const oldestId = messages[0].id;
        setLoadingEarlier(true);

        try {
            const response = await axios.get(
                route('messages.history', {
                    conversation: conv.id,
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
            // error handled
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

    return (
        <AuthenticatedLayout>
            <Head title={`Chat with ${conv.counterpart?.name} - ProjectNode`} />

            <div className="py-6 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
                <Card className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cad-crosshairs">
                    <div className="flex items-center gap-3">
                        <Button href={route('messages.index')} variant="ghost" size="sm" className="px-2">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Inbox</span>
                        </Button>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold font-display text-white">
                                {conv.counterpart?.name}
                            </h1>
                            <p className="text-xs font-mono text-neutral-400">
                                Project:{' '}
                                <Link
                                    href={route('projects.show', conv.project?.id)}
                                    className="text-flame-500 hover:underline font-semibold"
                                >
                                    {conv.project?.title}
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-carbon-850 text-neutral-300 border border-carbon-700">
                            Status: {conv.project?.status}
                        </span>
                    </div>
                </Card>

                {pollingError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 font-mono text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{pollingError}</span>
                    </div>
                )}

                <Card className="p-4 sm:p-6 flex flex-col h-[520px] sm:h-[580px] relative">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        role="log"
                        aria-live="polite"
                        className="flex-1 overflow-y-auto pr-1 space-y-2 overscroll-contain"
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
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 text-neutral-400">
                                <div className="text-sm font-display text-white">
                                    Say hello to {conv.counterpart?.name}.
                                </div>
                                <p className="text-xs font-mono text-neutral-500 max-w-sm">
                                    This is the start of your conversation about {conv.project?.title}.
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
                                            counterpartName={conv.counterpart?.name || 'Partner'}
                                            isLatestMine={isLatestMine}
                                            isRead={isRead}
                                        />
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {showScrollBottomBtn && (
                        <button
                            type="button"
                            onClick={() => scrollToBottom(true)}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-flame-500 text-white text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 hover:bg-flame-600 transition-colors"
                        >
                            <span>New messages</span>
                            <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <div className="pt-3 border-t border-carbon-800 mt-2">
                        <MessageComposer
                            canSend={canSend}
                            onSend={handleSend}
                            disabled={Boolean(pollingError)}
                        />
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

