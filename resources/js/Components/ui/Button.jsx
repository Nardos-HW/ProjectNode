import { Link } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    href,
    className = '',
    children,
    ...props
}) {
    const baseClasses =
        'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-full';

    const variants = {
        primary: 'bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white shadow-sm',
        secondary: 'bg-white hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 border border-neutral-200 shadow-xs',
        brand: 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm',
        ghost: 'bg-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
        danger: 'bg-rose-50 hover:bg-rose-100 active:scale-[0.98] text-rose-700 border border-rose-200',
    };

    const sizes = {
        sm: 'text-xs px-3.5 py-1.5 gap-1.5',
        md: 'text-xs sm:text-sm px-4.5 py-2 gap-2',
        lg: 'text-sm sm:text-base px-6 py-2.5 gap-2.5',
    };

    const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

    if (href && !disabled && !loading) {
        return (
            <Link href={href} className={combinedClasses} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={combinedClasses}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
            {children}
        </button>
    );
}
