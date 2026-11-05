import Badge from '@/Components/ui/Badge';

export default function CategoryBadge({ category }) {
    const formatted = typeof category === 'string' ? category.replace('_', ' ') : '';

    const variantMap = {
        personal: 'terracotta',
        hackathon: 'amber',
        academic: 'brand',
        student_initiative: 'mint',
    };

    return (
        <Badge variant={variantMap[category] || 'neutral'} className="capitalize font-medium">
            {formatted}
        </Badge>
    );
}
