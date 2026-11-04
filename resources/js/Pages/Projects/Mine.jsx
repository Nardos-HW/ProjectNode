import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import ProjectStatusBadge from '@/Components/ProjectStatusBadge';
import CategoryBadge from '@/Components/CategoryBadge';
import { Head, Link, router } from '@inertiajs/react';
import { PlusCircle, Inbox, Eye, Edit3 } from 'lucide-react';

export default function Mine({ projects, currentStatus = 'all' }) {
    const statuses = [
        { label: 'All', value: 'all' },
        { label: 'Open', value: 'open' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const handleFilterStatus = (status) => {
        router.get(
            route('projects.mine'),
            status === 'all' ? {} : { status },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Projects" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <PageHeader
                    title="My Projects"
                    subtitle="Manage your posted projects, review team applications, and track progress."
                    actions={
                        <Button href={route('projects.create')} variant="primary" size="sm">
                            <PlusCircle className="w-4 h-4 mr-1.5" /> Post a Project
                        </Button>
                    }
                />

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-surface-2 pb-4">
                    {statuses.map((tab) => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => handleFilterStatus(tab.value)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${currentStatus === tab.value
                                ? 'bg-violet text-text shadow-sm shadow-violet/30'
                                : 'bg-surface text-muted hover:text-text hover:bg-surface-2 border border-surface-2'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {projects.data.length === 0 ? (
                    <EmptyState
                        title="No projects found"
                        description={
                            currentStatus === 'all'
                                ? "You haven't posted any projects yet. Start one to recruit collaborators."
                                : `You don't have any projects with status "${currentStatus}".`
                        }
                        action={
                            <Button href={route('projects.create')} variant="primary">
                                Post Your First Project
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.data.map((project) => (
                            <Card key={project.id} hover className="flex flex-col justify-between p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <CategoryBadge category={project.category} />
                                        <div className="flex items-center gap-2">
                                            {project.pending_requests_count > 0 && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber/20 text-amber border border-amber/30">
                                                    {project.pending_requests_count} new
                                                </span>
                                            )}
                                            <ProjectStatusBadge
                                                status={project.status}
                                                isRecruiting={project.status === 'open'}
                                            />
                                        </div>
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

                                <div className="mt-6 pt-4 border-t border-surface-2 space-y-4">
                                    <div className="flex items-center justify-between text-xs text-muted">
                                        <SlotDots filled={project.accepted_count ?? 0} total={project.slots_total} />
                                        <DeadlineRing deadline={project.application_deadline} />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        {project.status !== 'completed' && project.status !== 'cancelled' && (
                                            <Button
                                                href={route('projects.edit', project.id)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                                            </Button>
                                        )}

                                        <Button
                                            href={route('projects.show', project.id)}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                                        </Button>

                                        <Button
                                            href={route('projects.requests', project.id)}
                                            variant="secondary"
                                            size="sm"
                                        >
                                            <Inbox className="w-3.5 h-3.5 mr-1" /> Requests ({project.accepted_count}/{project.slots_total})
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                <Pagination links={projects.links} />
            </div>
        </AuthenticatedLayout>
    );
}