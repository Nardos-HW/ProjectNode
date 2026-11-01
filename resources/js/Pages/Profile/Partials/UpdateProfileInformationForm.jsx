import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformationForm({
    departments = [],
    skills = [],
    userSkills = [],
    className = '',
}) {
    const user = usePage().props.auth.user || {};

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        department_id: user.department_id || '',
        year_of_study: user.year_of_study || '',
        bio: user.bio || '',
        interests: user.interests || '',
        telegram_handle: user.telegram_handle || '',
        skill_ids: user.skill_ids || userSkills || [],
    });

    const handleSkillToggle = (skillId) => {
        if (data.skill_ids.includes(skillId)) {
            setData('skill_ids', data.skill_ids.filter((id) => id !== skillId));
        } else {
            if (data.skill_ids.length < 15) {
                setData('skill_ids', [...data.skill_ids, skillId]);
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Academic Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Complete your university profile to publish project ideas and request to join existing projects.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Full Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Permanent AAU Email (Read-Only) */}
                <div>
                    <InputLabel htmlFor="email" value="University Email (Read-Only)" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300 shadow-sm"
                        value={user.email || ''}
                        disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        University email addresses are permanent and cannot be modified.
                    </p>
                </div>

                {/* Department & Year of Study */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="department_id" value="Department" />
                        <select
                            id="department_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            required
                        >
                            <option value="">Select your department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <InputError className="mt-2" message={errors.department_id} />
                    </div>

                    <div>
                        <InputLabel htmlFor="year_of_study" value="Year of Study (1 - 7)" />
                        <TextInput
                            id="year_of_study"
                            type="number"
                            min="1"
                            max="7"
                            className="mt-1 block w-full"
                            value={data.year_of_study}
                            onChange={(e) => setData('year_of_study', parseInt(e.target.value) || '')}
                            required
                        />
                        <InputError className="mt-2" message={errors.year_of_study} />
                    </div>
                </div>

                {/* Telegram Handle */}
                <div>
                    <InputLabel htmlFor="telegram_handle" value="Telegram Username (without @)" />
                    <TextInput
                        id="telegram_handle"
                        className="mt-1 block w-full"
                        value={data.telegram_handle}
                        onChange={(e) => setData('telegram_handle', e.target.value)}
                        placeholder="abebe_k"
                        required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Shared only with project owners or accepted team collaborators.
                    </p>
                    <InputError className="mt-2" message={errors.telegram_handle} />
                </div>

                {/* Bio */}
                <div>
                    <InputLabel htmlFor="bio" value="Short Bio (20 - 500 characters)" />
                    <textarea
                        id="bio"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        placeholder="Describe your academic interests, past projects, or what software you enjoy building..."
                        required
                    />
                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {/* Interests */}
                <div>
                    <InputLabel htmlFor="interests" value="Interests / Focus Areas (Optional)" />
                    <TextInput
                        id="interests"
                        className="mt-1 block w-full"
                        value={data.interests}
                        onChange={(e) => setData('interests', e.target.value)}
                        placeholder="e.g. Distributed Systems, Mobile Health, FinTech"
                    />
                    <InputError className="mt-2" message={errors.interests} />
                </div>

                {/* Skills Selection (1 to 15) */}
                <div>
                    <InputLabel value={`Skills (${data.skill_ids.length} / 15 selected, min 1)`} />
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
                    <InputError className="mt-2" message={errors.skill_ids} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Saving...' : 'Save Profile'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved successfully.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}