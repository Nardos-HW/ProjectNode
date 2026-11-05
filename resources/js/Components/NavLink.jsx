import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-full transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 font-medium') +
                ' ' + className
            }
        >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />}
            {children}
        </Link>
    );
}
