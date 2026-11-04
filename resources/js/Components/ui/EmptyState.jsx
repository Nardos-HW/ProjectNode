export function ConstellationGraphic({ className = 'w-24 h-24 text-violet/40' }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="20" cy="30" r="3" className="fill-violet" />
            <circle cx="50" cy="20" r="4" className="fill-mint" />
            <circle cx="80" cy="35" r="3" className="fill-amber" />
            <circle cx="35" cy="70" r="3.5" className="fill-violet" />
            <circle cx="70" cy="75" r="3" className="fill-coral" />

            <line x1="20" y1="30" x2="50" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="20" x2="80" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="20" y1="30" x2="35" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="20" x2="35" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="50" y1="20" x2="70" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="80" y1="35" x2="70" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="35" y1="70" x2="70" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
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
        <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-surface-2/60 bg-surface/40 ${className}`}>
            <ConstellationGraphic className="w-20 h-20 mb-4 text-violet/30" />
            <h3 className="text-base font-semibold text-text font-display mb-1">{title}</h3>
            {description && <p className="text-sm text-muted max-w-sm mb-5">{description}</p>}
            {action && <div>{action}</div>}
        </div>
    );
}