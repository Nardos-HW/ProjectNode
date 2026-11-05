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
        const trimmed = query.trim();
        if (!canAddNew) return;
        onChange(selectedIds, [...newSkills, trimmed]);
        setQuery('');
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    };

    const handleRemoveExisting = (skillId) => {
        onChange(selectedIds.filter((id) => id !== skillId), newSkills);
    };

    const handleRemoveNew = (name) => {
        onChange(selectedIds, newSkills.filter((n) => n !== name));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && !query) {
            if (newSkills.length > 0) {
                handleRemoveNew(newSkills[newSkills.length - 1]);
            } else if (selectedIds.length > 0) {
                handleRemoveExisting(selectedIds[selectedIds.length - 1]);
            }
            return;
        }

        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
            }
            return;
        }

        const itemsCount = filteredSkills.length + (canAddNew ? 1 : 0);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1 < itemsCount ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev - 1 >= 0 ? prev - 1 : itemsCount - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < filteredSkills.length) {
                handleSelectExisting(filteredSkills[activeIndex].id);
            } else if (canAddNew && activeIndex === filteredSkills.length) {
                handleAddNew();
            } else if (canAddNew) {
                handleAddNew();
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setActiveIndex(-1);
        }
    };

    const selectedSkillObjects = useMemo(() => {
        return selectedIds.map((id) => skills.find((s) => s.id === id)).filter(Boolean);
    }, [skills, selectedIds]);

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-neutral-800 text-[11px] uppercase tracking-wider">
                    {label} <span className="text-blue-600">*</span>
                </label>
                <span
                    className={`text-xs font-mono ${
                        totalSelected >= max
                            ? 'text-red-500 font-medium'
                            : totalSelected >= max * 0.9
                            ? 'text-amber-500'
                            : 'text-neutral-400'
                    }`}
                    aria-live="polite"
                >
                    {totalSelected} / {max} skills
                </span>
            </div>

            {/* Selected Skill Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl bg-white border border-neutral-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors shadow-xs">
                {selectedSkillObjects.map((skill) => (
                    <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-mono border border-neutral-200/80"
                    >
                        {skill.name}
                        <button
                            type="button"
                            onClick={() => handleRemoveExisting(skill.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors"
                            aria-label={`Remove skill ${skill.name}`}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {newSkills.map((name) => (
                    <span
                        key={name}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200"
                    >
                        {name}
                        <Badge variant="mint" size="sm" className="px-1 py-0 text-[9px]">
                            New
                        </Badge>
                        <button
                            type="button"
                            onClick={() => handleRemoveNew(name)}
                            className="text-blue-500 hover:text-red-500 transition-colors"
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
                        className="w-full bg-transparent border-0 p-1 text-xs text-neutral-900 placeholder-neutral-400 focus:ring-0 focus:outline-none"
                    />
                </div>
            </div>

            {/* Dropdown Options */}
            {isOpen && !isAtLimit && (
                <div
                    id={listboxId}
                    role="listbox"
                    className="relative z-30 w-full mt-1 max-h-48 overflow-y-auto rounded-xl bg-white border border-neutral-200 shadow-xl py-1"
                >
                    {filteredSkills.slice(0, 15).map((skill, index) => {
                        const isHighlighted = index === activeIndex;
                        return (
                            <div
                                key={skill.id}
                                role="option"
                                aria-selected={isHighlighted}
                                onClick={() => handleSelectExisting(skill.id)}
                                className={`px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer font-mono transition-colors ${
                                    isHighlighted ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-50'
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
                            className={`px-3.5 py-2 text-xs flex items-center justify-between cursor-pointer border-t border-neutral-100 font-mono transition-colors ${
                                activeIndex === filteredSkills.length
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-blue-600 hover:bg-blue-50/50'
                            }`}
                        >
                            <span className="flex items-center gap-1.5 font-semibold">
                                <Plus className="w-3.5 h-3.5" /> Add &ldquo;{query.trim()}&rdquo; as custom skill
                            </span>
                            <span className="text-[10px] text-neutral-400 font-normal">({3 - newSkills.length} left)</span>
                        </div>
                    )}

                    {filteredSkills.length === 0 && !canAddNew && (
                        <div className="px-3.5 py-3 text-xs text-neutral-400 text-center font-mono">
                            {query ? 'No matching skills found' : 'All available skills selected'}
                        </div>
                    )}
                </div>
            )}

            {error ? (
                <p className="text-xs text-red-500 font-mono">{error}</p>
            ) : hint ? (
                <p className="text-xs text-neutral-500 font-sans">{hint}</p>
            ) : null}
        </div>
    );
}
