import React from "react";

interface AILoadingAnimationProps {
  step: number;
  subStep: number;
  progress: number;
}

export function AILoadingAnimation({ step, subStep, progress }: AILoadingAnimationProps) {
  return (
    <div className="relative w-full py-6">
      {/* Main container with neural network grid background */}
      <div className="relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden p-6">
        {/* Neural network background grid */}
        <div className="absolute inset-0 bg-slate-50">
          <svg
            className="w-full h-full opacity-10"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="#6366F1" strokeWidth="0.2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#6366F1" strokeWidth="0.2" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#6366F1" strokeWidth="0.2" />
            
            {/* Vertical lines */}
            <line x1="25" y1="0" x2="25" y2="100" stroke="#6366F1" strokeWidth="0.2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#6366F1" strokeWidth="0.2" />
            <line x1="75" y1="0" x2="75" y2="100" stroke="#6366F1" strokeWidth="0.2" />
            
            {/* Neural nodes */}
            <circle cx="25" cy="25" r="1.2" fill="#6366F1" className="animate-neural-pulse" />
            <circle cx="50" cy="25" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.2s" }} />
            <circle cx="75" cy="25" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.4s" }} />
            
            <circle cx="25" cy="50" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.6s" }} />
            <circle cx="50" cy="50" r="1.8" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.8s" }} />
            <circle cx="75" cy="50" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.0s" }} />
            
            <circle cx="25" cy="75" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.2s" }} />
            <circle cx="50" cy="75" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.4s" }} />
            <circle cx="75" cy="75" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.6s" }} />
            
            {/* Connection lines that appear based on progress */}
            {step >= 1 && (
              <>
                <line 
                  x1="25" y1="25" x2="50" y2="25" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                />
                <line 
                  x1="50" y1="25" x2="75" y2="25" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "0.3s" }} 
                />
              </>
            )}
            
            {step >= 2 && (
              <>
                <line 
                  x1="25" y1="25" x2="25" y2="50" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "0.6s" }} 
                />
                <line 
                  x1="75" y1="25" x2="75" y2="50" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "0.9s" }} 
                />
              </>
            )}
            
            {step >= 3 && (
              <>
                <line 
                  x1="25" y1="50" x2="50" y2="50" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "1.2s" }} 
                />
                <line 
                  x1="50" y1="50" x2="75" y2="50" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "1.5s" }} 
                />
              </>
            )}
            
            {step >= 4 && (
              <>
                <line 
                  x1="25" y1="50" x2="25" y2="75" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "1.8s" }} 
                />
                <line 
                  x1="50" y1="50" x2="50" y2="75" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "2.1s" }} 
                />
                <line 
                  x1="75" y1="50" x2="75" y2="75" 
                  stroke="#6366F1" 
                  strokeWidth="0.4"
                  className="animate-path-trace" 
                  style={{ animationDelay: "2.4s" }} 
                />
              </>
            )}
          </svg>
        </div>
        
        {/* Brain visualization at center */}
        <div className="relative flex justify-center items-center py-8">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Brain icon with pulsing animation */}
            <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-70 animate-thinking"></div>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-12 h-12 text-primary"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 8.5C12 6.29086 10.2091 4.5 8 4.5C5.79086 4.5 4 6.29086 4 8.5C4 8.5 4 10.5 6 10.5C6 14 7 15.5 10 17.5V19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 1 ? "animate-path-trace" : "opacity-30"}
              />
              <path
                d="M12 8.5C12 6.29086 13.7909 4.5 16 4.5C18.2091 4.5 20 6.29086 20 8.5C20 8.5 20 10.5 18 10.5C18 14 17 15.5 14 17.5V19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 2 ? "animate-path-trace" : "opacity-30"}
                style={{ animationDelay: "0.4s" }}
              />
              <path
                d="M10 19.5C10 20.6046 10.8954 21.5 12 21.5C13.1046 21.5 14 20.6046 14 19.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={step >= 3 ? "animate-path-trace" : "opacity-30"}
                style={{ animationDelay: "0.8s" }}
              />
              
              {/* Data processing signals */}
              {step >= 1 && (
                <circle 
                  cx="8" 
                  cy="8.5" 
                  r="1.5" 
                  fill="#6366F1" 
                  className="animate-neural-pulse" 
                />
              )}
              
              {step >= 2 && (
                <circle 
                  cx="16" 
                  cy="8.5" 
                  r="1.5" 
                  fill="#6366F1" 
                  className="animate-neural-pulse" 
                  style={{ animationDelay: "0.4s" }}
                />
              )}
              
              {step >= 3 && (
                <circle 
                  cx="12" 
                  cy="19.5" 
                  r="1.5" 
                  fill="#6366F1" 
                  className="animate-neural-pulse" 
                  style={{ animationDelay: "0.8s" }}
                />
              )}
            </svg>
            
            {/* Central pulsing core */}
            <div className="absolute w-4 h-4 bg-primary rounded-full opacity-70 animate-pulse"></div>
          </div>
          
          {/* Data flow streams around brain */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border-4 border-transparent animate-spin-slow opacity-20 border-t-primary border-l-primary"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border-4 border-transparent animate-spin-slow opacity-10 border-r-primary border-b-primary" style={{ animationDirection: "reverse", animationDuration: "7s" }}></div>
          </div>
        </div>
        
        {/* Data flow indicators */}
        <div className="w-3/4 mx-auto mt-4">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full animate-data-flow rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Activity indicators */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((idx) => (
            <div 
              key={idx}
              className={`h-1 rounded-full ${idx <= step ? "bg-primary" : "bg-slate-200"} ${idx === step ? "animate-pulse" : ""}`}
            ></div>
          ))}
        </div>
        
        {/* Processing bar */}
        <div className="mt-6 h-1.5 w-1/2 mx-auto bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-indigo-300 via-primary to-indigo-300 animate-data-flow" style={{ backgroundSize: "200% 100%" }}></div>
        </div>
      </div>
    </div>
  );
}