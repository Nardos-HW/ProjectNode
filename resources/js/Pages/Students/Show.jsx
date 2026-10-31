import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ student }) {
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
                </div>
            }
        >
            <Head title={`${student.name}'s Profile`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm p-8">
                        <div className="border-b border-gray-200 pb-6">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {student.name}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {student.department} &bull; Year {student.year_of_study || 'N/A'}
                            </p>
                        </div>

                        {/* Bio */}
                        <div className="mt-6">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                About
                            </h2>
                            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                                {student.bio || 'No bio provided yet.'}
                            </p>
                        </div>

                        {/* Interests */}
                        {student.interests && (
                            <div className="mt-6">
                                <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Interests & Focus Areas
                                </h2>
                                <p className="mt-2 text-sm text-gray-700">
                                    {student.interests}
                                </p>
                            </div>
                        )}

                        {/* Skills */}
                        <div className="mt-6">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Verified Skill Tags
                            </h2>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {student.skills && student.skills.length > 0 ? (
                                    student.skills.map((skill) => (
                                        <span
                                            key={skill.id}
                                            className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
                                        >
                                            {skill.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400">No skills listed</span>
                                )}
                            </div>
                        </div>

                        {/* Privacy Notice */}
                        <div className="mt-8 rounded-md bg-gray-50 p-4 border border-gray-100">
                            <p className="text-xs text-gray-500">
                                Contact information and email addresses are protected. Telegram handles are only shared with project owners upon collaboration request acceptance[cite: 10, 11].
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}