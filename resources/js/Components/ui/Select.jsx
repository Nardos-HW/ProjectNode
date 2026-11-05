import { useId } from 'react';

export default function Select({
    label,
    error,
    hint,
    id,
    options = [],
    className = '',
    required = false,
    ...props
}) {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-xs sm:text-sm font-semibold text-neutral-800">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}

            <select
                id={selectId}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-neutral-900 text-sm shadow-xs focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors ${
                    error ? 'border-rose-400 focus:ring-rose-500' : 'border-neutral-200'
                }`}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white text-neutral-900">
                        {opt.label}
                    </option>
                ))}
            </select>

            {hint && !error && (
                <p id={hintId} className="text-xs text-neutral-500">
                    {hint}
                </p>
            )}

            {error && (
                <p id={errorId} className="text-xs text-rose-600 font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}
