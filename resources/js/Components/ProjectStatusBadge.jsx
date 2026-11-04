import Badge from '@/Components/ui/Badge';

export default function ProjectStatusBadge({ status, isRecruiting = true, isFull = false, deadlinePassed = false }) {
    if (status === 'completed') {
        return <Badge variant="mint">Completed</Badge>;
    }
    if (status === 'cancelled') {
        return <Badge variant="coral">Cancelled</Badge>;
    }
    if (isFull) {
        return <Badge variant="amber">Full</Badge>;
    }
    if (deadlinePassed) {
        return <Badge variant="neutral">Deadline Passed</Badge>;
    }
    if (isRecruiting || status === 'open') {
        return <Badge variant="mint">Recruiting</Badge>;
    }
    return <Badge variant="neutral">In Progress</Badge>;
}