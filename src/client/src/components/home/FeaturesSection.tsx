export const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Built for how you{' '}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">actually</span>{' '}live
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every feature designed to make financial clarity effortless
          </p>
        </div>

        {/* Uniform grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">AI-Powered Insights</h3>
            <p className="text-gray-300">Get personalized financial advice based on your spending patterns and habits</p>
          </div>

          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">Smart Analytics</h3>
            <p className="text-gray-300">Visual spending reports and trend analysis to understand where your money goes</p>
          </div>

          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">Goal Tracking</h3>
            <p className="text-gray-300">Set savings targets and watch your progress in real time</p>
          </div>

          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">Secure & Private</h3>
            <p className="text-gray-300">End-to-end encrypted. Your data never leaves your control</p>
          </div>

          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">Multi-Currency</h3>
            <p className="text-gray-300">Track accounts in any currency with live exchange rates</p>
          </div>

          {/* Feature card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:bg-white/8 hover:border-white/20 transition-all">
            <h3 className="text-lg font-bold text-white mb-3">Real-Time Updates</h3>
            <p className="text-gray-300">Instant sync across all your accounts and transactions</p>
          </div>
        </div>
      </div>
    </section>
  );
};
