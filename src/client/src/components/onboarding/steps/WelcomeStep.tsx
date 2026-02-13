export const WelcomeStep = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500/20 rounded-2xl mb-6 border border-primary-500/30">
        <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Welcome!</h2>
      <p className="text-gray-400 text-lg mb-8 max-w-md">
        Let's set up your account in a few simple steps.
      </p>
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 text-xs border border-primary-500/30">✓</div>
          <span>Choose your currency</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs border border-purple-500/30">✓</div>
          <span>Set your preferences</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs border border-indigo-500/30">✓</div>
          <span>Start managing finances</span>
        </div>
      </div>
    </div>
  );
};
