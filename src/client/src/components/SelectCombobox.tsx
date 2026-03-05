import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface SelectComboboxProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
}

export const SelectCombobox = ({ options, value, onChange, placeholder = 'Select...', icon }: SelectComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(opt => opt.value === value);
  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 bg-slate-800/30 border rounded-xl cursor-pointer transition-all ${
          isOpen ? 'border-primary-500/50 bg-slate-800/50' : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        <div className="flex items-center gap-3">
          {(selected?.icon || icon) && <span className="text-2xl">{selected?.icon || icon}</span>}
          <input
            type="text"
            value={isOpen ? search : selected?.label || ''}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg font-medium"
          />
          <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {filtered.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  value === opt.value
                    ? 'bg-primary-500/10 border border-primary-500/50'
                    : 'border border-transparent hover:bg-slate-700/50'
                }`}
              >
                {opt.icon && <span className="text-2xl">{opt.icon}</span>}
                <span className="text-white font-semibold">{opt.label}</span>
                {value === opt.value && (
                  <svg className="w-5 h-5 text-primary-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
