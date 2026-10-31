import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ project, can }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project listing? This cannot be undone.')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('projects.index')}
                            className="text-sm font-medium text-gray-500 hover:text-gray-700"
                        >
                            ← Back to Projects
                        </Link>
                    </div>
                    {can.delete && (
                        <button
                            onClick={handleDelete}
                            className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                            Delete Project
                        </button>
                    )}
                </div>
            }
        >
            <Head title={project.title} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="p-8">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize">
                                        {project.category?.replace('_', ' ')}
                                    </span>
                                    <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 capitalize">
                                        Status: {project.status}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Posted by{' '}
                                    <Link
                                        href={route('students.show', project.owner?.id)}
                                        className="font-medium text-indigo-600 hover:underline"
                                    >
                                        {project.owner?.name}
                                    </Link>
                                </span>
                            </div>

                            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                {project.title}
                            </h1>

                            {/* Key Project Constraints */}
                            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-4 text-center">
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Openings</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{project.slots_total}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Weekly Commitment</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{project.hours_per_week} hrs/wk</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Est. Duration</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">{project.duration_weeks} wks</dd>
                                </div>
                                <div>
                                    <dt className="text-xs font-medium text-gray-500">Deadline</dt>
                                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                                        {project.application_deadline ? new Date(project.application_deadline).toLocaleDateString() : 'N/A'}
                                    </dd>
                                </div>
                            </div>

                            {/* Description (Preserves line breaks safely) */}
                            <div className="mt-8">
                                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                                    Description
                                </h2>
                                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
                                    {project.description}
                                </p>
                            </div>

                            {/* Required Skills */}
                            {project.skills && project.skills.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                                        Required Skills
                                    </h2>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {project.skills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Telegram Contact Box (Protected per FR-PROJ-05) */}
                            <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Direct Contact (Telegram)
                                </h2>
                                {can.viewContact && project.telegram_contact ? (
                                    <p className="mt-2 text-sm text-gray-800">
                                        Contact Handle:{' '}
                                        <a
                                            href={`https://t.me/${project.telegram_contact}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-indigo-600 hover:underline"
                                        >
                                            @{project.telegram_contact}
                                        </a>
                                    </p>
                                ) : (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Telegram contact information is private. It is only revealed to accepted collaborators or the project creator.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}