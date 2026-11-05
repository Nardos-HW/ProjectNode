import { usePage } from '@inertiajs/react';

export default function MessageBubble({
    message,
    counterpartName = 'Partner',
    isLatestMine = false,
    isRead = false,
}) {
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    // Bulletproof ownership check: compare sender_id with logged in user's id
    const isMine = currentUserId != null
        ? Number(message.sender_id) === Number(currentUserId)
        : Boolean(message.is_mine);

    const formattedTime = message.created_at
        ? new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

    return (
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} my-2.5`}>
            {/* Sender Label & Time */}
            <div
                className={`flex items-center gap-1.5 mb-1 text-[11px] font-mono px-1 ${
                    isMine ? 'flex-row-reverse text-blue-600' : 'text-neutral-500'
                }`}
            >
                <span className={isMine ? 'font-semibold text-blue-600' : 'font-semibold text-neutral-800'}>
                    {isMine ? 'You' : counterpartName}
                </span>
                <span>&bull;</span>
                <time dateTime={message.created_at} className="text-neutral-400">
                    {formattedTime}
                </time>
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words shadow-sm transition-all ${
                    isMine
                        ? 'bg-neutral-900 text-white border border-neutral-800 rounded-tr-xs'
                        : 'bg-white text-neutral-900 border border-neutral-200/80 shadow-xs rounded-tl-xs'
                }`}
            >
                {message.body}
            </div>

            {/* Read Receipt */}
            {isMine && isLatestMine && isRead && (
                <div className="mt-1 text-[10px] font-mono text-neutral-400 px-1">
                    Seen
                </div>
            )}
        </div>
    );
}
