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
            <div className="flex justify-between items-center text-xs text-muted font-medium">
                <span>Select 1 to 10 required skills</span>
                <span>{selectedIds.length} / 10 selected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-surface border border-surface-2">
                {skills.map((skill) => {
                    const isChecked = selectedIds.includes(skill.id);
                    return (
                        <label
                            key={skill.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs select-none transition-colors border ${isChecked
                                    ? 'bg-violet/15 border-violet/40 text-text font-medium'
                                    : 'border-transparent text-muted hover:text-text hover:bg-surface-2/40'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(skill.id)}
                                className="rounded border-surface-2 text-violet focus:ring-violet bg-ink"
                            />
                            <span className="truncate">{skill.name}</span>
                        </label>
                    );
                })}
            </div>

            {error && <p className="text-xs text-coral">{error}</p>}
        </div>
    );
}