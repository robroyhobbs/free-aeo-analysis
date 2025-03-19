import React from "react";

export function AnalysisSkeleton() {
  return (
    <div className="animate-processing">
      {/* Skeleton for header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Score circle skeleton */}
          <div className="w-32 h-32 bg-slate-100 rounded-full animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-slate-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="h-3 bg-slate-100 rounded w-1/2 mb-2 animate-pulse"></div>
                  <div className="h-6 bg-slate-100 rounded w-1/3 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Skeleton for recommendations */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-4">
        <div className="h-5 bg-slate-100 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded w-1/3 animate-pulse"></div>
              </div>
              <div className="h-4 bg-slate-100 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Skeleton for breakdown table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="h-5 bg-slate-100 rounded w-1/4 mb-4 animate-pulse"></div>
        
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm mb-6">
          <div className="bg-slate-50 p-3 border-b border-slate-200">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-3 bg-slate-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          
          <div className="p-1">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="border-b border-slate-100 p-3">
                <div className="grid grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((col) => (
                    <div key={col} className="h-3 bg-slate-100 rounded animate-pulse" style={{ animationDelay: `${(row + col) * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}