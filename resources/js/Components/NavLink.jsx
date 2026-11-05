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
                'inline-flex items-center gap-1.5 border-b-2 px-1 pt-1 text-xs font-semibold uppercase tracking-wider transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-flame-500 text-white'
                    : 'border-transparent text-neutral-400 hover:border-neutral-700 hover:text-white') +
                ' ' + className
            }
        >
            {active && <span className="w-1.5 h-1.5 rounded-full bg-flame-500 inline-block shadow-sm shadow-flame-500/50" />}
            {children}
        </Link>
    );
}

