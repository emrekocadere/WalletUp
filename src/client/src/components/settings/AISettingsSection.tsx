interface AISettingsSectionProps {
  aiEnabled: boolean;
  aiAutoAnalyze: boolean;
  aiInsightsFrequency: string;
  onAIEnabledChange: (enabled: boolean) => void;
  onAutoAnalyzeChange: (enabled: boolean) => void;
  onFrequencyChange: (frequency: string) => void;
}

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export const AISettingsSection = ({
  aiEnabled,
  aiAutoAnalyze,
  aiInsightsFrequency,
  onAIEnabledChange,
  onAutoAnalyzeChange,
  onFrequencyChange,
}: AISettingsSectionProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">AI Settings</h2>
          <p className="text-sm text-gray-400">Manage AI suggestions</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* AI Enabled Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">AI Insights</p>
            <p className="text-sm text-gray-400">Enable or disable AI insights</p>
          </div>
          <button
            onClick={() => onAIEnabledChange(!aiEnabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              aiEnabled ? 'bg-primary-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                aiEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Auto Analyze Toggle & Frequency */}
        {aiEnabled && (
          <>
            <div className="h-px bg-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto Analyze</p>
                <p className="text-sm text-gray-400">Automatically analyze your data</p>
              </div>
              <button
                onClick={() => onAutoAnalyzeChange(!aiAutoAnalyze)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  aiAutoAnalyze ? 'bg-green-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    aiAutoAnalyze ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Frequency Select */}
            <div className="h-px bg-white/5" />
            <div>
              <label className="block text-white font-medium mb-2">AI Analysis Frequency</label>
              <select
                value={aiInsightsFrequency}
                onChange={(e) => onFrequencyChange(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-primary-500/50 focus:outline-none transition-colors"
              >
                {frequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
