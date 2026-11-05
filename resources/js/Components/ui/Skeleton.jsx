export default function Skeleton({ className = '' }) {
    return (
        <div
            className={`animate-pulse bg-carbon-800/80 rounded-lg ${className}`}
            aria-hidden="true"
        />
    );
}
