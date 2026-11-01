import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

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
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Browse Projects
                    </h2>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={!!filters.include_closed}
                                onChange={handleToggleClosed}
                            />
                            <span>Show full & closed projects</span>
                        </label>

                        <Link
                            href={route('projects.create')}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            Post a Project
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Browse Projects" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {projects.data.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {filters.include_closed
                                    ? 'No projects exist on campus yet.'
                                    : 'No projects are currently accepting applications. Toggle "Show full & closed projects" above to view active teams.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.data.map((project) => {
                                const isFull = (project.accepted_count ?? 0) >= project.slots_total;
                                const deadlinePassed = isDeadlinePassed(project.application_deadline);

                                return (
                                    <div
                                        key={project.id}
                                        className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                                                    {project.category.replace('_', ' ')}
                                                </span>

                                                {/* True status badge */}
                                                {isFull ? (
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                                                        Full ({project.accepted_count} / {project.slots_total})
                                                    </span>
                                                ) : deadlinePassed ? (
                                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                        Deadline Passed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                        {project.slots_total - (project.accepted_count ?? 0)} opening{project.slots_total === 1 ? '' : 's'} left
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-3 text-lg font-semibold text-gray-900 line-clamp-1">
                                                <Link
                                                    href={route('projects.show', project.id)}
                                                    className="hover:text-indigo-600"
                                                >
                                                    {project.title}
                                                </Link>
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                                {project.description}
                                            </p>

                                            {project.skills && project.skills.length > 0 && (
                                                <div className="mt-4 flex flex-wrap gap-1.5">
                                                    {project.skills.slice(0, 4).map((skill) => (
                                                        <span
                                                            key={skill.id}
                                                            className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                                        >
                                                            {skill.name}
                                                        </span>
                                                    ))}
                                                    {project.skills.length > 4 && (
                                                        <span className="text-xs text-gray-400 self-center">
                                                            +{project.skills.length - 4} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
                                            <span>By {project.owner?.name ?? 'Student'}</span>
                                            <span>
                                                {deadlinePassed
                                                    ? 'Closed'
                                                    : `Deadline: ${project.application_deadline ? new Date(project.application_deadline).toLocaleDateString() : 'Open'}`}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {projects.links && projects.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-1">
                                {projects.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400 cursor-not-allowed select-none"
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`rounded px-3 py-1.5 text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white font-semibold'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}