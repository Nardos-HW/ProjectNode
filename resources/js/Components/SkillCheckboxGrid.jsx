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
            <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
                <span>Select 1 to 10 required skills</span>
                <span>{selectedIds.length} / 10 selected</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 rounded-lg bg-carbon-950 border border-carbon-800">
                {skills.map((skill) => {
                    const isChecked = selectedIds.includes(skill.id);
                    return (
                        <label
                            key={skill.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs font-mono select-none transition-colors border ${isChecked
                                    ? 'bg-flame-500/15 border-flame-500/40 text-white font-medium'
                                    : 'border-transparent text-neutral-400 hover:text-white hover:bg-carbon-850'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(skill.id)}
                                className="rounded border-carbon-700 text-flame-500 focus:ring-flame-500 bg-carbon-900"
                            />
                            <span className="truncate">{skill.name}</span>
                        </label>
                    );
                })}
            </div>

            {error && <p className="text-xs font-mono text-red-400">{error}</p>}
        </div>
    );
}