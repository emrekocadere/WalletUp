import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-16 px-4 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        {/* Floating currency icons */}
        <img
          src="https://www.freeiconspng.com/uploads/euro-icon-24.png"
          alt=""
          aria-hidden="true"
          className="absolute top-20 -left-4 md:left-10 w-52 md:w-72 lg:w-80 opacity-[0.07] blur-sm select-none rotate-[-15deg]"
          draggable={false}
        />
        <img
          src="https://www.freeiconspng.com/uploads/dollar-green-icon-5.png"
          alt=""
          aria-hidden="true"
          className="absolute top-32 -right-4 md:right-10 w-60 md:w-80 lg:w-96 opacity-[0.07] blur-sm select-none rotate-[12deg]"
          draggable={false}
        />
        <img
          src="/yen.png"
          alt=""
          aria-hidden="true"
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 md:w-64 lg:w-72 opacity-[0.06] blur-sm select-none"
          draggable={false}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/25 text-violet-300 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              AI-Powered Financial Intelligence
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">Your Money,</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Smarter.
              </span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Track every expense, hit every goal — powered by AI insights that actually understand your financial habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
              >
                Start for Free
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/15 hover:border-white/30 transition-all backdrop-blur-sm"
              >
                Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bank-level security
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Free forever plan
              </div>
            </div>
          </div>

          {/* Right: Floating dashboard card */}
          <div className="relative hidden lg:flex items-center justify-center">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />

            <div className="relative w-full max-w-md space-y-4">
              {/* Balance card */}
              <div className="bg-white/6 backdrop-blur-2xl rounded-3xl border border-white/12 p-6 shadow-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total Balance</p>
                <p className="text-4xl font-black text-white mb-4">$24,850<span className="text-lg text-gray-500 font-normal">.00</span></p>
                <div className="flex gap-3">
                  <div className="flex-1 bg-emerald-500/10 rounded-2xl p-3 border border-emerald-500/20">
                    <p className="text-xs text-emerald-400 mb-1">Income</p>
                    <p className="text-lg font-bold text-white">+$8,240</p>
                  </div>
                  <div className="flex-1 bg-rose-500/10 rounded-2xl p-3 border border-rose-500/20">
                    <p className="text-xs text-rose-400 mb-1">Expenses</p>
                    <p className="text-lg font-bold text-white">-$3,190</p>
                  </div>
                </div>
              </div>

              {/* Spending bar */}
              <div className="bg-white/6 backdrop-blur-2xl rounded-3xl border border-white/12 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white">Spending Overview</p>
                  <span className="text-xs text-gray-500">This month</span>
                </div>
                <div className="space-y-3">
                  {[{label:'Food',pct:72,color:'bg-violet-500'},{label:'Transport',pct:45,color:'bg-indigo-500'},{label:'Entertainment',pct:30,color:'bg-cyan-500'}].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{item.label}</span>
                        <span>{item.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI insight badge */}
              <div className="bg-gradient-to-r from-violet-600/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl border border-violet-400/20 p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-violet-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-violet-300 mb-0.5">AI Insight</p>
                  <p className="text-xs text-gray-400">You can save $420 more this month by reducing dining out expenses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
