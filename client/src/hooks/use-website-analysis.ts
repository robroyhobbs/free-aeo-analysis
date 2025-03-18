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
  
  // Create a simulated progress timer
  const simulateProgress = useCallback(() => {
    setProgress(0);
    setCurrentStep(AnalysisStep.Crawling);
    
    const totalDuration = 5000; // 5 seconds
    const stepDuration = totalDuration / 4; // 4 steps
    const updateInterval = 50; // Update every 50ms
    const totalUpdates = totalDuration / updateInterval;
    const progressIncrement = 100 / totalUpdates;
    
    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += progressIncrement;
      setProgress(Math.min(Math.round(currentProgress), 100));
      
      // Update current step based on progress
      if (currentProgress >= 25 && currentProgress < 50) {
        setCurrentStep(AnalysisStep.Analyzing);
      } else if (currentProgress >= 50 && currentProgress < 75) {
        setCurrentStep(AnalysisStep.Calculating);
      } else if (currentProgress >= 75) {
        setCurrentStep(AnalysisStep.Generating);
      }
      
      if (currentProgress >= 100) {
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
