export default function MessageBubble({
    message,
    counterpartName,
    isLatestMine = false,
    isRead = false,
}) {
    const isMine = message.is_mine;
    const formattedTime = message.created_at
        ? new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
          })
        : '';

    return (
        <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} my-2`}>
            <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-neutral-500 px-1">
                <span className={isMine ? 'text-flame-500 font-semibold' : 'text-neutral-300 font-medium'}>
                    {isMine ? 'You' : counterpartName}
                </span>
                <span>&bull;</span>
                <time dateTime={message.created_at}>{formattedTime}</time>
            </div>

            <div
                className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words shadow-sm ${
                    isMine
                        ? 'bg-carbon-850 border border-flame-500/40 text-white rounded-tr-xs'
                        : 'bg-carbon-900 border border-carbon-800 text-neutral-200 rounded-tl-xs'
                }`}
            >
                {message.body}
            </div>

            {isMine && isLatestMine && isRead && (
                <div className="mt-1 text-[10px] font-mono text-neutral-500 px-1">
                    Seen
                </div>
            )}
        </div>
    );
}
