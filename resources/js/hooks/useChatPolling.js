import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';

export function useChatPolling({
    conversationId,
    initialLastMessageId = 0,
    onNewMessages,
    onReadUpToChange,
    onCanSendChange,
}) {
    const [pollingError, setPollingError] = useState(null);
    const lastIdRef = useRef(initialLastMessageId);
    const inFlightRef = useRef(false);
    const timeoutRef = useRef(null);
    const backoffRef = useRef(3000);
    const isStoppedRef = useRef(false);

    useEffect(() => {
        if (initialLastMessageId > lastIdRef.current) {
            lastIdRef.current = initialLastMessageId;
        }
    }, [initialLastMessageId]);

    const poll = useCallback(async () => {
        if (isStoppedRef.current || inFlightRef.current) return;
        if (document.visibilityState !== 'visible') return;

        inFlightRef.current = true;

        try {
            const response = await axios.get(
                route('messages.poll', {
                    conversation: conversationId,
                    after: lastIdRef.current,
                })
            );

            backoffRef.current = 3000;
            setPollingError(null);

            const { messages, can_send, read_up_to } = response.data;

            if (Array.isArray(messages) && messages.length > 0) {
                const maxId = Math.max(...messages.map((m) => m.id));
                if (maxId > lastIdRef.current) {
                    lastIdRef.current = maxId;
                }
                if (onNewMessages) {
                    onNewMessages(messages);
                }
            }

            if (onReadUpToChange && typeof read_up_to !== 'undefined') {
                onReadUpToChange(read_up_to);
            }

            if (onCanSendChange && typeof can_send !== 'undefined') {
                onCanSendChange(can_send);
            }
        } catch (error) {
            const status = error.response?.status;
            if (status === 403 || status === 404) {
                isStoppedRef.current = true;
                setPollingError(
                    status === 404
                        ? 'This conversation or project is no longer available.'
                        : 'You no longer have permission to view this conversation.'
                );
                return;
            }

            backoffRef.current = Math.min(backoffRef.current * 2, 30000);
        } finally {
            inFlightRef.current = false;
            if (!isStoppedRef.current) {
                timeoutRef.current = setTimeout(poll, backoffRef.current);
            }
        }
    }, [conversationId, onNewMessages, onReadUpToChange, onCanSendChange]);

    useEffect(() => {
        isStoppedRef.current = false;
        backoffRef.current = 3000;

        timeoutRef.current = setTimeout(poll, 3000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isStoppedRef.current) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                poll();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isStoppedRef.current = true;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [poll]);

    const updateLastId = (id) => {
        if (id > lastIdRef.current) {
            lastIdRef.current = id;
        }
    };

    return { pollingError, updateLastId };
}
