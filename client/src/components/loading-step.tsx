import * as React from "react";
import { Search, Bot, Calculator, ClipboardList, CheckCircle2 } from "lucide-react";

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
        return <Search className="h-6 w-6" />;
      case "robot":
        return <Bot className="h-6 w-6" />;
      case "calculator":
        return <Calculator className="h-6 w-6" />;
      case "clipboard-list":
        return <ClipboardList className="h-6 w-6" />;
      default:
        return <Search className="h-6 w-6" />;
    }
  };
  
  return (
    <div className={`rounded-lg p-4 text-center transition-all duration-300 ${
      isActive 
        ? "bg-primary/5 border-2 border-primary shadow-md transform scale-105" 
        : isCompleted 
          ? "bg-green-50 border border-green-200" 
          : "bg-slate-50 border border-slate-200"
    }`}>
      {/* Progress connector line (visible on desktop) */}
      {step < 4 && (
        <div className="hidden sm:block absolute right-0 top-1/2 w-full h-0.5 bg-slate-200 -z-10">
          {isCompleted && <div className="absolute left-0 top-0 h-full bg-green-500 w-full transition-all duration-1000"></div>}
          {isActive && <div className="absolute left-0 top-0 h-full bg-primary w-1/2 transition-all duration-1000"></div>}
        </div>
      )}
      
      {/* Icon Circle */}
      <div 
        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-500 ${
          isCompleted 
            ? "bg-green-100 text-green-600 transform rotate-0" 
            : isActive 
              ? "bg-primary/10 text-primary shadow-lg animate-pulse" 
              : "bg-slate-100 text-slate-400"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-7 w-7 text-green-600 animate-bounce" />
        ) : (
          <div className={isActive ? "animate-spin-slow" : ""}>
            {getIcon()}
          </div>
        )}
      </div>
      
      {/* Title */}
      <div className={`font-medium transition-all duration-300 ${
        isActive 
          ? "text-primary transform scale-105" 
          : isCompleted 
            ? "text-green-700" 
            : "text-slate-400"
      }`}>
        {title}
      </div>
      
      {/* Step indicator */}
      <div className={`text-sm mt-1 transition-all duration-300 ${
        isActive 
          ? "text-primary/80"
          : isCompleted 
            ? "text-green-600" 
            : "text-slate-400"
      }`}>
        {isCompleted ? "Completed" : isActive ? "In progress..." : `Step ${step} of 4`}
      </div>
    </div>
  );
}
