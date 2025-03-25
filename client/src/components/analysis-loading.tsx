import React from 'react';
import { AnalysisStep } from '@/types';
import { LoadingStep } from '@/components/loading-step';
import { AILoadingAnimation } from '@/components/ai-loading-animation';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';
import { getHostnameFromUrl } from '@/lib/utils';

interface AnalysisLoadingProps {
  url: string;
  progress: number;
  currentStep: AnalysisStep;
  currentSubStep: number;
  currentSubStepText: string;
}

export function AnalysisLoading({
  url,
  progress,
  currentStep,
  currentSubStep,
  currentSubStepText,
}: AnalysisLoadingProps) {
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Analyzing Your Website</h2>
        <p className="text-slate-600">
          Analyzing: {getHostnameFromUrl(url)}
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full gradient-bg rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Loading Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 relative">
            {/* Neural pathway animation */}
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 overflow-hidden">
              <div className="absolute inset-0 animate-data-flow bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                   style={{ 
                     width: `${progress}%`, 
                     backgroundSize: "200% 100%" 
                   }}></div>
            </div>
            
            <LoadingStep
              icon="search"
              title="Crawling Content"
              step={1}
              isActive={currentStep === AnalysisStep.Crawling}
              isCompleted={currentStep > AnalysisStep.Crawling}
            />
            
            <LoadingStep
              icon="brain"
              title="AI Analysis"
              step={2}
              isActive={currentStep === AnalysisStep.Analyzing}
              isCompleted={currentStep > AnalysisStep.Analyzing}
            />
            
            <LoadingStep
              icon="calculator"
              title="Calculating Score"
              step={3}
              isActive={currentStep === AnalysisStep.Calculating}
              isCompleted={currentStep > AnalysisStep.Calculating}
            />
            
            <LoadingStep
              icon="code"
              title="Generating Insights"
              step={4}
              isActive={currentStep === AnalysisStep.Generating}
              isCompleted={currentStep > AnalysisStep.Generating}
            />
          </div>
        </div>
        
        {/* AI Brain Visualization */}
        <div className="mb-6">
          <AILoadingAnimation 
            step={
              currentStep === AnalysisStep.Idle ? 0 :
              currentStep === AnalysisStep.Crawling ? 1 :
              currentStep === AnalysisStep.Analyzing ? 2 :
              currentStep === AnalysisStep.Calculating ? 3 : 4
            }
            subStep={currentSubStep}
            progress={progress}
          />
        </div>
        
        {/* Result Skeleton Preview */}
        {progress > 35 && (
          <div 
            className="mb-6 opacity-0 transition-opacity duration-1000" 
            style={{ opacity: progress > 50 ? (progress > 75 ? 0.8 : 0.5) : 0.3 }}
          >
            <AnalysisSkeleton />
          </div>
        )}
        
        {/* Current Process Information */}
        <div className="text-center bg-slate-50 p-4 rounded-lg border border-slate-200 relative overflow-hidden">
          {/* Background neural pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10,30 Q50,10 90,30 T10,60 T90,90"
                stroke="#6366F1"
                strokeWidth="0.5"
                fill="none"
                className="animate-path-trace"
              />
              <path
                d="M10,10 Q50,50 90,10 T10,50 T90,90"
                stroke="#6366F1"
                strokeWidth="0.5" 
                fill="none"
                className="animate-path-trace"
                style={{ animationDelay: "1s" }}
              />
            </svg>
          </div>
          
          {/* Process title */}
          <div className="text-lg font-medium mb-1 relative">
            <span className="relative inline-block">
              {currentStep === AnalysisStep.Crawling && (
                <>
                  <span className="absolute -inset-1 bg-primary/5 rounded-lg blur-sm"></span>
                  <span className="relative">Crawling website content...</span>
                </>
              )}
              {currentStep === AnalysisStep.Analyzing && (
                <>
                  <span className="absolute -inset-1 bg-primary/5 rounded-lg blur-sm"></span>
                  <span className="relative">Analyzing content with our expert AI system...</span>
                </>
              )}
              {currentStep === AnalysisStep.Calculating && (
                <>
                  <span className="absolute -inset-1 bg-primary/5 rounded-lg blur-sm"></span>
                  <span className="relative">Calculating AEO score...</span>
                </>
              )}
              {currentStep === AnalysisStep.Generating && (
                <>
                  <span className="absolute -inset-1 bg-primary/5 rounded-lg blur-sm"></span>
                  <span className="relative">Generating optimization insights...</span>
                </>
              )}
            </span>
          </div>
          
          {/* Sub-step progress indicators */}
          <div className="flex justify-center items-center gap-1 my-2">
            {[0, 1, 2, 3, 4].map((idx) => (
              <div 
                key={idx}
                className={`h-1.5 w-4 rounded-full transition-all duration-300 ${
                  idx <= currentSubStep 
                    ? "bg-primary" 
                    : "bg-slate-200"
                } ${
                  idx === currentSubStep 
                    ? "animate-pulse w-6" 
                    : ""
                }`}
              ></div>
            ))}
          </div>
          
          {/* Current sub-step text */}
          <p className="text-slate-600 mt-1 min-h-[1.5rem] transition-all duration-300">
            <span className="inline-flex items-center">
              {currentSubStepText}
              <span className="inline-flex ml-1">
                <span className="animate-pulse" style={{ animationDelay: "0s" }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
              </span>
            </span>
          </p>
          
          <div className="mt-3 text-primary text-sm animate-pulse">
            <span className="inline-flex items-center">
              <span className="w-3 h-3 rounded-full bg-primary/30 mr-2 animate-neural-pulse"></span>
              Expected completion in {Math.max(8 - Math.floor(progress / 12.5), 1)} seconds
            </span>
          </div>
          
          {/* Progress percentage */}
          <div className="mt-2 text-xs text-slate-500">
            <span className="bg-primary/5 px-2 py-0.5 rounded-md text-primary font-medium">
              {progress}% complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 