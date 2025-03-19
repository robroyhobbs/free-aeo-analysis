import * as React from "react";
import { Search, Bot, Calculator, ClipboardList, CheckCircle2, Zap, Network, Brain, Code, Database } from "lucide-react";

interface LoadingStepProps {
  icon: string;
  title: string;
  step: number;
  isActive: boolean;
  isCompleted: boolean;
}

export function LoadingStep({ icon, title, step, isActive, isCompleted }: LoadingStepProps) {
  // Function to get the appropriate icon component
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <Search className="h-7 w-7" />;
      case "robot":
        return <Bot className="h-7 w-7" />;
      case "calculator":
        return <Calculator className="h-7 w-7" />;
      case "clipboard-list":
        return <ClipboardList className="h-7 w-7" />;
      case "brain":
        return <Brain className="h-7 w-7" />;
      case "network":
        return <Network className="h-7 w-7" />;
      case "code":
        return <Code className="h-7 w-7" />;
      case "database":
        return <Database className="h-7 w-7" />;
      default:
        return <Search className="h-7 w-7" />;
    }
  };
  
  // Neural pathway connector animation
  const renderNeuralPathway = () => {
    if (step < 4) {
      return (
        <div className="hidden sm:block absolute right-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10 overflow-hidden">
          {isCompleted && (
            <div className="absolute left-0 top-0 h-full bg-green-500 w-full transition-all duration-1000">
              {/* Neural pulses traveling along completed pathway */}
              <div className="absolute h-3 w-3 rounded-full bg-white animate-pulse" 
                style={{ left: "20%", top: "-4px", animationDelay: "0.2s" }}></div>
              <div className="absolute h-3 w-3 rounded-full bg-white animate-pulse" 
                style={{ left: "60%", top: "-4px", animationDelay: "0.8s" }}></div>
            </div>
          )}
          {isActive && (
            <div className="absolute left-0 top-0 h-full animate-data-flow w-full" 
                 style={{ backgroundSize: "50% 100%" }}>
              {/* Data particle effect */}
              <div className="absolute h-2 w-2 rounded-full bg-primary/80 animate-pulse" 
                style={{ left: "10%", top: "-2px" }}></div>
              <div className="absolute h-2 w-2 rounded-full bg-primary/80 animate-pulse" 
                style={{ left: "30%", top: "-2px", animationDelay: "0.4s" }}></div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={`rounded-lg p-4 text-center transition-all duration-300 relative ${
      isActive 
        ? "bg-primary/5 border-2 border-primary shadow-md transform scale-105 animate-processing" 
        : isCompleted 
          ? "bg-green-50 border border-green-200" 
          : "bg-slate-50 border border-slate-200"
    }`}>
      {/* Neural network background for active items */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="1" fill="#6366F1" className="animate-neural-pulse" />
            <circle cx="50" cy="20" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.2s" }} />
            <circle cx="80" cy="20" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.4s" }} />
            <circle cx="20" cy="50" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.6s" }} />
            <circle cx="50" cy="50" r="1.2" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "0.8s" }} />
            <circle cx="80" cy="50" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1s" }} />
            <circle cx="20" cy="80" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.2s" }} />
            <circle cx="50" cy="80" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.4s" }} />
            <circle cx="80" cy="80" r="1" fill="#6366F1" className="animate-neural-pulse" style={{ animationDelay: "1.6s" }} />
            
            <line x1="20" y1="20" x2="50" y2="20" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" />
            <line x1="50" y1="20" x2="80" y2="20" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "0.2s" }} />
            <line x1="20" y1="20" x2="20" y2="50" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "0.4s" }} />
            <line x1="80" y1="20" x2="80" y2="50" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "0.6s" }} />
            <line x1="20" y1="50" x2="50" y2="50" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "0.8s" }} />
            <line x1="50" y1="50" x2="80" y2="50" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "1s" }} />
            <line x1="20" y1="50" x2="20" y2="80" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "1.2s" }} />
            <line x1="50" y1="50" x2="50" y2="80" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "1.4s" }} />
            <line x1="80" y1="50" x2="80" y2="80" stroke="#6366F1" strokeWidth="0.3" className="animate-path-trace" style={{ animationDelay: "1.6s" }} />
          </svg>
        </div>
      )}
      
      {/* Progress connector line (visible on desktop) */}
      {renderNeuralPathway()}
      
      {/* Icon Circle with neural network effect */}
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-500 relative ${
          isCompleted 
            ? "bg-green-100 text-green-600 transform scale-110" 
            : isActive 
              ? "bg-primary/10 text-primary shadow-xl animate-neural-pulse scale-125" 
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {/* Animated energy rings for active state */}
        {isActive && (
          <>
            <div className="absolute inset-0 w-full h-full rounded-full border-2 border-primary/30 animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full border border-primary/20 animate-thinking"></div>
            <div className="absolute w-20 h-20 rounded-full border border-primary/40"></div>
            {/* Ripple effect */}
            <div className="absolute w-28 h-28 rounded-full border border-primary/10 animate-neural-pulse opacity-50"></div>
          </>
        )}
      
        {isCompleted ? (
          <div className="relative">
            <CheckCircle2 className="h-8 w-8 text-green-600 animate-bounce" />
            {/* Success energy burst */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Zap className="absolute h-4 w-4 text-green-500/70 animate-pulse" 
                   style={{ transform: "rotate(45deg) translateX(8px)" }} />
              <Zap className="absolute h-4 w-4 text-green-500/70 animate-pulse" 
                   style={{ transform: "rotate(135deg) translateX(8px)", animationDelay: "0.3s" }} />
              <Zap className="absolute h-4 w-4 text-green-500/70 animate-pulse" 
                   style={{ transform: "rotate(225deg) translateX(8px)", animationDelay: "0.6s" }} />
              <Zap className="absolute h-4 w-4 text-green-500/70 animate-pulse" 
                   style={{ transform: "rotate(315deg) translateX(8px)", animationDelay: "0.9s" }} />
            </div>
          </div>
        ) : (
          <div className={`transition-all duration-500 ${isActive ? "animate-thinking scale-110 text-primary" : "text-slate-400"}`}>
            {getIcon()}
            
            {/* Processing dots for active state */}
            {isActive && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.3s" }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.6s" }}></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Title with glow effect for active state */}
      <div className={`font-medium transition-all duration-300 ${
        isActive 
          ? "text-primary transform scale-105 relative" 
          : isCompleted 
            ? "text-green-700" 
            : "text-slate-400"
      }`}>
        {title}
        {isActive && (
          <div className="absolute inset-0 bg-primary blur-xl opacity-10 animate-pulse"></div>
        )}
      </div>
      
      {/* Step indicator with processing animation */}
      <div className={`text-sm mt-1 transition-all duration-300 relative ${
        isActive 
          ? "text-primary/80"
          : isCompleted 
            ? "text-green-600" 
            : "text-slate-400"
      }`}>
        {isCompleted ? (
          "Completed"
        ) : isActive ? (
          <div className="flex items-center justify-center space-x-1">
            <span>Processing</span>
            <span className="inline-flex">
              <span className="animate-pulse" style={{ animationDelay: "0s" }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
            </span>
          </div>
        ) : (
          `Step ${step} of 4`
        )}
      </div>
    </div>
  );
}
