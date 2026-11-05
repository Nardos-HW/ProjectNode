export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-150 ease-in-out hover:bg-neutral-800 focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${className}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
