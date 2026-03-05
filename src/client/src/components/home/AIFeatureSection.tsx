export const AIFeatureSection = () => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="bg-primary-500/5 backdrop-blur-xl p-12 rounded-3xl border border-primary-500/20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Icon & Visual */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-primary-500/5 rounded-3xl flex items-center justify-center border border-primary-500/30">
              <svg className="w-16 h-16 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4">
              <span className="text-xs font-semibold text-primary-300">✨ AI POWERED</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your Personal Financial Assistant
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              WalletUp uses advanced artificial intelligence to understand your spending habits and provide personalized insights. Get smart recommendations, automatic expense categorization, and predictive analytics to help you make better financial decisions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Smart Categorization</h4>
                  <p className="text-sm text-gray-400">AI automatically categorizes your transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Predictive Analytics</h4>
                  <p className="text-sm text-gray-400">Forecast future spending patterns and trends</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Personalized Tips</h4>
                  <p className="text-sm text-gray-400">Get custom advice based on your habits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Budget Optimization</h4>
                  <p className="text-sm text-gray-400">AI helps you find savings opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
