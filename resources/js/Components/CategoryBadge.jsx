import Badge from '@/Components/ui/Badge';

export default function CategoryBadge({ category }) {
    const formatted = typeof category === 'string' ? category.replace('_', ' ') : '';

    const variantMap = {
        personal: 'violet',
        hackathon: 'amber',
        academic: 'mint',
        student_initiative: 'coral',
    };

    return (
        <Badge variant={variantMap[category] || 'neutral'} className="capitalize">
            {formatted}
        </Badge>
    );
}