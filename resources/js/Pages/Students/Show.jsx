import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Badge from '@/Components/ui/Badge';
import CategoryBadge from '@/Components/CategoryBadge';
import { Head, Link } from '@inertiajs/react';
import { User, GraduationCap, BookOpen, Award, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Show({ student, completedProjects = [] }) {
    return (
        <AuthenticatedLayout>
            <Head title={`${student.name}'s Profile`} />

            <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Academic Header Card */}
                <Card className="p-6 sm:p-8 space-y-4 bg-white border border-neutral-200/80 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">{student.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                                <span className="flex items-center gap-1 text-neutral-800 font-semibold">
                                    <GraduationCap className="w-4 h-4 text-blue-600" />
                                    {student.department}
                                </span>
                                {student.year_of_study && (
                                    <span>&bull; Year {student.year_of_study}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="neutral">AAU Student</Badge>
                            {completedProjects.length > 0 && (
                                <Badge variant="mint">
                                    <Award className="w-3 h-3 mr-1" />
                                    {completedProjects.length} Verified {completedProjects.length === 1 ? 'Credit' : 'Credits'}
                                </Badge>
                            )}
                        </div>
                    </div>

                    {student.bio && (
                        <p className="text-sm text-neutral-600 leading-relaxed pt-2 border-t border-neutral-100 whitespace-pre-line font-sans">
                            {student.bio}
                        </p>
                    )}

                    {student.interests && (
                        <div className="text-xs font-mono text-neutral-500">
                            <span className="font-semibold text-neutral-800">Interests: </span>
                            {student.interests}
                        </div>
                    )}

                    {student.skills.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                            {student.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-neutral-100 text-neutral-700 border border-neutral-200/80"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Verified Project Participation History (FR-COMP-05) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-emerald-600" />
                            <h2 className="text-xs font-mono font-bold text-neutral-900 uppercase tracking-wider">
                                Project Participation History ({completedProjects.length})
                            </h2>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                            Owner-reported &bull; Confirmed by participant
                        </span>
                    </div>

                    {completedProjects.length === 0 ? (
                        <Card className="p-8 text-center text-xs font-mono text-neutral-400 italic bg-white border border-neutral-200/80">
                            No completed project credits confirmed yet.
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {completedProjects.map((p) => (
                                <Card key={p.id} className="p-5 space-y-3 bg-white border border-neutral-200/80 shadow-card">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('projects.show', p.id)}
                                                    className="font-bold text-sm text-neutral-950 hover:text-blue-600 transition-colors"
                                                >
                                                    {p.title}
                                                </Link>
                                                <CategoryBadge category={p.category} />
                                            </div>
                                            <p className="text-[11px] font-mono text-neutral-500">
                                                Led by <span className="text-neutral-900 font-medium">{p.owner_name}</span> &bull; Completed {p.completed_at}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant={p.role === 'owner' ? 'coral' : 'mint'} size="sm">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                {p.role_label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Outcome Summary */}
                                    <div className="p-3.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80 text-xs text-neutral-700 space-y-1">
                                        <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
                                            Outcome Summary:
                                        </span>
                                        <p className="leading-relaxed italic">
                                            &ldquo;{p.outcome_summary}&rdquo;
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-1 font-mono">
                                        <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                                            &bull; Verified Contribution Record
                                        </span>

                                        {p.outcome_url && (
                                            <a
                                                href={p.outcome_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-mono font-medium"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" /> Project Evidence
                                            </a>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
