export function ConstellationGraphic({ className = 'w-20 h-20 text-neutral-300' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

            <line x1="22" y1="36" x2="50" y2="22" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />
            <line x1="50" y1="22" x2="78" y2="36" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />
            <line x1="22" y1="36" x2="35" y2="68" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />
            <line x1="50" y1="22" x2="50" y2="50" stroke="#2563EB" strokeWidth="1.5" />
            <line x1="50" y1="50" x2="35" y2="68" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />
            <line x1="50" y1="50" x2="68" y2="72" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />
            <line x1="78" y1="36" x2="68" y2="72" stroke="#2563EB" strokeWidth="1.2" opacity="0.7" />

            <circle cx="50" cy="50" r="3.5" fill="#2563EB" />
            <circle cx="22" cy="36" r="2.5" fill="#2563EB" />
            <circle cx="50" cy="22" r="2.5" fill="#2563EB" />
            <circle cx="78" cy="36" r="2.5" fill="#2563EB" />
            <circle cx="35" cy="68" r="2.5" fill="#2563EB" />
            <circle cx="68" cy="72" r="2.5" fill="#2563EB" />
        </svg>
    );
}

export default function EmptyState({
    title,
    description,
    action,
    className = '',
}) {
    return (
        <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-neutral-200/80 bg-white shadow-xs ${className}`}>
            <ConstellationGraphic className="w-20 h-20 mb-4 text-neutral-300" />
            <h3 className="text-base font-bold text-neutral-900 font-display mb-1">{title}</h3>
            {description && <p className="text-sm text-neutral-500 max-w-sm mb-5 leading-relaxed">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}
