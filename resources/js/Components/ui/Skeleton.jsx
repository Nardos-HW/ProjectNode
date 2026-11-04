export default function Skeleton({ className = '' }) {
    return (
        <div
            className={`animate-pulse bg-surface-2/70 rounded-xl ${className}`}
            aria-hidden="true"
        />
    );
}