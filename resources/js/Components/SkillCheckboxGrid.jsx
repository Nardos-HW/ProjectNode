export default function SkillCheckboxGrid({ skills = [], selectedIds = [], onChange, error }) {
    const handleToggle = (id) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((item) => item !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-neutral-500 font-mono">
                <span>Select 1 to 10 required skills</span>
                <span>{selectedIds.length} / 10 selected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                {skills.map((skill) => {
                    const isChecked = selectedIds.includes(skill.id);
                    return (
                        <label
                            key={skill.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-mono select-none transition-colors border ${
                                isChecked
                                    ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium'
                                    : 'border-transparent text-neutral-700 hover:bg-neutral-100'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(skill.id)}
                                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 bg-white"
                            />
                            <span className="truncate">{skill.name}</span>
                        </label>
                    );
                })}
            </div>

            {error && <p className="text-xs font-mono text-red-500">{error}</p>}
        </div>
    );
}
