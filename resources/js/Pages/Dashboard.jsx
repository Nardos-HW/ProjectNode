import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import ProjectStatusBadge from '@/Components/ProjectStatusBadge';
import CategoryBadge from '@/Components/CategoryBadge';
import Badge from '@/Components/ui/Badge';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import {
    Briefcase,
    Inbox,
    Clock,
    PlusCircle,
    ArrowRight,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    Award,
    ExternalLink,
} from 'lucide-react';

export default function Dashboard({
    stats,
    attention,
    my_projects = [],
    matches = [],
    profile,
    pendingCredits = [],
}) {
    const { auth } = usePage().props;
    const { patch, processing } = useForm({});

    const handleConfirmCredit = (participantId) => {
        patch(route('participants.confirm', participantId));
    };

    const hasAttention =
        attention.requests_to_review.length > 0 ||
        attention.accepted_applications.length > 0 ||
        attention.closing_soon.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <PageHeader
                    title={`Welcome, ${auth.user.name.split(' ')[0]}`}
                    subtitle="Track your project recruiting, collaborator requests, and skill matches."
                    actions={
                        <Button href={route('projects.create')} variant="primary" size="sm">
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" /> Post a Project
                        </Button>
                    }
                />

                {/* Pending Participation Credits Banner */}
                {pendingCredits.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-flame-500 animate-pulse"></span>
                            <Award className="w-4 h-4 text-flame-500" />
                            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                                Pending Participation Credits ({pendingCredits.length})
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {pendingCredits.map((credit) => (
                                <Card key={credit.id} className="p-5 border-flame-500/40 bg-carbon-900/90 shadow-md shadow-flame-500/10 space-y-3 cad-crosshairs">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-base">
                                                    {credit.project.title}
                                                </h3>
                                                <Badge variant="flame" size="sm">Credit Pending</Badge>
                                            </div>
                                            <p className="text-xs font-mono text-neutral-400 mt-0.5">
                                                Created by <span className="text-white font-medium">{credit.project.owner_name}</span> &bull; Credited on {credit.credited_at}
                                            </p>
                                        </div>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            size="sm"
                                            loading={processing}
                                            onClick={() => handleConfirmCredit(credit.id)}
                                            className="self-start sm:self-center"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Confirm Credit
                                        </Button>
                                    </div>

                                    <div className="p-3.5 rounded-lg bg-carbon-950 border border-carbon-800 text-xs text-neutral-300 space-y-1">
                                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                                            Owner Outcome Summary:
                                        </span>
                                        <p className="italic leading-relaxed">
                                            &ldquo;{credit.project.outcome_summary}&rdquo;
                                        </p>
                                    </div>

                                    {credit.project.outcome_url && (
                                        <a
                                            href={credit.project.outcome_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-flame-500 hover:text-flame-400 font-mono font-medium"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" /> View Deliverable
                                        </a>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Profile Completion Banner (if under 100%) */}
                {profile.percent < 100 && (
                    <Card className="p-5 border-flame-500/30 bg-carbon-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cad-crosshairs">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-flame-500" />
                                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                                    Profile {profile.percent}% Complete
                                </h3>
                            </div>
                            <p className="text-xs text-neutral-400">
                                Complete your profile to build credibility: missing{' '}
                                <span className="text-white font-medium">{profile.missing.join(', ')}</span>.
                            </p>
                        </div>
                        <Button href={route('profile.edit')} variant="secondary" size="sm">
                            Complete Profile
                        </Button>
                    </Card>
                )}

                {/* Four Stat Tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card hover className="p-5 space-y-2 cad-crosshairs">
                        <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
                            <span>Active Projects</span>
                            <Briefcase className="w-4 h-4 text-flame-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.active_projects}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500">Owned and in progress</p>
                    </Card>

                    <Card hover className="p-5 space-y-2 cad-crosshairs">
                        <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
                            <span>Inquiries</span>
                            <Inbox className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.pending_requests}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500">Awaiting your decision</p>
                    </Card>

                    <Card hover className="p-5 space-y-2 cad-crosshairs">
                        <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
                            <span>Accepted</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.applications.accepted}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500">Applications accepted</p>
                    </Card>

                    <Card hover className="p-5 space-y-2 cad-crosshairs">
                        <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
                            <span>Pending</span>
                            <Clock className="w-4 h-4 text-neutral-500" />
                        </div>
                        <div className="text-2xl font-bold font-mono text-white">
                            {stats.applications.pending}
                        </div>
                        <p className="text-[11px] font-mono text-neutral-500">Awaiting project owners</p>
                    </Card>
                </div>

                {/* Needs Your Attention Section */}
                {hasAttention && (
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-400" /> Needs Your Attention
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Requests to review */}
                            {attention.requests_to_review.length > 0 && (
                                <Card className="p-5 space-y-3 cad-crosshairs">
                                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                                        Pending Applicants
                                    </h3>
                                    <div className="space-y-2.5">
                                        {attention.requests_to_review.map((req) => (
                                            <div key={req.id} className="text-xs flex items-center justify-between gap-2 pb-2 border-b border-carbon-800 last:border-0 last:pb-0">
                                                <div className="truncate">
                                                    <span className="font-semibold text-white block truncate">{req.applicant_name}</span>
                                                    <span className="text-neutral-500 block truncate">{req.project_title}</span>
                                                </div>
                                                <Button href={route('projects.requests', req.project_id)} variant="secondary" size="sm" className="text-xs px-2 py-1">
                                                    Review
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Accepted applications */}
                            {attention.accepted_applications.length > 0 && (
                                <Card className="p-5 space-y-3 cad-crosshairs">
                                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                                        Accepted Teams
                                    </h3>
                                    <div className="space-y-2.5">
                                        {attention.accepted_applications.map((app) => (
                                            <div key={app.id} className="text-xs flex items-center justify-between gap-2 pb-2 border-b border-carbon-800 last:border-0 last:pb-0">
                                                <div className="truncate">
                                                    <span className="font-semibold text-emerald-400 block truncate">{app.project_title}</span>
                                                    <span className="text-neutral-500 text-[11px] font-mono">Contact unlocked</span>
                                                </div>
                                                <Button href={route('projects.show', app.project_id)} variant="ghost" size="sm" className="text-xs px-2 py-1">
                                                    View
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Closing soon */}
                            {attention.closing_soon.length > 0 && (
                                <Card className="p-5 space-y-3 cad-crosshairs">
                                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                                        Closing Soon
                                    </h3>
                                    <div className="space-y-2.5">
                                        {attention.closing_soon.map((p) => (
                                            <div key={p.id} className="text-xs flex items-center justify-between gap-2 pb-2 border-b border-carbon-800 last:border-0 last:pb-0">
                                                <span className="font-semibold text-white truncate">{p.title}</span>
                                                <DeadlineRing deadline={p.application_deadline} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                )}

                {/* My Projects & Skill Matches Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: My Projects (Latest 3) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">My Projects</h2>
                            <Link href={route('projects.mine')} className="text-xs font-mono text-flame-500 hover:text-flame-400 flex items-center gap-1">
                                View all <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {my_projects.length === 0 ? (
                            <Card className="p-6 text-center space-y-3 cad-crosshairs">
                                <p className="text-xs text-neutral-400">You haven't posted any projects yet.</p>
                                <Button href={route('projects.create')} variant="secondary" size="sm">
                                    Post Your First Project
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-3">
                                {my_projects.map((p) => (
                                    <Card key={p.id} hover className="p-4 space-y-3 cad-crosshairs">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold font-display text-white truncate">
                                                <Link href={route('projects.show', p.id)} className="hover:text-flame-500 transition-colors">
                                                    {p.title}
                                                </Link>
                                            </h3>
                                            <ProjectStatusBadge status={p.status} />
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                                            <SlotDots filled={p.members_count} total={p.slots_total} />
                                            <Button href={route('projects.requests', p.id)} variant="ghost" size="sm" className="text-xs px-2 py-1">
                                                Requests
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Projects for You (Matches) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Recommended Projects</h2>
                            <Link href={route('projects.index')} className="text-xs font-mono text-flame-500 hover:text-flame-400 flex items-center gap-1">
                                Browse all <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {matches.length === 0 ? (
                            <Card className="p-6 text-center space-y-3 cad-crosshairs">
                                <p className="text-xs text-neutral-400">
                                    Add skills to your profile to receive tailored project recommendations.
                                </p>
                                <Button href={route('profile.edit')} variant="secondary" size="sm">
                                    Update Profile Skills
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {matches.map((m) => (
                                    <Card key={m.id} hover className="p-4 flex flex-col justify-between space-y-3 cad-crosshairs">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between gap-1">
                                                <CategoryBadge category={m.category} />
                                                <DeadlineRing deadline={m.application_deadline} />
                                            </div>
                                            <h3 className="text-sm font-bold font-display text-white line-clamp-1">
                                                <Link href={route('projects.show', m.id)} className="hover:text-flame-500 transition-colors">
                                                    {m.title}
                                                </Link>
                                            </h3>
                                            <div className="flex flex-wrap gap-1">
                                                {m.matched_skills.map((skillName) => (
                                                    <span key={skillName} className="px-2 py-0.5 rounded bg-flame-500/10 text-flame-500 text-[10px] font-mono border border-flame-500/30">
                                                        {skillName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-2 border-t border-carbon-800 flex items-center justify-between text-xs text-neutral-400">
                                            <SlotDots filled={m.members_count} total={m.slots_total} />
                                            <Button href={route('projects.show', m.id)} variant="ghost" size="sm" className="text-xs px-2 py-1">
                                                Apply
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
