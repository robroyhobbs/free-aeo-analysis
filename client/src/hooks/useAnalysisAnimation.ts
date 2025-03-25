import { useState, useRef, useCallback, useEffect } from 'react';
import { AnalysisStep } from '@/types';
import { ANIMATION_DURATION, ANIMATION_STEPS } from '@/lib/analysis-constants';

interface AnimationState {
  progress: number;
  currentStep: AnalysisStep;
  currentSubStep: number;
  currentSubStepText: string;
}

export function useAnalysisAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    progress: 0,
    currentStep: AnalysisStep.Idle,
    currentSubStep: 0,
    currentSubStepText: '',
  });

  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const mustRunUntilRef = useRef<number>();

  const calculateSubStep = useCallback((currentStepIndex: number, progressPercent: number) => {
    const stepConfig = ANIMATION_STEPS[currentStepIndex];
    const prevStepsPercent = currentStepIndex > 0 ? ANIMATION_STEPS[currentStepIndex - 1].endPercent : 0;
    const stepTotalPercent = stepConfig.endPercent - prevStepsPercent;
    const progressInCurrentStep = progressPercent - prevStepsPercent;
    const percentCompletionInStep = (progressInCurrentStep / stepTotalPercent) * 100;

    let accumulatedPercent = 0;
    for (let i = 0; i < stepConfig.subSteps.length; i++) {
      accumulatedPercent += stepConfig.subSteps[i].percentOfStep;
      if (percentCompletionInStep <= accumulatedPercent) {
        return {
          index: i,
          text: stepConfig.subSteps[i].label
        };
      }
    }

    return {
      index: stepConfig.subSteps.length - 1,
      text: stepConfig.subSteps[stepConfig.subSteps.length - 1].label
    };
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      mustRunUntilRef.current = timestamp + ANIMATION_DURATION;
    }

    const elapsed = timestamp - startTimeRef.current;
    const newProgress = Math.min(100, Math.floor((elapsed / ANIMATION_DURATION) * 100));

    let newStep = AnalysisStep.Idle;
    let newSubStep = 0;
    let newSubStepText = '';

    // Update current step and sub-step based on progress
    for (let i = 0; i < ANIMATION_STEPS.length; i++) {
      if (newProgress <= ANIMATION_STEPS[i].endPercent) {
        newStep = ANIMATION_STEPS[i].step;
        const { index, text } = calculateSubStep(i, newProgress);
        newSubStep = index;
        newSubStepText = text;
        break;
      }
    }

    setAnimationState({
      progress: newProgress,
      currentStep: newStep,
      currentSubStep: newSubStep,
      currentSubStepText: newSubStepText,
    });

    // Continue animation if not complete or if minimum duration hasn't elapsed
    if (newProgress < 100 || timestamp < mustRunUntilRef.current!) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, [calculateSubStep]);

  const startAnimation = useCallback(() => {
    // Reset animation state
    setAnimationState({
      progress: 0,
      currentStep: AnalysisStep.Crawling,
      currentSubStep: 0,
      currentSubStepText: ANIMATION_STEPS[0].subSteps[0].label,
    });

    // Clear any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset refs
    startTimeRef.current = undefined;
    mustRunUntilRef.current = undefined;

    // Start new animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    ...animationState,
    startAnimation,
  };
} 