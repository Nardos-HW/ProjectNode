import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Requests({ project, requests }) {
    const [processingId, setProcessingId] = useState(null);

    const handleAccept = (requestId) => {
        router.patch(route('join-requests.accept', requestId), {}, {
            onStart: () => setProcessingId(requestId),
            onFinish: () => setProcessingId(null),
        });
    };

    const handleReject = (requestId) => {
        router.patch(route('join-requests.reject', requestId), {}, {
            onStart: () => setProcessingId(requestId),
            onFinish: () => setProcessingId(null),
        });
    };

    const isBusy = processingId !== null;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href={route('projects.show', project.id)}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700"
                        >
                            ← Back to Project
                        </Link>
                        <h2 className="mt-1 text-xl font-semibold leading-tight text-gray-800">
                            Applicant Inbox: {project.title}
                        </h2>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            Capacity: {project.accepted_count} / {project.slots_total} filled
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Applications - ${project.title}`} />

            <div className="py-8">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    {requests.length === 0 ? (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <h3 className="text-lg font-medium text-gray-900">No join requests yet</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                When students submit applications to collaborate, they will appear here for review[cite: 1, 3].
                            </p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div
                                key={req.id}
                                className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route('students.show', req.applicant.id)}
                                                className="text-lg font-bold text-gray-900 hover:text-indigo-600 hover:underline"
                                            >
                                                {req.applicant.name}
                                            </Link>
                                            <span className="text-xs text-gray-500">
                                                {req.applicant.department?.name || 'General Campus'} &bull; Year {req.applicant.year_of_study || 'N/A'}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-indigo-600">
                                            Telegram:{' '}
                                            <a
                                                href={`https://t.me/${req.applicant.telegram_handle}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold hover:underline"
                                            >
                                                @{req.applicant.telegram_handle}
                                            </a>
                                        </p>
                                    </div>

                                    <div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${req.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : req.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Application Note */}
                                <div className="mt-4 rounded-md bg-gray-50 p-4">
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Application Message
                                    </h4>
                                    <p className="mt-1 whitespace-pre-line text-sm text-gray-800">
                                        {req.message}
                                    </p>
                                </div>

                                {/* Applicant Skills & Bio */}
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500">Skills</h4>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {req.applicant.skills && req.applicant.skills.length > 0 ? (
                                                req.applicant.skills.map((skill) => (
                                                    <span
                                                        key={skill.id}
                                                        className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                                    >
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">No skills listed</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-500">Bio</h4>
                                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                                            {req.applicant.bio || 'No bio provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Decision Actions (Pending Requests Only) */}
                                {req.status === 'pending' && (
                                    <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => handleReject(req.id)}
                                            disabled={isBusy}
                                            className={`rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold shadow-sm ${
                                                isBusy
                                                    ? 'opacity-50 cursor-not-allowed text-gray-400'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {processingId === req.id ? 'Declining...' : 'Decline'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAccept(req.id)}
                                            disabled={isBusy || project.accepted_count >= project.slots_total}
                                            className={`rounded-md px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm ${
                                                isBusy || project.accepted_count >= project.slots_total
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-500'
                                            }`}
                                        >
                                            {processingId === req.id
                                                ? 'Accepting...'
                                                : project.accepted_count >= project.slots_total
                                                ? 'Project Full'
                                                : 'Accept Applicant'}
                                        </button>
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