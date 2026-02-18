interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 mb-3">
        {[...Array(totalSteps + 1)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold transition-all border ${
                i < currentStep
                  ? 'bg-primary-500/20 border-primary-500/50 text-primary-400'
                  : i === currentStep
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'bg-slate-800/50 border-slate-700 text-gray-500'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            {i < totalSteps && (
              <div className={`h-0.5 w-12 mx-1 ${i < currentStep ? 'bg-primary-500/50' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Step {currentStep + 1} of {totalSteps + 1}</p>
      </div>
    </div>
  );
};
