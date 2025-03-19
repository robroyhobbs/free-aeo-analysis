import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, AnalysisStep } from "@/types";

interface UseWebsiteAnalysisOptions {
  onError?: (error: Error) => void;
}

export function useWebsiteAnalysis(options?: UseWebsiteAnalysisOptions) {
  // Core state
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null);
  const [savedResult, setSavedResult] = useState<AnalysisResult | null>(null);

  // Animation duration in ms (8 seconds)
  const ANIMATION_DURATION = 8000;
  
  // Handle synchronization of animation completion and results
  useEffect(() => {
    if (progress >= 100 && savedResult) {
      setAnalysisResult(savedResult);
      setIsShowingResults(true);
      setSavedResult(null);
    }
  }, [progress, savedResult]);
  
  // API mutation
  const analysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onMutate: () => {
      // Reset state and start animation
      setProgress(0);
      setCurrentStep(AnalysisStep.Crawling);
      setIsShowingResults(false);
      setAnalysisResult(null);
      setSavedResult(null);
      
      // Clear any existing timer
      if (animationTimer) {
        clearInterval(animationTimer);
      }
      
      // Start new animation timer
      const startTime = Date.now();
      const newTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, Math.round((elapsed / ANIMATION_DURATION) * 100));
        
        // Update progress
        setProgress(newProgress);
        
        // Update step based on progress percentage
        if (newProgress < 25) {
          setCurrentStep(AnalysisStep.Crawling);
        } else if (newProgress < 55) {
          setCurrentStep(AnalysisStep.Analyzing);
        } else if (newProgress < 80) {
          setCurrentStep(AnalysisStep.Calculating);
        } else {
          setCurrentStep(AnalysisStep.Generating);
        }
        
        // If animation completes
        if (newProgress >= 100) {
          clearInterval(newTimer);
          setAnimationTimer(null);
          setCurrentStep(AnalysisStep.Complete);
        }
      }, 80); // Update approximately every 80ms for smooth animation
      
      // Save timer reference
      setAnimationTimer(newTimer);
    },
    onSuccess: (data: AnalysisResult) => {
      // Save result data for when animation completes
      setSavedResult(data);
      
      // If animation already finished, show results right away
      if (progress >= 100) {
        setAnalysisResult(data);
        setIsShowingResults(true);
        setSavedResult(null);
      }
    },
    onError: (error: Error) => {
      // Clear timer on error
      if (animationTimer) {
        clearInterval(animationTimer);
        setAnimationTimer(null);
      }
      
      // Reset progress
      setProgress(0);
      setCurrentStep(AnalysisStep.Idle);
      
      // Call error handler
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimer) {
        clearInterval(animationTimer);
      }
    };
  }, [animationTimer]);
  
  // Public API methods
  const analyze = (url: string) => {
    analysisMutation.mutate(url);
  };
  
  const reset = () => {
    // Clear any running timer
    if (animationTimer) {
      clearInterval(animationTimer);
      setAnimationTimer(null);
    }
    
    // Reset state
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
    setAnalysisResult(null);
    setIsShowingResults(false);
    setSavedResult(null);
  };
  
  return {
    analyze,
    reset,
    isAnalyzing: analysisMutation.isPending && !isShowingResults,
    progress,
    currentStep,
    analysisResult,
    isCompleted: isShowingResults,
  };
}
