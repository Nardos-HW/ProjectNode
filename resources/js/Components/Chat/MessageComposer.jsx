import { useState } from 'react';
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

    if (!canSend) {
        return (
            <div className="p-4 rounded-xl bg-carbon-900 border border-carbon-800 text-center font-mono text-xs text-neutral-400">
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
        <form onSubmit={handleSubmit} className="space-y-2">
            <label htmlFor="message-body" className="sr-only">
                Type your message
            </label>

            <div className="relative">
                <textarea
                    id="message-body"
                    rows={2}
                    value={body}
                    onChange={(e) => {
                        setBody(e.target.value);
                        if (error) setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message... (Press Enter to send, Shift+Enter for newline)"
                    maxLength={2000}
                    disabled={sending || disabled}
                    className="w-full rounded-xl bg-carbon-950 border border-carbon-800 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-flame-500 focus:ring-1 focus:ring-flame-500 focus:outline-none transition-colors resize-none disabled:opacity-50"
                />
            </div>

            <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                    {error && <InputError message={error} className="text-xs" />}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[11px] text-neutral-500">
                        {body.length} / 2000
                    </span>

                    <PrimaryButton
                        type="submit"
                        disabled={!canSubmit}
                        className="gap-1.5 text-xs py-1.5 px-3"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
}

