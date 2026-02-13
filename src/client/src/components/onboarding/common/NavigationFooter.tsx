interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isLoading?: boolean;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
}

export const NavigationFooter = ({
  currentStep,
  totalSteps,
  canProceed,
  isLoading = false,
  onBack,
  onNext,
  onComplete,
}: NavigationFooterProps) => {
  return (
    <div className="border-t border-slate-700 p-6 flex justify-between items-center bg-slate-800/30">
      <button
        onClick={onBack}
        disabled={currentStep === 0 || isLoading}
        className={`px-4 py-2 font-semibold rounded-lg transition-all ${
          currentStep === 0 ? 'invisible' : 'text-gray-400 hover:text-white hover:bg-slate-700 disabled:opacity-50'
        }`}
      >
        ← Back
      </button>

      {currentStep < totalSteps ? (
        <button
          onClick={onNext}
          disabled={isLoading}
          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {currentStep === 0 ? "Get Started" : 'Continue'} →
        </button>
      ) : (
        <button
          onClick={onComplete}
          disabled={!canProceed || isLoading}
          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>Complete ✓</>
          )}
        </button>
      )}
    </div>
  );
};
