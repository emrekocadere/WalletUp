import { Link } from 'react-router-dom';

export const Hero = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500/5 border border-primary-400/30 rounded-full mb-6">
            <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-sm font-bold text-primary-300 tracking-wide">AI-Powered Financial Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]">
            <span className="block text-white">
              Smart Money
            </span>
            <span className="block text-primary-400 mt-2">
              Management
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
            Track expenses effortlessly with <span className="text-primary-400 font-semibold">AI-powered insights</span>, get intelligent recommendations, and make <span className="text-indigo-400 font-semibold">better financial decisions</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border-2 border-white/20 hover:border-white/40 transition-all backdrop-blur-sm transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>


        </div>

        <div className="relative lg:block hidden">
          <div className="relative bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/20 shadow-2xl">
            <img 
              src="/Paragraf metniniz.png" 
              alt="WalletUp Dashboard" 
              className="rounded-2xl w-full h-auto shadow-2xl border border-white/10"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
