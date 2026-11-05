export default function FormSection({
    title,
    description,
    children,
    className = '',
}) {
    return (
        <fieldset className={`space-y-4 ${className}`}>
            {title && (
                <legend className="block w-full pb-2 mb-2 border-b border-neutral-200/80">
                    <span className="text-base font-bold font-display text-neutral-950">
                        {title}
                    </span>
                    {description && (
                        <p className="text-xs text-neutral-500 mt-0.5">
                            {description}
                        </p>
                    )}
                </legend>
            )}
            <div className="space-y-4">{children}</div>
        </fieldset>
    );
}
