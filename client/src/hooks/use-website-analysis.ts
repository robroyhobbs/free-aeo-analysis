import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, AnalysisStep } from "@/types";

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
    
    const totalDuration = 5000; // 5 seconds
    const updateInterval = 50; // Update every 50ms
    
    // Step transition points (in percentage)
    const stepTransitions = {
      crawling: { start: 0, end: 25 },
      analyzing: { start: 25, end: 55 }, // AI analysis takes longer
      calculating: { start: 55, end: 75 },
      generating: { start: 75, end: 100 }
    };
    
    // Different progression rates for each step (to simulate realistic processing)
    const getProgressionRate = (progress: number) => {
      if (progress < stepTransitions.crawling.end) {
        return 1.2; // Crawling starts fast
      } else if (progress < stepTransitions.analyzing.end) {
        return 0.7; // AI analysis is slower
      } else if (progress < stepTransitions.calculating.end) {
        return 0.9; // Calculation is medium speed
      } else {
        return 1.0; // Generation is normal speed
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
      
      // Stop at 99% and let the actual API response complete the process
      if (currentProgress >= 99) {
        clearInterval(timer);
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
      const timer = simulateProgress();
      return { timer };
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
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
      if (context?.timer) {
        clearInterval(context.timer);
      }
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
