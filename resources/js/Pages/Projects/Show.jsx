import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import TextArea from '@/Components/ui/TextArea';
import SlotDots from '@/Components/ui/SlotDots';
import DeadlineRing from '@/Components/ui/DeadlineRing';
import CategoryBadge from '@/Components/CategoryBadge';
import ProjectStatusBadge from '@/Components/ProjectStatusBadge';
import ConfirmDialog from '@/Components/ui/ConfirmDialog';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, Calendar, Users, Send, Edit3, PauseCircle, PlayCircle, Ban, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Show({ project, existingRequest, can, my_conversation_id }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleDelete = () => {
        router.delete(route('projects.destroy', project.id));
    };

    const handleStatusChange = (newStatus) => {
        setStatusLoading(true);
        router.patch(route('projects.status', project.id), { status: newStatus }, {
            onFinish: () => {
                setStatusLoading(false);
                setConfirmCancel(false);
            },
        });
    };

    const handleApply = (e) => {
        e.preventDefault();
        post(route('projects.join', project.id), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={project.title} />

            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <Button href={route('projects.index')} variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Projects
                    </Button>

                    <div className="flex flex-wrap items-center gap-2">
                        {can.manageRequests && (
                            <Button href={route('projects.requests', project.id)} variant="primary" size="sm">
                                Review Requests ({project.accepted_count} / {project.slots_total})
                            </Button>
                        )}

                        {can.update && (
                            <Button href={route('projects.edit', project.id)} variant="secondary" size="sm">
                                <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                            </Button>
                        )}

                        {can.changeStatus && project.status === 'open' && (
                            <Button
                                variant="secondary"
                                size="sm"
                                loading={statusLoading}
                                onClick={() => handleStatusChange('in_progress')}
                            >
                                <PauseCircle className="w-3.5 h-3.5 mr-1" /> Stop Recruiting
                            </Button>
                        )}

                        {can.changeStatus && project.status === 'in_progress' && (
                            <Button
                                variant="secondary"
                                size="sm"
                                loading={statusLoading}
                                onClick={() => handleStatusChange('open')}
                            >
                                <PlayCircle className="w-3.5 h-3.5 mr-1" /> Reopen
                            </Button>
                        )}

                        {can.changeStatus && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmCancel(true)}
                                className="text-coral hover:text-coral hover:bg-coral/10"
                            >
                                <Ban className="w-3.5 h-3.5 mr-1" /> Cancel Project
                            </Button>
                        )}

                        {can.delete && (
                            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Project Card */}
                <Card className="p-6 sm:p-8 space-y-6 cad-crosshairs">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-carbon-800">
                        <div className="flex items-center gap-2">
                            <CategoryBadge category={project.category} />
                            <ProjectStatusBadge
                                status={project.status}
                                isRecruiting={project.is_recruiting}
                            />
                        </div>
                        <span className="text-xs font-mono text-neutral-400">
                            Posted by{' '}
                            <Link href={route('students.show', project.owner.id)} className="text-flame-500 hover:underline font-medium">
                                {project.owner.name}
                            </Link>
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                            {project.title}
                        </h1>
                        <p className="mt-4 text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Blueprint Constraint Stats Data Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-carbon-950 border border-carbon-800 text-center font-mono">
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center justify-center gap-1">
                                <Users className="w-3.5 h-3.5 text-flame-500" /> Openings
                            </span>
                            <div className="flex justify-center pt-1">
                                <SlotDots filled={project.accepted_count ?? 0} total={project.slots_total} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center justify-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-flame-500" /> Hours / Week
                            </span>
                            <span className="text-sm font-bold text-white block">{project.hours_per_week} hrs/wk</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block flex items-center justify-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-flame-500" /> Duration
                            </span>
                            <span className="text-sm font-bold text-white block">{project.duration_weeks} wks</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">Deadline</span>
                            <DeadlineRing deadline={project.application_deadline} className="justify-center" />
                        </div>
                    </div>

                    {/* Skills */}
                    {project.skills && project.skills.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                                Required Technical Skills
                            </h2>
                            <div className="flex flex-wrap gap-1.5">
                                {project.skills.map((skill) => (
                                    <span key={skill.id} className="px-2.5 py-1 rounded bg-carbon-850 border border-carbon-700 text-xs font-mono text-neutral-200">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Telegram Contact Box */}
                    <div className="p-5 rounded-lg bg-carbon-950 border border-carbon-800 space-y-2">
                        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">Direct Technical Contact (Telegram)</h2>
                        {can.viewContact && project.telegram_contact ? (
                            <p className="text-sm font-mono text-neutral-200">
                                Username:{' '}
                                <a
                                    href={`https://t.me/${project.telegram_contact}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 font-semibold hover:underline"
                                >
                                    @{project.telegram_contact}
                                </a>
                            </p>
                        ) : (
                            <p className="text-xs font-mono text-neutral-500">
                                Private. Revealed only to accepted collaborators and the project creator.
                            </p>
                        )}

                        {my_conversation_id && (
                            <div className="pt-2 border-t border-carbon-800">
                                <Button
                                    href={route('messages.show', my_conversation_id)}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Message project owner
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Existing Application Banner */}
                {existingRequest && (
                    <Card className="p-6 border-flame-500/40 bg-carbon-900 space-y-2 cad-crosshairs">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Application Status</h3>
                            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-flame-500/10 text-flame-500 border border-flame-500/30 uppercase tracking-wider">
                                {project.status === 'cancelled' || project.status === 'completed'
                                    ? 'Project closed'
                                    : existingRequest.status_label}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-400 italic">&ldquo;{existingRequest.message}&rdquo;</p>
                        {existingRequest.status === 'accepted' && (
                            <p className="text-xs text-emerald-400 font-mono font-medium">
                                You are an accepted collaborator! Use the Telegram contact above to coordinate.
                            </p>
                        )}
                        {(project.status === 'cancelled' || project.status === 'completed') && (
                            <p className="text-xs font-mono text-neutral-500">
                                This project is closed and no longer accepting participants.
                            </p>
                        )}
                    </Card>
                )}

                {/* Apply Box */}
                {can.apply && (
                    <Card className="p-6 sm:p-8 space-y-4 cad-crosshairs">
                        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                            Request to Join this Project
                        </h2>
                        <p className="text-xs text-neutral-400">
                            Introduce yourself to {project.owner.name} with relevant skills and your availability.
                        </p>
                        <form onSubmit={handleApply} className="space-y-4">
                            <TextArea
                                label="Application Message"
                                required
                                rows={4}
                                maxLength={500}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                error={errors.message}
                                placeholder="Hi! I am experienced with React and Tailwind, and I have 10 hours a week to contribute..."
                                hint="Min 10, max 500 characters."
                            />
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={processing}
                                    disabled={data.message.length < 10}
                                >
                                    <Send className="w-3.5 h-3.5 mr-1.5" /> Submit Request
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                <ConfirmDialog
                    show={confirmDelete}
                    title="Delete Project Listing"
                    content="Are you sure you want to delete this project? This will soft delete the project and cannot be undone."
                    danger
                    onClose={() => setConfirmDelete(false)}
                    onConfirm={handleDelete}
                />

                <ConfirmDialog
                    show={confirmCancel}
                    title="Cancel Project"
                    content="Are you sure you want to cancel this project? This is a terminal action; once cancelled, the project cannot be reopened."
                    danger
                    confirmText="Cancel Project"
                    loading={statusLoading}
                    onClose={() => setConfirmCancel(false)}
                    onConfirm={() => handleStatusChange('cancelled')}
                />
            </div>
        </AuthenticatedLayout>
    );
}