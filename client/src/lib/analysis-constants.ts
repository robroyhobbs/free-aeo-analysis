import { AnalysisStep } from "@/types";

export const ANIMATION_DURATION = 8000;

export const ANIMATION_STEPS = [
  { 
    step: AnalysisStep.Crawling, 
    endPercent: 25,
    subSteps: [
      { label: "Initializing crawler", percentOfStep: 10 },
      { label: "Fetching HTML content", percentOfStep: 30 },
      { label: "Extracting metadata", percentOfStep: 20 },
      { label: "Parsing structured data", percentOfStep: 20 },
      { label: "Analyzing page structure", percentOfStep: 20 }
    ]
  },
  { 
    step: AnalysisStep.Analyzing, 
    endPercent: 55,
    subSteps: [
      { label: "Processing text content", percentOfStep: 15 },
      { label: "Analyzing question format", percentOfStep: 25 },
      { label: "Evaluating content clarity", percentOfStep: 20 },
      { label: "Measuring content depth", percentOfStep: 20 },
      { label: "Checking information accuracy", percentOfStep: 20 }
    ]
  },
  { 
    step: AnalysisStep.Calculating, 
    endPercent: 80,
    subSteps: [
      { label: "Computing base score", percentOfStep: 20 },
      { label: "Applying semantic weight", percentOfStep: 20 },
      { label: "Evaluating formatting impact", percentOfStep: 20 },
      { label: "Analyzing linked references", percentOfStep: 20 },
      { label: "Finalizing category scores", percentOfStep: 20 }
    ]
  },
  { 
    step: AnalysisStep.Generating, 
    endPercent: 100,
    subSteps: [
      { label: "Identifying strengths", percentOfStep: 20 },
      { label: "Finding improvement areas", percentOfStep: 20 },
      { label: "Generating recommendations", percentOfStep: 20 },
      { label: "Creating summary report", percentOfStep: 20 },
      { label: "Finalizing analysis results", percentOfStep: 20 }
    ]
  }
]; 