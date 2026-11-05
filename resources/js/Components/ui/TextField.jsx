import { useId } from 'react';

export default function TextField({
    label,
    error,
    hint,
    id,
    maxLength,
    value = '',
    type = 'text',
    className = '',
    onChange,
    required = false,
    ...props
}) {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const length = typeof value === 'string' ? value.length : 0;
    const ratio = maxLength ? length / maxLength : 0;

    let counterColor = 'text-neutral-400 font-mono';
    if (ratio >= 1) counterColor = 'text-rose-500 font-mono font-medium';
    else if (ratio >= 0.9) counterColor = 'text-amber-600 font-mono font-medium';

    return (
        <div className={`space-y-1.5 ${className}`}>
            <div className="flex justify-between items-center text-xs">
                {label && (
                    <label htmlFor={inputId} className="font-semibold text-neutral-800 text-xs sm:text-sm">
                        {label} {required && <span className="text-rose-500">*</span>}
                    </label>
                )}
                {maxLength !== undefined && (
                    <span
                        className={`text-xs ${counterColor}`}
                        aria-live="polite"
                    >
                        {length} / {maxLength}
                    </span>
                )}
            </div>

            <input
                id={inputId}
                type={type}
                value={value}
                maxLength={maxLength}
                required={required}
                onChange={onChange}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error ? errorId : hint ? hintId : undefined
                }
                className={`w-full rounded-xl bg-white border px-3.5 py-2.5 text-neutral-900 placeholder-neutral-400 text-sm shadow-xs focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors ${
                    error ? 'border-rose-400 focus:ring-rose-500' : 'border-neutral-200'
                }`}
                {...props}
            />

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
