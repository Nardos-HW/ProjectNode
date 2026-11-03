export default function FormSection({
    title,
    description,
    children,
    className = '',
}) {
    return (
        <fieldset className={`space-y-4 ${className}`}>
            {(title || description) && (
                <legend className="block w-full pb-2 mb-2 border-b border-surface-2">
                    {title && <span className="block text-base font-semibold font-display text-text">{title}</span>}
                    {description && <span className="block text-xs text-muted mt-0.5">{description}</span>}
                </legend>
            )}
            <div className="space-y-4">
                {children}
            </div>
        </fieldset>
    );
}