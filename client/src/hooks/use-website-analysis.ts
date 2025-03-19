import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, AnalysisStep } from "@/types";

// Constants
const ANIMATION_DURATION = 8000; // 8 seconds
const UPDATE_INTERVAL = 80; // 80ms for smooth animation
const STEP_THRESHOLDS = {
  CRAWLING: 25,   // 0-25%
  ANALYZING: 55,  // 25-55% 
  CALCULATING: 80 // 55-80%
  // Beyond 80% is GENERATING
  // 100% is COMPLETE
};

interface UseWebsiteAnalysisOptions {
  onError?: (error: Error) => void;
}

export function useWebsiteAnalysis(options?: UseWebsiteAnalysisOptions) {
  // Core state
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [savedResult, setSavedResult] = useState<AnalysisResult | null>(null);
  
  // Use ref for timer to avoid unnecessary re-renders
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Helper to update step based on progress
  const determineStep = useCallback((progressValue: number): AnalysisStep => {
    if (progressValue >= 100) return AnalysisStep.Complete;
    if (progressValue >= STEP_THRESHOLDS.CALCULATING) return AnalysisStep.Generating;
    if (progressValue >= STEP_THRESHOLDS.ANALYZING) return AnalysisStep.Calculating;
    if (progressValue >= STEP_THRESHOLDS.CRAWLING) return AnalysisStep.Analyzing;
    return AnalysisStep.Crawling;
  }, []);
  
  // Memoized clean up timer function
  const clearAnimationTimer = useCallback(() => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
  }, []);
  
  // Handle synchronization of animation completion and results
  useEffect(() => {
    if (progress >= 100 && savedResult) {
      setAnalysisResult(savedResult);
      setIsShowingResults(true);
      setSavedResult(null);
    }
  }, [progress, savedResult]);
  
  // Start animation timer - memoized to avoid recreating this function
  const startAnimationTimer = useCallback(() => {
    // Clear any existing timer first
    clearAnimationTimer();
    
    // Start new animation timer
    const startTime = Date.now();
    animationTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, Math.round((elapsed / ANIMATION_DURATION) * 100));
      
      // Update progress
      setProgress(newProgress);
      
      // Update step based on progress percentage
      setCurrentStep(determineStep(newProgress));
      
      // If animation completes
      if (newProgress >= 100) {
        clearAnimationTimer();
        setCurrentStep(AnalysisStep.Complete);
      }
    }, UPDATE_INTERVAL);
  }, [clearAnimationTimer, determineStep]);
  
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
      
      // Start animation timer
      startAnimationTimer();
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
      clearAnimationTimer();
      
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
    return clearAnimationTimer;
  }, [clearAnimationTimer]);
  
  // Public API methods - memoized to avoid recreation on each render
  const analyze = useCallback((url: string) => {
    analysisMutation.mutate(url);
  }, [analysisMutation]);
  
  const reset = useCallback(() => {
    // Clear any running timer
    clearAnimationTimer();
    
    // Reset state
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
    setAnalysisResult(null);
    setIsShowingResults(false);
    setSavedResult(null);
  }, [clearAnimationTimer]);
  
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
