import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ applications }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Collaboration Applications
                </h2>
            }
        >
            <Head title="My Applications" />

            <div className="py-8">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {applications.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">No applications sent yet</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Browse active projects and request to collaborate with other university students[cite: 1, 3].
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('projects.index')}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Browse Projects
                                </Link>
                            </div>
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div
                                key={app.id}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            <Link
                                                href={route('projects.show', app.project.id)}
                                                className="hover:text-indigo-600 hover:underline"
                                            >
                                                {app.project.title}
                                            </Link>
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Led by {app.project.owner_name} &bull; Applied on {app.created_at}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${app.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : app.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status_label}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-xs font-medium text-gray-500">Your Message:</h4>
                                    <p className="mt-1 text-sm text-gray-700 italic">
                                        &ldquo;{app.message}&rdquo;
                                    </p>
                                </div>

                                {app.status === 'accepted' && app.project.telegram_contact && (
                                    <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-green-800">
                                            Accepted Collaborator Access
                                        </h4>
                                        <p className="mt-1 text-sm text-green-900">
                                            Connect directly with the project owner on Telegram:{' '}
                                            <a
                                                href={`https://t.me/${app.project.telegram_contact}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold underline hover:text-green-700"
                                            >
                                                @{app.project.telegram_contact}
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}