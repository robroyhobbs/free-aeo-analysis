import React from "react";

export function AnalysisSkeleton() {
  return (
    <div className="animate-processing max-w-3xl mx-auto">
      {/* Neural network background overlay for AI effect */}
      <div className="relative">
        {/* Skeleton for header */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4 relative overflow-hidden">
          {/* Neural pattern background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,20 Q50,5 90,20" stroke="#6366F1" strokeWidth="0.3" fill="none" className="animate-path-trace" />
              <path d="M10,50 Q50,35 90,50" stroke="#6366F1" strokeWidth="0.3" fill="none" className="animate-path-trace" style={{ animationDelay: "0.5s" }} />
              <path d="M10,80 Q50,65 90,80" stroke="#6366F1" strokeWidth="0.3" fill="none" className="animate-path-trace" style={{ animationDelay: "1s" }} />
            </svg>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Score circle skeleton with pulsing animation */}
            <div className="relative w-28 h-28">
              <div className="w-28 h-28 bg-slate-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-primary/20 border-l-primary/20 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-2 border-2 border-transparent border-r-primary/10 border-b-primary/10 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }}></div>
            </div>
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-slate-100 rounded w-3/4 animate-data-flow"></div>
              <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              
              {/* Stats grid skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-200 relative overflow-hidden">
                    {/* Neural nodes in background */}
                    {i === 2 && (
                      <div className="absolute top-1/2 right-3 w-2 h-2 rounded-full bg-primary/10 animate-neural-pulse"></div>
                    )}
                    <div className="h-3 bg-slate-100 rounded w-1/2 mb-2 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    <div className="h-5 bg-slate-100 rounded w-1/3 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Skeleton for recommendations */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4 relative overflow-hidden">
          {/* Animated gradient line */}
          <div className="absolute top-0 left-0 right-0 h-1 animate-data-flow bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="h-5 bg-slate-100 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200 relative">
                {/* Neural processing indicator */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0s" }}></div>
                  <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                  <div className="w-1 h-1 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-slate-200 rounded-full animate-neural-pulse"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                </div>
                <div className="h-4 bg-slate-100 rounded w-full mb-2 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Skeleton for breakdown table - condensed to save space */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="h-5 bg-slate-100 rounded w-1/4 mb-4 animate-pulse"></div>
          
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 p-3 border-b border-slate-200">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-3 bg-slate-100 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
            
            <div className="p-1">
              {[1, 2, 3].map((row) => (
                <div key={row} className="border-b border-slate-100 p-3">
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((col) => (
                      <div 
                        key={col} 
                        className="h-3 bg-slate-100 rounded animate-pulse" 
                        style={{ 
                          animationDelay: `${(row + col) * 0.1}s`,
                          width: col === 4 ? '80%' : '100%'
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}