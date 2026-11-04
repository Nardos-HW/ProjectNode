import TextField from '@/Components/ui/TextField';
import TextArea from '@/Components/ui/TextArea';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import SkillCheckboxGrid from '@/Components/SkillCheckboxGrid';
import SkillPicker from '@/Components/SkillPicker';

export default function ProjectForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    departments = [],
    skills = [],
    categories = [],
    submitLabel = 'Publish Project',
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <TextField
                label="Project Title"
                required
                maxLength={120}
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                error={errors.title}
                placeholder="e.g., AAU Campus Shuttle Tracker"
            />

            <TextArea
                label="Project Description"
                required
                rows={5}
                maxLength={5000}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                error={errors.description}
                hint="Describe what problem you are solving and who you need."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                    label="Category"
                    required
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    error={errors.category}
                    options={[
                        { value: '', label: 'Select a category...' },
                        ...categories.map((c) => ({ value: c.value, label: c.label })),
                    ]}
                />

                <Select
                    label="Primary Department"
                    required
                    value={data.department_id}
                    onChange={(e) => setData('department_id', e.target.value)}
                    error={errors.department_id}
                    options={[
                        { value: '', label: 'Select department...' },
                        ...departments.map((d) => ({ value: d.id, label: d.name })),
                    ]}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <TextField
                    label="Openings (Slots)"
                    required
                    type="number"
                    min="1"
                    max="20"
                    value={data.slots_total}
                    onChange={(e) => setData('slots_total', e.target.value)}
                    error={errors.slots_total}
                />

                <TextField
                    label="Hours / Week"
                    required
                    type="number"
                    min="1"
                    max="40"
                    value={data.hours_per_week}
                    onChange={(e) => setData('hours_per_week', e.target.value)}
                    error={errors.hours_per_week}
                />

                <TextField
                    label="Duration (Weeks)"
                    required
                    type="number"
                    min="1"
                    max="52"
                    value={data.duration_weeks}
                    onChange={(e) => setData('duration_weeks', e.target.value)}
                    error={errors.duration_weeks}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextField
                    label="Application Deadline"
                    required
                    type="date"
                    value={data.application_deadline}
                    onChange={(e) => setData('application_deadline', e.target.value)}
                    error={errors.application_deadline}
                />

                <TextField
                    label="Telegram Handle"
                    required
                    value={data.telegram_contact}
                    onChange={(e) => setData('telegram_contact', e.target.value)}
                    error={errors.telegram_contact}
                    hint="Using your profile handle. Change it for this project only."
                    placeholder="username"
                />
            </div>

            <SkillPicker
                skills={skills}
                selectedIds={data.skill_ids || []}
                newSkills={data.new_skills || []}
                onChange={(ids, newOnes) => {
                    setData((prev) => ({
                        ...prev,
                        skill_ids: ids,
                        new_skills: newOnes,
                    }));
                }}
                max={10}
                error={errors.skill_ids || errors.new_skills}
            />

            <div className="flex justify-end pt-4 border-t border-surface-2">
                <Button type="submit" variant="primary" loading={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}