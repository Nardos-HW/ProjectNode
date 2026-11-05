export default function Badge({
    variant = 'neutral',
    size = 'md',
    className = '',
    children,
    ...props
}) {
    const variants = {
        flame: 'bg-blue-50 text-blue-700 border-blue-200/80',
        brand: 'bg-blue-50 text-blue-700 border-blue-200/80',
        amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
        mint: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        coral: 'bg-rose-50 text-rose-700 border-rose-200/80',
        forest: 'bg-emerald-900 text-emerald-100 border-emerald-900',
        terracotta: 'bg-orange-50 text-orange-800 border-orange-200/80',
        neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200/70',
    };

    const sizes = {
        sm: 'text-[10px] px-2.5 py-0.5 font-medium',
        md: 'text-xs px-3 py-1 font-medium',
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
