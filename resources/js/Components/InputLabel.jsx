export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-xs sm:text-sm font-semibold text-neutral-800 mb-1.5 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
