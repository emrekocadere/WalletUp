export const GoalTrackingSection = () => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="bg-pink-500/5 backdrop-blur-xl p-12 rounded-3xl border border-pink-500/20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Icon & Visual */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-pink-500/5 rounded-3xl flex items-center justify-center border border-pink-500/30">
              <svg className="w-16 h-16 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full mb-4">
              <span className="text-xs font-semibold text-pink-300">🎯 GOAL TRACKING</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Achieve Your Financial Dreams
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Set meaningful financial goals and track your progress effortlessly. Whether you're saving for a new car, your dream house, a vacation, or any other milestone, WalletUp helps you stay motivated and on track with visual progress tracking and smart savings recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Custom Goals</h4>
                  <p className="text-sm text-gray-400">Create goals for car, house, vacation, or anything</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Visual Progress</h4>
                  <p className="text-sm text-gray-400">See how close you are to achieving your goals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Deadline Tracking</h4>
                  <p className="text-sm text-gray-400">Set target dates and get reminders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Smart Suggestions</h4>
                  <p className="text-sm text-gray-400">Get tips on how to reach your goals faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
