export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-neutral-800 shadow-xs transition-all duration-150 ease-in-out hover:bg-neutral-50 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
