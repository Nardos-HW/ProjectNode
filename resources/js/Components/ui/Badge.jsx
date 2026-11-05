export default function Badge({
    variant = 'neutral',
    size = 'md',
    className = '',
    children,
    ...props
}) {
    const variants = {
        flame: 'bg-flame-500/10 text-flame-500 border-flame-500/30',
        violet: 'bg-flame-500/10 text-flame-500 border-flame-500/30',
        amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        mint: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        coral: 'bg-red-500/10 text-red-400 border-red-500/30',
        neutral: 'bg-carbon-800/80 text-neutral-300 border-carbon-700',
    };

    const sizes = {
        sm: 'text-[9px] px-2 py-0.5 tracking-wider',
        md: 'text-[10px] px-2.5 py-0.5 tracking-wider',
    };

    return (
        <span
            className={`inline-flex items-center font-mono uppercase rounded-full border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
