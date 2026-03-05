interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  return (
    <div className="mb-6 flex items-center gap-1.5 justify-center">
      {[...Array(totalSteps + 1)].map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i <= currentStep ? 'bg-primary-500 w-8' : 'bg-slate-700 w-4'
          }`}
        />
      ))}
    </div>
  );
};
