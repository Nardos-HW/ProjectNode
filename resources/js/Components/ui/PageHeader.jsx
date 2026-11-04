export default function PageHeader({
    title,
    subtitle,
    actions,
    className = '',
}) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-surface-2 ${className}`}>
            <div>
                <h1 className="text-2xl font-bold font-display text-text tracking-tight">
                    {title}
                </h1>
                {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    );
}