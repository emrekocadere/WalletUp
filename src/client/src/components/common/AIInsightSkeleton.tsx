export const AIInsightSkeleton = () => {
  return (
    <div className="space-y-3">
      {/* Main insight skeleton */}
      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-slate-800/30 backdrop-blur-sm">
        <div className="relative p-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Icon skeleton */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700/50 animate-pulse" />
            
            <div className="flex-1 space-y-2">
              {/* Badge and title skeleton */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-5 w-20 bg-primary-500/20 rounded-full animate-pulse" />
              </div>
              
              {/* Content lines skeleton */}
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-700/50 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-slate-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Show more button skeleton */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-3 w-20 bg-primary-500/20 rounded animate-pulse" />
            <div className="h-3 w-3 bg-primary-500/20 rounded animate-pulse" />
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Show more link skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-24 bg-primary-500/20 rounded animate-pulse" />
        <div className="h-3 w-3 bg-primary-500/20 rounded animate-pulse" />
      </div>
    </div>
  );
};
