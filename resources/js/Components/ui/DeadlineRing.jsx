export default function DeadlineRing({ deadline, className = '' }) {
    if (!deadline) return null;

    // Compare date parts in Africa/Addis_Ababa context
    const deadlineDate = new Date(deadline);
    const now = new Date();

    // Normalize to midnight UTC for date-only comparison
    const target = new Date(Date.UTC(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate()));
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

    let label = '';
    let isUrgent = false;
    let isPassed = false;

    if (diffDays < 0) {
        label = 'Deadline passed';
        isPassed = true;
    } else if (diffDays === 0) {
        label = 'Deadline today';
        isUrgent = true;
    } else if (diffDays === 1) {
        label = '1 day left';
        isUrgent = true;
    } else {
        label = `${diffDays} days left`;
        if (diffDays <= 3) isUrgent = true;
    }

    const strokeColor = isPassed
        ? 'stroke-neutral-600'
        : isUrgent
            ? 'stroke-flame-500'
            : 'stroke-amber-400';

    const textColor = isPassed
        ? 'text-neutral-500 font-mono'
        : isUrgent
            ? 'text-flame-500 font-mono font-medium'
            : 'text-amber-400 font-mono';

    return (
        <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 24 24">
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-carbon-800"
                    strokeWidth="2.5"
                    fill="none"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className={`${strokeColor} transition-all duration-300`}
                    strokeWidth="2.5"
                    strokeDasharray={56.5}
                    strokeDashoffset={isPassed ? 56.5 : isUrgent ? 14 : 28}
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
            <span className={textColor}>{label}</span>
        </div>
    );
}