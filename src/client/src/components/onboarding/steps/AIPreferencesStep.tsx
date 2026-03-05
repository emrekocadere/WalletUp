import type { AIPreferences } from '@/types/model.types';

interface AIPreferencesStepProps {
  aiPreferences: AIPreferences;
  onAIPreferencesChange: (preferences: Partial<AIPreferences>) => void;
}

export const AIPreferencesStep = ({ aiPreferences, onAIPreferencesChange }: AIPreferencesStepProps) => {
  const handleInputChange = (key: keyof AIPreferences, value: any) => {
    onAIPreferencesChange({ [key]: value });
  };

  return (
    <div className="flex-1">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Customize Your AI Assistant</h2>
        <p className="text-gray-400">Help us personalize your AI experience for better recommendations</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <label className="text-white font-semibold text-sm mb-3 block">What's your occupation?</label>
          <input
            type="text"
            placeholder="e.g., Engineer, Teacher, Entrepreneur..."
            value={aiPreferences.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-primary-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <label className="text-white font-semibold text-sm mb-3 block">What's your monthly income?</label>
          <input
            type="number"
            placeholder="Enter your monthly income (optional)"
            value={aiPreferences.incomeRange || ''}
            onChange={(e) => handleInputChange('incomeRange', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-primary-400/50 focus:outline-none transition-colors"
            min="0"
          />
        </div>

       

      </div>
    </div>
  );
};
