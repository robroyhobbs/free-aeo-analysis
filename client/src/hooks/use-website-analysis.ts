import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AnalysisResult, AnalysisStep } from "@/types";

interface UseWebsiteAnalysisOptions {
  onError?: (error: Error) => void;
}

// Animation constants
const ANIMATION_DURATION_MS = 8000; // 8 seconds animation
const ANIMATION_STEPS = [
  { step: AnalysisStep.Crawling, endPercent: 25 },
  { step: AnalysisStep.Analyzing, endPercent: 55 },
  { step: AnalysisStep.Calculating, endPercent: 80 },
  { step: AnalysisStep.Generating, endPercent: 100 }
];

export function useWebsiteAnalysis(options?: UseWebsiteAnalysisOptions) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // References to track animation and analysis state
  const animationRef = useRef<{
    startTime: number;
    timer: NodeJS.Timeout | null;
    isComplete: boolean;
    resultData: AnalysisResult | null;
  }>({
    startTime: 0,
    timer: null,
    isComplete: false,
    resultData: null
  });

  // Create a state to trigger effect when animation or result state changes
  const [triggerCheck, setTriggerCheck] = useState(0);
  
  // Function to check and update state when both animation is complete and results are ready
  const checkCompletionState = () => {
    if (animationRef.current.isComplete && animationRef.current.resultData) {
      setAnalysisResult(animationRef.current.resultData);
      setCurrentStep(AnalysisStep.Complete);
      
      // Reset the animation state
      animationRef.current.resultData = null;
      animationRef.current.isComplete = false;
    }
  };
  
  // This effect handles the completion of both the animation and analysis
  useEffect(() => {
    checkCompletionState();
  }, [triggerCheck]);

  // Start the animation sequence - guaranteed to run for exactly 8 seconds
  const startAnimation = () => {
    // Clear any existing animation
    if (animationRef.current.timer) {
      clearInterval(animationRef.current.timer);
    }
    
    // Reset progress and animation state
    setProgress(0);
    setCurrentStep(AnalysisStep.Crawling);
    animationRef.current.isComplete = false;
    animationRef.current.startTime = Date.now();
    
    // Frame rate for smooth animation (approximately 60fps)
    const frameInterval = 16; // ~60fps
    
    // Start the animation timer
    animationRef.current.timer = setInterval(() => {
      const elapsedTime = Date.now() - animationRef.current.startTime;
      
      // Calculate progress as a percentage of the total animation time
      const progressPercent = Math.min(100, Math.floor((elapsedTime / ANIMATION_DURATION_MS) * 100));
      setProgress(progressPercent);
      
      // Determine the current step based on progress
      for (let i = 0; i < ANIMATION_STEPS.length; i++) {
        if (progressPercent <= ANIMATION_STEPS[i].endPercent) {
          setCurrentStep(ANIMATION_STEPS[i].step);
          break;
        }
      }
      
      // If we've reached 100%, complete the animation
      if (progressPercent >= 100) {
        if (animationRef.current.timer) {
          clearInterval(animationRef.current.timer);
          animationRef.current.timer = null;
        }
        animationRef.current.isComplete = true;
        setTriggerCheck(prev => prev + 1);
        // The completion check happens in the effect via triggerCheck
      }
    }, frameInterval);
  };
  
  const analysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      return response.json();
    },
    onMutate: () => {
      // Reset state and start the animation
      animationRef.current.resultData = null;
      startAnimation();
    },
    onSuccess: (data: AnalysisResult) => {
      // Store the result in our ref
      animationRef.current.resultData = data;
      setTriggerCheck(prev => prev + 1);
      // The completion check will happen in the effect
    },
    onError: (error: Error) => {
      // Stop the animation
      if (animationRef.current.timer) {
        clearInterval(animationRef.current.timer);
        animationRef.current.timer = null;
      }
      
      // Reset state
      setProgress(0);
      setCurrentStep(AnalysisStep.Idle);
      
      // Call error handler if provided
      if (options?.onError) {
        options.onError(error);
      }
    }
  });
  
  const analyze = (url: string) => {
    setAnalysisResult(null);
    analysisMutation.mutate(url);
  };
  
  const reset = () => {
    // Clear any running animation
    if (animationRef.current.timer) {
      clearInterval(animationRef.current.timer);
      animationRef.current.timer = null;
    }
    
    // Reset state
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
    setAnalysisResult(null);
    animationRef.current.resultData = null;
    animationRef.current.isComplete = false;
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current.timer) {
        clearInterval(animationRef.current.timer);
      }
    };
  }, []);
  
  return {
    analyze,
    reset,
    isAnalyzing: analysisMutation.isPending,
    progress,
    currentStep,
    analysisResult,
    isCompleted: currentStep === AnalysisStep.Complete,
  };
}
