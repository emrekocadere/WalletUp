export const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-sm font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Built for how you{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">actually</span>{' '}live
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every feature designed to make financial clarity effortless
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid  md:grid-cols-6 gap-4 auto-rows-auto">

          {/* Large card — AI Insights (spans 4 cols) */}
          <div className="md:col-span-4 bg-gradient-to-br from-violet-900/50 to-indigo-900/30 backdrop-blur-xl rounded-3xl border border-violet-400/15 p-8 hover:border-violet-400/30 transition-all group">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/25 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">AI-Powered Insights</h3>
                <p className="text-gray-400">Get personalized financial advice based on your spending patterns and habits</p>
              </div>
            </div>
            {/* Mini insight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
                <p className="text-xs text-violet-300 font-semibold mb-1">Savings Tip</p>
                <p className="text-sm text-gray-300">Reduce coffee shop visits to save $180/month</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/8">
                <p className="text-xs text-emerald-400 font-semibold mb-1">Goal Update</p>
                <p className="text-sm text-gray-300">At current pace, reach vacation goal in 3 months</p>
              </div>
            </div>
          </div>

          {/* Small card — Security (spans 2 cols) */}
          <div className="md:col-span-2 bg-white/4 backdrop-blur-xl rounded-3xl border border-white/10 p-7 hover:bg-white/6 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-400 leading-relaxed">End-to-end encrypted. Your data never leaves your control.</p>
          </div>

          {/* Small card — Goal Tracking (spans 2 cols) */}
          <div className="md:col-span-2 bg-white/4 backdrop-blur-xl rounded-3xl border border-white/10 p-7 hover:bg-white/6 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Goal Tracking</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Set savings targets and watch your progress in real time.</p>
          </div>

          {/* Medium card — Analytics (spans 4 cols) */}
          <div className="md:col-span-4 bg-white/4 backdrop-blur-xl rounded-3xl border border-white/10 p-7 hover:bg-white/6 hover:border-white/20 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Smart Analytics</h3>
                <p className="text-gray-400 mb-5">Visual spending reports and trend analysis to understand where your money goes</p>
                {/* Mini bar chart */}
                <div className="flex items-end gap-2 h-12">
                  {[40,65,45,80,55,90,70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600 to-violet-500 opacity-70 hover:opacity-100 transition-opacity"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Small card — Multi-currency (spans 2 cols) */}
          <div className="md:col-span-2 bg-white/4 backdrop-blur-xl rounded-3xl border border-white/10 p-7 hover:bg-white/6 hover:border-white/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-Currency</h3>
            <p className="text-sm text-gray-400 leading-relaxed">Track accounts in any currency with live exchange rates.</p>
          </div>

        </div>
      </div>
    </section>
  );
};
