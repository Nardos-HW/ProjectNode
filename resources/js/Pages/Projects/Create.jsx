import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ departments, skills, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category: categories[0]?.value || 'personal',
        department_id: '',
        skill_ids: [],
        slots_total: 2,
        hours_per_week: 10,
        duration_weeks: 4,
        application_deadline: '',
        telegram_contact: '',
    });

    const handleSkillToggle = (skillId) => {
        if (data.skill_ids.includes(skillId)) {
            setData('skill_ids', data.skill_ids.filter((id) => id !== skillId));
        } else {
            if (data.skill_ids.length < 10) {
                setData('skill_ids', [...data.skill_ids, skillId]);
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Publish a Project Listing
                </h2>
            }
        >
            <Head title="Create Project" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                        {/* Title */}
                        <div>
                            <InputLabel htmlFor="title" value="Project Title" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. AAU Shuttle Bus Tracker"
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Category & Department */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <InputLabel htmlFor="category" value="Category" />
                                <select
                                    id="category"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="department_id" value="Department Context (Optional)" />
                                <select
                                    id="department_id"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={data.department_id}
                                    onChange={(e) => setData('department_id', e.target.value)}
                                >
                                    <option value="">Any / General Campus</option>
                                    {departments.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.department_id} className="mt-2" />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <InputLabel htmlFor="description" value="Project Description & Role Requirements" />
                            <textarea
                                id="description"
                                rows={5}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe your goal, what architecture you are using, and what collaborators you are looking for (min 30 characters)..."
                                required
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Constraints (Slots, Hours, Duration, Deadline) */}
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div>
                                <InputLabel htmlFor="slots_total" value="Openings (1-20)" />
                                <TextInput
                                    id="slots_total"
                                    type="number"
                                    min="1"
                                    max="20"
                                    className="mt-1 block w-full"
                                    value={data.slots_total}
                                    onChange={(e) => setData('slots_total', parseInt(e.target.value) || '')}
                                    required
                                />
                                <InputError message={errors.slots_total} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="hours_per_week" value="Hours / Week" />
                                <TextInput
                                    id="hours_per_week"
                                    type="number"
                                    min="1"
                                    max="40"
                                    className="mt-1 block w-full"
                                    value={data.hours_per_week}
                                    onChange={(e) => setData('hours_per_week', parseInt(e.target.value) || '')}
                                    required
                                />
                                <InputError message={errors.hours_per_week} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="duration_weeks" value="Duration (Weeks)" />
                                <TextInput
                                    id="duration_weeks"
                                    type="number"
                                    min="1"
                                    max="52"
                                    className="mt-1 block w-full"
                                    value={data.duration_weeks}
                                    onChange={(e) => setData('duration_weeks', parseInt(e.target.value) || '')}
                                    required
                                />
                                <InputError message={errors.duration_weeks} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="application_deadline" value="Deadline" />
                                <TextInput
                                    id="application_deadline"
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    className="mt-1 block w-full"
                                    value={data.application_deadline}
                                    onChange={(e) => setData('application_deadline', e.target.value)}
                                    required
                                />
                                <InputError message={errors.application_deadline} className="mt-2" />
                            </div>
                        </div>

                        {/* Telegram Handle */}
                        <div>
                            <InputLabel htmlFor="telegram_contact" value="Your Telegram Username (For accepted team members)" />
                            <TextInput
                                id="telegram_contact"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.telegram_contact}
                                onChange={(e) => setData('telegram_contact', e.target.value)}
                                placeholder="abebe_k (without @)"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                5-32 characters, letters, digits, and underscores.
                            </p>
                            <InputError message={errors.telegram_contact} className="mt-2" />
                        </div>

                        {/* Skills Selection (1 to 10) */}
                        <div>
                            <InputLabel value={`Required Skills (${data.skill_ids.length} / 10 selected)`} />
                            <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 p-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {skills.map((skill) => (
                                    <label
                                        key={skill.id}
                                        className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={data.skill_ids.includes(skill.id)}
                                            onChange={() => handleSkillToggle(skill.id)}
                                        />
                                        <span>{skill.name}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.skill_ids} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                            <PrimaryButton disabled={processing}>
                                {processing ? 'Publishing...' : 'Publish Project'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}