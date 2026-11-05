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
        'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-flame-500 focus:ring-offset-2 focus:ring-offset-carbon-950 disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-lg';

    const variants = {
        primary: 'bg-flame-500 hover:bg-flame-600 active:bg-flame-700 text-white border border-flame-500/60 shadow-sm shadow-flame-500/20',
        secondary: 'bg-carbon-850 hover:bg-carbon-800 active:bg-carbon-900 text-neutral-200 border border-carbon-700 hover:border-neutral-600',
        ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-carbon-850/60 border border-transparent',
        danger: 'bg-red-950/80 hover:bg-red-900 active:bg-red-950 text-red-300 border border-red-800/80 shadow-sm shadow-red-950/40',
    };

    const sizes = {
        sm: 'text-[11px] px-3 py-1.5 gap-1.5 tracking-wider',
        md: 'text-xs px-4 py-2 gap-2 tracking-wider',
        lg: 'text-sm px-5 py-2.5 gap-2.5 tracking-wider',
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
