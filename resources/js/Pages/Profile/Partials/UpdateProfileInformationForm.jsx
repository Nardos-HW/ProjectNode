import TextField from '@/Components/ui/TextField';
import TextArea from '@/Components/ui/TextArea';
import Select from '@/Components/ui/Select';
import Button from '@/Components/ui/Button';
import SkillPicker from '@/Components/SkillPicker';
import SkillCheckboxGrid from '@/Components/SkillCheckboxGrid';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformationForm({
    departments = [],
    skills = [],
    userSkills = [],
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        department_id: user.department_id || '',
        year_of_study: user.year_of_study || 1,
        bio: user.bio || '',
        interests: user.interests || '',
        telegram_handle: user.telegram_handle || '',
        skill_ids: userSkills || [],
        new_skills: [],
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-lg font-bold font-display text-neutral-950">Academic Profile</h2>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                    Your department, year, skills, and Telegram handle for student collaboration.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <TextField
                    label="Full Name"
                    required
                    maxLength={100}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label="Department"
                        required
                        value={data.department_id}
                        onChange={(e) => setData('department_id', e.target.value)}
                        error={errors.department_id}
                        options={[
                            { value: '', label: 'Select your department...' },
                            ...departments.map((d) => ({ value: d.id, label: d.name })),
                        ]}
                    />

                    <Select
                        label="Year of Study"
                        required
                        value={data.year_of_study}
                        onChange={(e) => setData('year_of_study', e.target.value)}
                        error={errors.year_of_study}
                        options={[
                            { value: 1, label: 'Year 1' },
                            { value: 2, label: 'Year 2' },
                            { value: 3, label: 'Year 3' },
                            { value: 4, label: 'Year 4' },
                            { value: 5, label: 'Year 5' },
                            { value: 6, label: 'Year 6' },
                            { value: 7, label: 'Year 7' },
                        ]}
                    />
                </div>

                <TextArea
                    label="Biography"
                    required
                    rows={4}
                    maxLength={500}
                    value={data.bio}
                    onChange={(e) => setData('bio', e.target.value)}
                    error={errors.bio}
                    hint="A short summary of your background, experience, and interests."
                />

                <TextField
                    label="Interests & Focus Areas"
                    maxLength={255}
                    value={data.interests}
                    onChange={(e) => setData('interests', e.target.value)}
                    error={errors.interests}
                    hint="e.g., Mobile Development, Distributed Systems, UI Design"
                />

                <TextField
                    label="Telegram Username"
                    required
                    value={data.telegram_handle}
                    onChange={(e) => setData('telegram_handle', e.target.value)}
                    error={errors.telegram_handle}
                    hint="Without @. Shared with project creators upon request acceptance."
                />

                <SkillPicker
                    skills={skills}
                    selectedIds={data.skill_ids}
                    newSkills={data.new_skills || []}
                    onChange={(ids, newOnes) => {
                        setData((prev) => ({
                            ...prev,
                            skill_ids: ids,
                            new_skills: newOnes,
                        }));
                    }}
                    max={15}
                    error={errors.skill_ids || errors.new_skills}
                />

                <div className="flex items-center gap-4 pt-2">
                    <Button type="submit" variant="primary" loading={processing}>
                        Save Profile
                    </Button>

                    {recentlySuccessful && (
                        <p className="text-xs text-emerald-600 font-medium">Saved.</p>
                    )}
                </div>
            </form>
        </section>
    );
}