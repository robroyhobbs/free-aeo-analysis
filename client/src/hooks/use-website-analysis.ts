import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, AnalysisStep } from "@/types";

// Declare global window property for storing analysis results
declare global {
  interface Window {
    __pendingAnalysisResults: AnalysisResult | null;
  }
}

// Initialize the global property if it doesn't exist
if (typeof window !== 'undefined' && window.__pendingAnalysisResults === undefined) {
  window.__pendingAnalysisResults = null;
}

interface UseWebsiteAnalysisOptions {
  onError?: (error: Error) => void;
}

export function useWebsiteAnalysis(options?: UseWebsiteAnalysisOptions) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Create a simulated progress timer with variable progression rates
  const simulateProgress = useCallback(() => {
    setProgress(0);
    setCurrentStep(AnalysisStep.Crawling);
    
    const totalDuration = 12000; // 12 seconds (extended from 5s)
    const updateInterval = 60; // Update every 60ms
    
    // Step transition points (in percentage)
    const stepTransitions = {
      crawling: { start: 0, end: 20 },
      analyzing: { start: 20, end: 50 }, // AI analysis takes longer
      calculating: { start: 50, end: 75 },
      generating: { start: 75, end: 100 }
    };
    
    // Different progression rates for each step (to simulate realistic processing)
    const getProgressionRate = (progress: number) => {
      if (progress < stepTransitions.crawling.end) {
        return 0.9; // Crawling at moderate speed to be more visible
      } else if (progress < stepTransitions.analyzing.end) {
        return 0.5; // AI analysis is much slower (most intensive task)
      } else if (progress < stepTransitions.calculating.end) {
        return 0.7; // Calculation is medium speed
      } else {
        return 0.8; // Generation is slightly faster than calculation
      }
    };
    
    let currentProgress = 0;
    let lastUpdateTime = Date.now();
    
    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastUpdateTime;
      lastUpdateTime = now;
      
      // Calculate progress based on time delta and current progression rate
      const progressionRate = getProgressionRate(currentProgress);
      const increment = (delta / totalDuration) * 100 * progressionRate;
      
      // Add small random variation for natural effect
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      currentProgress += increment * randomFactor;
      
      // Ensure progress doesn't exceed 100%
      const newProgress = Math.min(Math.round(currentProgress), 99); // Cap at 99 for API to complete
      setProgress(newProgress);
      
      // Update current step based on progress thresholds
      if (currentProgress >= stepTransitions.analyzing.start && 
          currentProgress < stepTransitions.analyzing.end) {
        setCurrentStep(AnalysisStep.Analyzing);
      } else if (currentProgress >= stepTransitions.calculating.start && 
                 currentProgress < stepTransitions.calculating.end) {
        setCurrentStep(AnalysisStep.Calculating);
      } else if (currentProgress >= stepTransitions.generating.start) {
        setCurrentStep(AnalysisStep.Generating);
      }
      
      // Complete the process when progress reaches 99%
      if (currentProgress >= 99) {
        clearInterval(timer);
        
        // Force progress to complete at 100%
        setTimeout(() => {
          setProgress(100);
          setCurrentStep(AnalysisStep.Complete);
          
          // Get the stored analysis result and display it
          // If we have api results already, they'll be in shared state within this component
          const pendingResults = window.__pendingAnalysisResults;
          if (pendingResults) {
            setAnalysisResult(pendingResults);
            window.__pendingAnalysisResults = null;
          }
        }, 1000); // Delay completion by 1 second for dramatic effect
      }
    }, updateInterval);
    
    return timer;
  }, []);
  
  const analysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onMutate: () => {
      // Reset any existing stored analysis data
      if (typeof window !== 'undefined') {
        window.__pendingAnalysisResults = null;
      }
      
      const timer = simulateProgress();
      const startTime = Date.now();
      return { timer, startTime };
    },
    onSuccess: (data: AnalysisResult, _, context: any) => {
      // Store the data globally so it can be accessed when animation completes
      window.__pendingAnalysisResults = data;
      
      // Calculate how much time has elapsed
      const elapsedTime = Date.now() - context.startTime;
      const minimumAnimationTime = 12000; // 12 seconds
      
      // If we've completed early, don't cut the animation short
      if (elapsedTime < minimumAnimationTime) {
        // Let the animation continue - we'll show results when it completes
        return;
      }
      
      // If we're already past the minimum time, show results immediately
      setAnalysisResult(data);
      window.__pendingAnalysisResults = null; // Clear the global reference
    },
    onError: (error: Error, _, context: any) => {
      if (context?.timer) {
        clearInterval(context.timer);
      }
      setProgress(0);
      setCurrentStep(AnalysisStep.Idle);
      
      if (options?.onError) {
        options.onError(error);
      }
    },
    onSettled: (_, __, ___, context: any) => {
      // Don't clear the interval here anymore, let it run its full course
      // The animation itself will clear the interval when it reaches 99%
    },
  });
  
  const analyze = (url: string) => {
    setAnalysisResult(null);
    analysisMutation.mutate(url);
  };
  
  const reset = () => {
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
    setAnalysisResult(null);
  };
  
  return {
    analyze,
    reset,
    isAnalyzing: analysisMutation.isPending,
    progress,
    currentStep,
    analysisResult,
  };
}
