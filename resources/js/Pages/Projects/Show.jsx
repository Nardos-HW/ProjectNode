import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ project, existingRequest, can }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project listing? This cannot be undone.')) {
            router.delete(route('projects.destroy', project.id));
        }
    };

    const handleApply = (e) => {
        e.preventDefault();
        post(route('projects.join', project.id), {
            onSuccess: () => reset(),
        });
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
                    <div className="flex items-center gap-3">
                        {can.manageRequests && (
                            <Link
                                href={route('projects.requests', project.id)}
                                className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Review Applications ({project.accepted_count} / {project.slots_total} filled)
                            </Link>
                        )}
                        {can.delete && (
                            <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                            >
                                Delete Project
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={project.title} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    {/* Project Overview Card */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize">
                                    {project.category?.replace('_', ' ')}
                                </span>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${project.is_recruiting
                                        ? 'bg-green-50 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {project.is_recruiting ? 'Recruiting' : 'Applications Closed'}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                Posted by{' '}
                                <Link
                                    href={route('students.show', project.owner.id)}
                                    className="font-medium text-indigo-600 hover:underline"
                                >
                                    {project.owner.name}
                                </Link>
                            </span>
                        </div>

                        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            {project.title}
                        </h1>

                        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-center sm:grid-cols-4">
                            <div>
                                <dt className="text-xs font-medium text-gray-500">Capacity</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {project.accepted_count} / {project.slots_total} filled
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-500">Commitment</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{project.hours_per_week} hrs/wk</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-500">Duration</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">{project.duration_weeks} wks</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-500">Deadline</dt>
                                <dd className="mt-1 text-lg font-semibold text-gray-900">
                                    {project.application_deadline ? new Date(project.application_deadline).toLocaleDateString() : 'Open'}
                                </dd>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                                Description
                            </h2>
                            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
                                {project.description}
                            </p>
                        </div>

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

                        {/* Telegram Contact Box */}
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
                                    Telegram contact information is revealed only to accepted collaborators and the project creator.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Join Request Interaction Section */}
                    {existingRequest && (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-blue-900">
                                    Your Application Status
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800 capitalize">
                                    {existingRequest.status_label}
                                </span>
                            </div>
                            <p className="mt-3 text-sm text-blue-800 italic">
                                &ldquo;{existingRequest.message}&rdquo;
                            </p>
                            {existingRequest.status === 'accepted' && (
                                <p className="mt-3 text-xs font-medium text-green-700">
                                    You have been accepted into this project! Check the direct Telegram contact above to coordinate with your team[cite: 1, 3].
                                </p>
                            )}
                        </div>
                    )}

                    {can.apply && (
                        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Request to Join this Project
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Introduce yourself to {project.owner.name}. Explain what relevant skills and time you can commit (10 to 500 characters)[cite: 1, 2].
                            </p>
                            <form onSubmit={handleApply} className="mt-4 space-y-4">
                                <div>
                                    <textarea
                                        rows={4}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Hi! I am a 3rd year student experienced with React and Tailwind, and I have 10 hours a week to contribute..."
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        required
                                    />
                                    <div className="mt-1 flex justify-between text-xs text-gray-500">
                                        <span>Min 10, Max 500 characters[cite: 1, 2]</span>
                                        <span>{data.message.length} / 500</span>
                                    </div>
                                    <InputError message={errors.message} className="mt-2" />
                                </div>
                                <div className="flex justify-end">
                                    <PrimaryButton disabled={processing || data.message.length < 10}>
                                        {processing ? 'Submitting...' : 'Submit Join Request'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}