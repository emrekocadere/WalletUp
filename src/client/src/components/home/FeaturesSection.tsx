import { FeatureCard } from './FeatureCard';

export const FeaturesSection = () => {
  return (
    <div id="features" className="relative z-10 max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-400/30 rounded-full mb-6">
          <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm font-bold text-primary-300">Powerful Features</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Everything You <span className="text-indigo-400">Need</span>
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Powerful features to take control of your finances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
          title="Lightning Fast"
          description="Log expenses in seconds, track spending instantly"
          bgColor="bg-primary-500/20"
          iconColor="text-primary-400"
        />

        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          }
          title="Visual Charts"
          description="Interactive graphs and charts to visualize your finances"
          bgColor="bg-purple-500/20"
          iconColor="text-purple-400"
        />

        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
          title="Secure & Private"
          description="Your data is encrypted and always safe"
          bgColor="bg-indigo-500/20"
          iconColor="text-indigo-400"
        />

        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          }
          title="AI-Powered Insights"
          description="Get intelligent recommendations and financial advice"
          bgColor="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />

        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          title="Goal Tracking"
          description="Set and track financial goals like car, house, vacation"
          bgColor="bg-pink-500/20"
          iconColor="text-pink-400"
        />

        <FeatureCard
          icon={
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          title="Smart Analytics"
          description="Detailed spending reports and trend analysis"
          bgColor="bg-cyan-500/20"
          iconColor="text-cyan-400"
        />
      </div>
    </div>
  );
};
