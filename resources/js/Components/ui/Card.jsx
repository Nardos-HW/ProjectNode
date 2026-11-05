export default function Card({
    as = 'div',
    hover = false,
    className = '',
    children,
    ...props
}) {
    const Component = as;
    const hoverClasses = hover
        ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-float hover:border-neutral-300'
        : 'transition-shadow duration-200';

    return (
        <Component
            className={`bg-white border border-neutral-200/80 rounded-2xl p-6 text-neutral-900 shadow-card ${hoverClasses} ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
