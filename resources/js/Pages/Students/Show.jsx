import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import { Head } from '@inertiajs/react';
import { ArrowLeft, User } from 'lucide-react';

export default function Show({ student }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${student.name}'s Profile`} />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <Button href={route('projects.index')} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Projects
                </Button>

                <Card className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-surface-2">
                        <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center text-violet border border-surface-2">
                            <User className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold font-display text-text">{student.name}</h1>
                            <p className="text-xs text-muted mt-0.5">
                                {student.department} &bull; Year {student.year_of_study || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">About</h2>
                        <p className="text-sm text-text whitespace-pre-line leading-relaxed">
                            {student.bio || 'No bio provided yet.'}
                        </p>
                    </div>

                    {student.interests && (
                        <div className="space-y-1">
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Interests & Focus Areas</h2>
                            <p className="text-sm text-text">{student.interests}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Verified Skill Tags</h2>
                        <div className="flex flex-wrap gap-1.5">
                            {student.skills && student.skills.length > 0 ? (
                                student.skills.map((skill) => (
                                    <span key={skill.id} className="px-2.5 py-1 rounded-lg bg-surface-2 text-xs font-medium text-text">
                                        {skill.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-muted">No skills listed</span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface-2/40 border border-surface-2 text-xs text-muted">
                        University emails and contact handles are private. Handles are revealed to project creators only upon request acceptance.
                    </div>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}