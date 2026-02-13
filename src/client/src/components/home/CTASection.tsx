import { Link } from 'react-router-dom';

export const CTASection = () => {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="relative bg-primary-500/8 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-primary-400/20 text-center">
        
        <div className="relative z-10">

          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Start Your Financial
            <br />
            <span className="text-primary-400">
              Journey Today
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join WalletUp and experience AI-powered money management
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="group relative px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          
          </div>
        </div>
      </div>
    </div>
  );
};
