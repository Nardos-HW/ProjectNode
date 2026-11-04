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
                <Card className="p-6 sm:p-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold font-display text-text">{student.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                                <span className="flex items-center gap-1 text-text">
                                    <GraduationCap className="w-4 h-4 text-violet" />
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
                        <p className="text-xs text-text leading-relaxed pt-2 border-t border-surface-2 whitespace-pre-line">
                            {student.bio}
                        </p>
                    )}

                    {student.interests && (
                        <div className="text-xs text-muted">
                            <span className="font-semibold text-text">Interests: </span>
                            {student.interests}
                        </div>
                    )}

                    {student.skills.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                            {student.skills.map((skill) => (
                                <span
                                    key={skill.id}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-2 text-text border border-surface-2"
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
                            <Award className="w-5 h-5 text-mint" />
                            <h2 className="text-sm font-semibold text-text uppercase tracking-wider">
                                Project Participation History ({completedProjects.length})
                            </h2>
                        </div>
                        <span className="text-[11px] text-muted italic">
                            Owner-reported, confirmed by participant
                        </span>
                    </div>

                    {completedProjects.length === 0 ? (
                        <Card className="p-8 text-center text-xs text-muted italic">
                            No completed project credits confirmed yet.
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {completedProjects.map((p) => (
                                <Card key={p.id} className="p-5 space-y-3 border-surface-2 bg-surface">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('projects.show', p.id)}
                                                    className="font-bold text-sm text-text hover:text-violet transition-colors"
                                                >
                                                    {p.title}
                                                </Link>
                                                <CategoryBadge category={p.category} />
                                            </div>
                                            <p className="text-[11px] text-muted">
                                                Led by <span className="text-text font-medium">{p.owner_name}</span> &bull; Completed {p.completed_at}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge variant={p.role === 'owner' ? 'violet' : 'mint'} size="sm">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                {p.role_label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Outcome Summary */}
                                    <div className="p-3.5 rounded-xl bg-surface-2/60 border border-surface-2 text-xs text-text space-y-1">
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                                            Outcome Summary:
                                        </span>
                                        <p className="leading-relaxed italic">
                                            &ldquo;{p.outcome_summary}&rdquo;
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-[10px] text-mint font-semibold uppercase tracking-wider">
                                            &bull; Owner-reported, confirmed by participant
                                        </span>

                                        {p.outcome_url && (
                                            <a
                                                href={p.outcome_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-violet hover:underline font-medium"
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