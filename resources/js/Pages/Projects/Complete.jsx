import { useForm, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Card from '@/Components/ui/Card';
import Button from '@/Components/ui/Button';
import PageHeader from '@/Components/ui/PageHeader';
import TextArea from '@/Components/ui/TextArea';
import TextField from '@/Components/ui/TextField';
import { Award, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Complete({ project, members = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        outcome_summary: '',
        outcome_url: '',
        credited_user_ids: [],
    });

    const handleCheckboxToggle = (userId) => {
        if (data.credited_user_ids.includes(userId)) {
            setData('credited_user_ids', data.credited_user_ids.filter((id) => id !== userId));
        } else {
            setData('credited_user_ids', [...data.credited_user_ids, userId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('projects.complete.store', project.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Complete Project: ${project.title}`} />

            <div className="py-8 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <Button href={route('projects.show', project.id)} variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Project
                </Button>

                <PageHeader
                    title="Mark Project as Completed"
                    subtitle="Record outcomes and certify contributing team members. This action freezes project content and cannot be undone."
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="p-6 sm:p-8 space-y-6">
                        {/* Notice Card */}
                        <div className="p-4 rounded-xl bg-violet/10 border border-violet/30 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-violet shrink-0 mt-0.5" />
                            <div className="text-xs space-y-1">
                                <span className="font-semibold text-text">Irreversible Completion Record</span>
                                <p className="text-muted leading-relaxed">
                                    Once completed, the project description and openings cannot be changed. As the creator, you are automatically confirmed. Credited members will receive a credit confirmation notice.
                                </p>
                            </div>
                        </div>

                        {/* Outcome Summary */}
                        <TextArea
                            label="Outcome Summary"
                            required
                            rows={5}
                            maxLength={1000}
                            value={data.outcome_summary}
                            onChange={(e) => setData('outcome_summary', e.target.value)}
                            error={errors.outcome_summary}
                            placeholder="Describe what your team built, research findings, competition results, or final deliverable (minimum 20 characters)..."
                            helper="Provide an authentic, honest summary of what was accomplished."
                        />

                        {/* Evidence Link */}
                        <TextField
                            label="Evidence URL (Optional)"
                            type="url"
                            value={data.outcome_url}
                            onChange={(e) => setData('outcome_url', e.target.value)}
                            error={errors.outcome_url}
                            placeholder="https://github.com/... or https://demo..."
                            helper="Optional secure HTTPS link to evidence, source code repository, or demo video."
                        />

                        {/* Contributor Selection */}
                        <div className="space-y-3 pt-4 border-t border-surface-2">
                            <div>
                                <label className="text-xs font-semibold text-text uppercase tracking-wider block">
                                    Certify Contributing Members
                                </label>
                                <p className="text-xs text-muted mt-0.5">
                                    Select only collaborators who made meaningful contributions. Unselected members will not receive participation credit.
                                </p>
                            </div>

                            {members.length === 0 ? (
                                <div className="p-4 rounded-xl bg-surface-2/40 border border-surface-2 text-xs text-muted italic">
                                    No collaborators were accepted onto this project. You will be recorded as the sole contributor.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {members.map((member) => {
                                        const isChecked = data.credited_user_ids.includes(member.user_id);
                                        return (
                                            <label
                                                key={member.user_id}
                                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${isChecked
                                                        ? 'bg-violet/10 border-violet/40 text-text'
                                                        : 'bg-surface-2/30 border-surface-2 text-muted hover:border-surface-2/80'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleCheckboxToggle(member.user_id)}
                                                        className="rounded border-surface-2 text-violet focus:ring-violet bg-ink w-4 h-4"
                                                    />
                                                    <div>
                                                        <span className="font-semibold text-text text-xs block">
                                                            {member.name}
                                                        </span>
                                                        <span className="text-[11px] text-muted">
                                                            {member.department} {member.year_of_study ? `• Year ${member.year_of_study}` : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-medium text-violet">
                                                    {isChecked ? 'Will receive credit' : 'No credit'}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}

                            {errors.credited_user_ids && (
                                <p className="text-xs text-coral">{errors.credited_user_ids}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={processing}
                            >
                                <Award className="w-4 h-4 mr-1.5" /> Complete Project & Issue Credits
                            </Button>
                        </div>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}