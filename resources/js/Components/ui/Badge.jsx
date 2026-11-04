export default function Badge({
    variant = 'neutral',
    size = 'md',
    className = '',
    children,
    ...props
}) {
    const variants = {
        violet: 'bg-violet/15 text-violet border-violet/30',
        amber: 'bg-amber/15 text-amber border-amber/30',
        mint: 'bg-mint/15 text-mint border-mint/30',
        coral: 'bg-coral/15 text-coral border-coral/30',
        neutral: 'bg-surface-2 text-muted border-surface-2/80',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs font-medium px-2.5 py-1',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}