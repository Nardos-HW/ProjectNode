import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import CategoryBadge from '@/Components/CategoryBadge';
import ProjectStatusBadge from '@/Components/ProjectStatusBadge';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

export default function Index({ projects, filters = {} }) {
    const handleToggleClosed = (e) => {
        router.get(
            route('projects.index'),
            e.target.checked ? { include_closed: 1 } : {},
            { preserveState: true, replace: true }
        );
    };

    const isDeadlinePassed = (deadline) => {
        if (!deadline) return false;
        const target = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return target < today;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Discover Projects" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="Discover Projects"
                    subtitle="Find collaboration opportunities across Addis Ababa University."
                    actions={
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-xs font-medium text-muted cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-surface-2 text-violet focus:ring-violet bg-ink"
                                    checked={!!filters.include_closed}
                                    onChange={handleToggleClosed}
                                />
                                <span>Include closed</span>
                            </label>

                            <Button href={route('projects.create')} variant="primary" size="sm">
                                <PlusCircle className="w-4 h-4 mr-1.5" /> Post Project
                            </Button>
                        </div>
                    }
                />

                {projects.data.length === 0 ? (
                    <EmptyState
                        title="No projects found"
                        description={
                            filters.include_closed
                                ? 'No projects exist on campus yet.'
                                : 'No projects are currently accepting applications. Toggle "Include closed" to see completed teams.'
                        }
                        action={
                            <Button href={route('projects.create')} variant="primary">
                                Post the First Project
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.data.map((project) => {
                            const isFull = (project.accepted_count ?? 0) >= project.slots_total;
                            const deadlinePassed = isDeadlinePassed(project.application_deadline);

                            return (
                                <Card key={project.id} hover className="flex flex-col justify-between p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <CategoryBadge category={project.category} />
                                            <ProjectStatusBadge
                                                status={project.status}
                                                isRecruiting={project.is_recruiting}
                                                isFull={isFull}
                                                deadlinePassed={deadlinePassed}
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold font-display text-text line-clamp-1">
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="hover:text-violet transition-colors"
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>
                                            <p className="mt-2 text-xs text-muted line-clamp-3 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        {project.skills && project.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.skills.slice(0, 4).map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="px-2 py-0.5 rounded-lg bg-surface-2 text-text text-[11px] font-medium"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))}
                                                {project.skills.length > 4 && (
                                                    <span className="text-[11px] text-muted self-center">
                                                        +{project.skills.length - 4} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-surface-2 flex items-center justify-between text-xs text-muted">
                                        <SlotDots filled={project.accepted_count ?? 0} total={project.slots_total} />
                                        <DeadlineRing deadline={project.application_deadline} />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}

                <Pagination links={projects.links} />
            </div>
        </AuthenticatedLayout>
    );
}