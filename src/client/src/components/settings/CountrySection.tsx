import type { Country } from '@/types/model.types';

interface CountrySectionProps {
  value: string;
  onChange: (country: string) => void;
  countries: Country[];
}

export const CountrySection = ({ value, onChange, countries }: CountrySectionProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20H7m6-4h.01M15 16h.01" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Country</h2>
          <p className="text-sm text-gray-400">Regional settings</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-primary-500/50 focus:outline-none transition-colors"
      >
        <option value="">Select country</option>
        {countries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};
