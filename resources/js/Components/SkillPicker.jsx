import { useState, useMemo, useRef, useEffect, useId } from 'react';
import { X, Plus, Check } from 'lucide-react';
import Badge from '@/Components/ui/Badge';

export default function SkillPicker({
    skills = [],
    selectedIds = [],
    newSkills = [],
    onChange,
    max = 10,
    error,
    label = 'Skills',
    hint = 'Select existing skills or add custom ones.',
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const listboxId = useId();

    const normalizeKey = (str) => (str || '').toLowerCase().replace(/\s+/g, '');

    const totalSelected = selectedIds.length + newSkills.length;
    const isAtLimit = totalSelected >= max;

    // Filter available skills
    const filteredSkills = useMemo(() => {
        const q = normalizeKey(query);
        return skills.filter(
            (skill) =>
                !selectedIds.includes(skill.id) &&
                normalizeKey(skill.name).includes(q)
        );
    }, [skills, selectedIds, query]);

    // Check if query exactly matches any existing or added skill
    const exactMatchExists = useMemo(() => {
        const q = normalizeKey(query);
        if (!q) return true;
        const existsInAll = skills.some((s) => normalizeKey(s.name) === q);
        const existsInNew = newSkills.some((s) => normalizeKey(s) === q);
        return existsInAll || existsInNew;
    }, [skills, newSkills, query]);

    const canAddNew = query.trim().length >= 2 && query.trim().length <= 40 && !exactMatchExists && !isAtLimit && newSkills.length < 3;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectExisting = (skillId) => {
        if (isAtLimit) return;
        onChange([...selectedIds, skillId], newSkills);
        setQuery('');
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleAddNew = () => {
        if (!canAddNew) return;
        const formatted = query.trim().replace(/\s+/g, ' ');
        onChange(selectedIds, [...newSkills, formatted]);
        setQuery('');
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleRemoveExisting = (id) => {
        onChange(selectedIds.filter((item) => item !== id), newSkills);
    };

    const handleRemoveNew = (name) => {
        onChange(selectedIds, newSkills.filter((item) => item !== name));
    };

    const handleKeyDown = (e) => {
        const totalItems = filteredSkills.length + (canAddNew ? 1 : 0);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((prev) => (prev + 1 < totalItems ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setIsOpen(true);
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < filteredSkills.length) {
                handleSelectExisting(filteredSkills[activeIndex].id);
            } else if (canAddNew && (activeIndex === filteredSkills.length || activeIndex === -1)) {
                handleAddNew();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Backspace' && query === '') {
            if (newSkills.length > 0) {
                handleRemoveNew(newSkills[newSkills.length - 1]);
            } else if (selectedIds.length > 0) {
                handleRemoveExisting(selectedIds[selectedIds.length - 1]);
            }
        }
    };

    const selectedSkillObjects = useMemo(() => {
        return selectedIds.map((id) => skills.find((s) => s.id === id)).filter(Boolean);
    }, [skills, selectedIds]);

    return (
        <div ref={containerRef} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <label className="font-medium text-text">
                    {label} <span className="text-coral">*</span>
                </label>
                <span
                    className={`text-xs ${totalSelected >= max ? 'text-coral font-medium' : totalSelected >= max * 0.9 ? 'text-amber' : 'text-muted'
                        }`}
                    aria-live="polite"
                >
                    {totalSelected} / {max} skills
                </span>
            </div>

            {/* Selected Skill Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-surface border border-surface-2">
                {selectedSkillObjects.map((skill) => (
                    <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-2 text-text text-xs border border-surface-2/80"
                    >
                        {skill.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveExisting(skill.id)}
                            className="text-muted hover:text-coral transition-colors"
                            aria-label={`Remove skill ${skill.name}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {newSkills.map((name) => (
                    <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet/15 text-violet text-xs border border-violet/30"
                    >
                        {name}
                        <Badge variant="violet" size="sm" className="px-1 py-0 text-[10px]">
                            New
                        </Badge>
                        <button
                            type="button"
                            onClick={() => handleRemoveNew(name)}
                            className="text-violet/70 hover:text-coral transition-colors"
                            aria-label={`Remove new skill ${name}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {/* Combobox Input */}
                <div className="flex-1 min-w-[140px] relative">
                    <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-controls={listboxId}
                        aria-autocomplete="list"
                        disabled={isAtLimit}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                            setActiveIndex(-1);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={isAtLimit ? 'Max skills selected' : 'Type to search or add skills...'}
                        className="w-full bg-transparent border-0 p-1 text-xs text-text placeholder-muted/60 focus:ring-0 focus:outline-none"
                    />
                </div>
            </div>

            {/* Dropdown Options */}
            {isOpen && !isAtLimit && (
                <div
                    id={listboxId}
                    role="listbox"
                    className="relative z-30 w-full mt-1 max-h-48 overflow-y-auto rounded-xl bg-surface border border-surface-2 shadow-xl shadow-black/40 py-1"
                >
                    {filteredSkills.slice(0, 15).map((skill, index) => {
                        const isHighlighted = index === activeIndex;
                        return (
                            <div
                                key={skill.id}
                                role="option"
                                aria-selected={isHighlighted}
                                onClick={() => handleSelectExisting(skill.id)}
                                className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${isHighlighted ? 'bg-surface-2 text-text' : 'text-muted hover:text-text hover:bg-surface-2/60'
                                    }`}
                            >
                                <span>{skill.name}</span>
                            </div>
                        );
                    })}

                    {canAddNew && (
                        <div
                            role="option"
                            aria-selected={activeIndex === filteredSkills.length}
                            onClick={handleAddNew}
                            className={`px-3 py-2 text-xs flex items-center gap-2 cursor-pointer border-t border-surface-2/80 text-violet font-medium ${activeIndex === filteredSkills.length ? 'bg-surface-2' : 'hover:bg-surface-2/60'
                                }`}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add &ldquo;{query.trim()}&rdquo; as custom skill</span>
                        </div>
                    )}

                    {filteredSkills.length === 0 && !canAddNew && (
                        <div className="px-3 py-2 text-xs text-muted text-center">
                            {query ? 'No matching skills found' : 'Start typing to search skills'}
                        </div>
                    )}
                </div>
            )}

            {hint && !error && <p className="text-xs text-muted">{hint}</p>}
            {error && <p className="text-xs text-coral">{error}</p>}
        </div>
    );
}