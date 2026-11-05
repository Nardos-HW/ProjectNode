import { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import { Send } from 'lucide-react';

export default function MessageComposer({
    canSend = true,
    onSend,
    disabled = false,
}) {
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (canSend && !disabled && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [canSend, disabled]);

    if (!canSend) {
        return (
            <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-center font-mono text-xs text-neutral-500">
                This project was cancelled. Messaging is closed.
            </div>
        );
    }

    const trimmed = body.trim();
    const canSubmit = trimmed.length > 0 && trimmed.length <= 2000 && !sending && !disabled;

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!canSubmit) return;

        setSending(true);
        setError(null);

        try {
            await onSend(trimmed);
            setBody('');
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        } catch (err) {
            const serverMessage =
                err.response?.data?.errors?.body?.[0] ||
                err.response?.data?.message ||
                'Failed to deliver message. Please try again.';
            setError(serverMessage);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-1.5">
            <label htmlFor="message-body" className="sr-only">
                Type your message
            </label>

            <div className="rounded-xl border border-neutral-200 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all overflow-hidden shadow-xs">
                <textarea
                    ref={textareaRef}
                    id="message-body"
                    rows={2}
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value);
                        if (error) setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Press Enter to send, Shift+Enter for newline)"
                    maxLength={2000}
                    disabled={sending || disabled}
                    className="w-full bg-transparent border-0 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:ring-0 focus:outline-none resize-none disabled:opacity-50"
                />

                <div className="flex items-center justify-between gap-3 px-3.5 py-2 bg-neutral-50/80 border-t border-neutral-100">
                    <div className="flex-1 min-w-0">
                        {error && <InputError message={error} className="text-xs" />}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-[11px] text-neutral-400">
                            {body.length} / 2000
                        </span>

                        <PrimaryButton
                            type="submit"
                            disabled={!canSubmit}
                            className="gap-1.5 text-xs py-1.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>{sending ? 'Sending...' : 'Send'}</span>
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </form>
    );
}
