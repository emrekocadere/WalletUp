import { useState, useEffect } from 'react';

interface PreferencesSectionProps {
  value: {
    currencyId: string;
    countryId: string;
    occupation?: string;
    monthlyIncome?: number;
  };
  onChange: (preferences: {
    currencyId: string;
    countryId: string;
    occupation?: string;
    monthlyIncome?: number;
  }) => void;
}

export const PreferencesSection = ({ value, onChange }: PreferencesSectionProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (field: string, fieldValue: string | number | undefined) => {
    const updated = { ...localValue, [field]: fieldValue };
    setLocalValue(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 ">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
          <p className="text-sm text-gray-400">Optional details</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Occupation <span className="text-gray-500">(Optional)</span></label>
          <input
            type="text"
            value={localValue.occupation || ''}
            onChange={(e) => handleChange('occupation', e.target.value || undefined)}
            placeholder="e.g. Software Engineer"
            className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary-500/50 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Monthly Income <span className="text-gray-500">(Optional)</span></label>
          <input
            type="number"
            value={localValue.monthlyIncome || ''}
            onChange={(e) => handleChange('monthlyIncome', e.target.value ? parseFloat(e.target.value) : undefined)}
            placeholder="Enter your monthly income"
            className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary-500/50 focus:outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
