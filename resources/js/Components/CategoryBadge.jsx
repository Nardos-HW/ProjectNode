import Badge from '@/Components/ui/Badge';

export default function CategoryBadge({ category }) {
    const formatted = typeof category === 'string' ? category.replace('_', ' ') : '';

    const variantMap = {
        personal: 'flame',
        hackathon: 'amber',
        academic: 'neutral',
        student_initiative: 'flame',
    };

    return (
        <Badge variant={variantMap[category] || 'neutral'} className="capitalize">
            {formatted}
        </Badge>
    );
}
