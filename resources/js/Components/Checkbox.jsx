export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-neutral-300 bg-white text-blue-600 shadow-xs focus:ring-blue-500 ' +
                className
            }
        />
    );
}
