import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LoadingStep } from "@/components/loading-step";
import { ScoreCircle } from "@/components/score-circle";
import { RecommendationCard } from "@/components/recommendation-card";
import { AILoadingAnimation } from "@/components/ai-loading-animation";
import { AnalysisSkeleton } from "@/components/analysis-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getHostnameFromUrl } from "@/lib/utils";
import { 
  ScoreBreakdown, 
  Recommendation, 
  AnalysisStep, 
  AnalysisScoreSummary,
  AnalysisResult
} from "@/types";

// Animation constants
const ANIMATION_DURATION = 8000; // 8 seconds

// Animation step configurations with sub-steps for detailed progress tracking
const ANIMATION_STEPS = [
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

export function AnalysisTool() {
  // Form state
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitorUrlError, setCompetitorUrlError] = useState("");
  const [industry, setIndustry] = useState("");
  const [contentFocus, setContentFocus] = useState("");
  const [analysisDepth, setAnalysisDepth] = useState<"standard" | "advanced">("standard");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { toast } = useToast();
  
  // UI state
  const [viewState, setViewState] = useState<"input" | "analyzing" | "results">("input");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [currentSubStep, setCurrentSubStep] = useState<number>(0);
  const [currentSubStepText, setCurrentSubStepText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Animation refs
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingResultRef = useRef<AnalysisResult | null>(null);
  
  // API mutation
  const analysisMutation = useMutation({
    mutationFn: async (params: {
      url: string;
      competitorUrl?: string;
      industry?: string;
      contentFocus?: string;
      analysisDepth?: "standard" | "advanced";
    }) => {
      try {
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await apiRequest(
          "POST", 
          "/api/analyze", 
          params, 
          { signal: controller.signal }
        );
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        // Check for response status
        if (!response.ok) {
          let errorMsg = "Server error occurred";
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {
            // Unable to parse error JSON
          }
          throw new Error(errorMsg);
        }
        
        return response.json();
      } catch (error: unknown) {
        // Handle specific error types
        if (error instanceof Error) {
          const err = error as Error;
          if (err.name === "AbortError") {
            throw new Error("Analysis request timed out. Please try again later.");
          } else if (
            err.message.includes("NetworkError") || 
            err.message.includes("network")
          ) {
            throw new Error("Network error. Please check your internet connection and try again.");
          } else if (
            err.message.includes("JSON")
          ) {
            throw new Error("Error processing response from server. Please try again later.");
          }
          // Rethrow the error with its original message
          throw error;
        }
        // Rethrow as a generic error if it's not an Error instance
        throw new Error("An unexpected error occurred during analysis");
      }
    },
    onError: (error: Error) => {
      // Stop the animation and show error
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      
      // Reset to input state and show error
      setViewState("input");
      setProgress(0);
      setCurrentStep(AnalysisStep.Idle);
      setCurrentSubStep(0);
      setCurrentSubStepText("");
      
      // Determine the error message to display
      let errorTitle = "Analysis Failed";
      let errorDescription = error.message;
      
      if (error.message.includes("timed out")) {
        errorTitle = "Request Timeout";
        errorDescription = "The analysis took too long to complete. Please try again later or try a different URL.";
      } else if (error.message.includes("network") || error.message.includes("Network")) {
        errorTitle = "Connection Error";
        errorDescription = "Unable to connect to the analysis server. Please check your internet connection.";
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
      
      setUrlError(errorDescription);
    }
  });

  // Calculate the current detailed sub-step based on overall progress
  const calculateSubStep = (currentStepIndex: number, progressPercent: number) => {
    // Get the current step configuration
    const stepConfig = ANIMATION_STEPS[currentStepIndex];
    
    // Calculate the previous steps' total percentage (0 if first step)
    const prevStepsPercent = currentStepIndex > 0 ? ANIMATION_STEPS[currentStepIndex - 1].endPercent : 0;
    
    // Calculate how far we are into the current step (0-100%)
    const stepTotalPercent = stepConfig.endPercent - prevStepsPercent;
    const progressInCurrentStep = progressPercent - prevStepsPercent;
    const percentCompletionInStep = (progressInCurrentStep / stepTotalPercent) * 100;
    
    // Calculate which sub-step we're in
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
    
    // Default to the last sub-step if none matched
    return {
      index: stepConfig.subSteps.length - 1,
      text: stepConfig.subSteps[stepConfig.subSteps.length - 1].label
    };
  };

  // Start the animation sequence
  const startAnimation = () => {
    // Reset animation state
    setProgress(0);
    setCurrentStep(AnalysisStep.Crawling);
    setCurrentSubStep(0);
    setCurrentSubStepText(ANIMATION_STEPS[0].subSteps[0].label);
    setViewState("analyzing");
    pendingResultRef.current = null;
    
    // Clear any existing timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    // Track animation start time - this is critical for maintaining the full 8-second duration
    const startTime = Date.now();
    const mustRunUntil = startTime + ANIMATION_DURATION; // Animation must run at least until this timestamp
    
    // Create animation timer
    animationTimerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / ANIMATION_DURATION) * 100));
      
      // Update progress
      setProgress(newProgress);
      
      // Update current step and sub-step based on progress
      for (let i = 0; i < ANIMATION_STEPS.length; i++) {
        if (newProgress <= ANIMATION_STEPS[i].endPercent) {
          const currentStepIndex = i;
          const newStep = ANIMATION_STEPS[i].step;
          
          // Only update the UI if the step has changed
          if (newStep !== currentStep) {
            setCurrentStep(newStep);
          }
          
          // Calculate and update the sub-step
          const { index, text } = calculateSubStep(currentStepIndex, newProgress);
          setCurrentSubStep(index);
          setCurrentSubStepText(text);
          break;
        }
      }
      
      // Check if animation has run for the full 8 seconds
      if (now >= mustRunUntil) {
        // Animation has run for at least 8 seconds, we can now complete it
        if (newProgress >= 100) {
          // Clear timer
          clearInterval(animationTimerRef.current!);
          animationTimerRef.current = null;
          
          // Check if we have a pending result
          if (pendingResultRef.current) {
            setAnalysisResult(pendingResultRef.current);
            setViewState("results");
            pendingResultRef.current = null;
          }
        }
      }
    }, 80); // Update roughly every 80ms (12.5 fps)
  };
  
  // Handle API response
  useEffect(() => {
    if (analysisMutation.data && viewState === "analyzing") {
      // Store the result
      pendingResultRef.current = analysisMutation.data;
      
      // If animation is already complete (full 8 seconds), show results immediately
      if (progress >= 100) {
        setAnalysisResult(analysisMutation.data);
        setViewState("results");
        pendingResultRef.current = null;
      }
      // Otherwise, let the animation continue to complete
    }
  }, [analysisMutation.data, progress, viewState]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearInterval(animationTimerRef.current);
      }
    };
  }, []);

  // URL validation
  const validateUrl = (value: string) => {
    setUrl(value);
    if (!value) {
      setUrlError("Please enter a URL");
      return false;
    }
    
    try {
      new URL(value);
      setUrlError("");
      return true;
    } catch (e) {
      setUrlError("Please enter a valid URL");
      return false;
    }
  };
  
  // Competitor URL validation
  const validateCompetitorUrl = (value: string) => {
    setCompetitorUrl(value);
    if (!value) {
      setCompetitorUrlError("");
      return true; // Empty is valid as it's optional
    }
    
    try {
      new URL(value);
      setCompetitorUrlError("");
      return true;
    } catch (e) {
      setCompetitorUrlError("Please enter a valid competitor URL");
      return false;
    }
  };

  // Start analysis
  const handleAnalyze = () => {
    if (validateUrl(url)) {
      // Validate competitor URL if provided
      if (competitorUrl && !validateCompetitorUrl(competitorUrl)) {
        return;
      }
      
      startAnimation(); // Start animation first
      
      // Prepare analysis parameters
      const analysisParams = {
        url,
        ...(competitorUrl ? { competitorUrl } : {}),
        ...(industry ? { industry } : {}),
        ...(contentFocus ? { contentFocus } : {}),
        ...(analysisDepth !== "standard" ? { analysisDepth } : {})
      };
      
      // Trigger API call
      analysisMutation.mutate(analysisParams);
    }
  };

  // Reset everything
  const handleReset = () => {
    // Clear any running timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
    }
    
    // Reset form
    setUrl("");
    setUrlError("");
    setCompetitorUrl("");
    setCompetitorUrlError("");
    setIndustry("");
    setContentFocus("");
    setAnalysisDepth("standard");
    setShowAdvancedOptions(false);
    
    // Reset state
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
    setCurrentSubStep(0);
    setCurrentSubStepText("");
    setViewState("input");
    setAnalysisResult(null);
    pendingResultRef.current = null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
      <Card className="overflow-hidden shadow-xl border-t-4 border-primary">
        {/* Analysis Input Section */}
        {viewState === "input" && (
          <CardContent className="px-6 py-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold mb-2">Analyze Your Website</h2>
              <p className="text-slate-600">
                Enter your website URL to get your free AEO score
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => validateUrl(e.target.value)}
                    className="w-full px-4 py-3 border-primary/30 focus:border-primary"
                  />
                  {urlError && (
                    <div className="text-red-500 text-sm mt-1">{urlError}</div>
                  )}
                </div>
                <Button 
                  onClick={handleAnalyze}
                  className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90 text-base font-medium"
                >
                  Analyze Now
                </Button>
              </div>
              
              {/* Advanced Options Toggle */}
              <div className="mt-4 flex items-center justify-center">
                <Button 
                  variant="ghost" 
                  className="text-sm flex items-center gap-1 text-slate-600 hover:text-primary transition-colors"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  {showAdvancedOptions ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Hide Advanced Options
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      Show Advanced Options
                    </>
                  )}
                </Button>
              </div>
              
              {/* Advanced Options Panel */}
              {showAdvancedOptions && (
                <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50 animate-in slide-in-from-top duration-300">
                  <h3 className="text-sm font-medium mb-3 text-slate-700">Advanced Analysis Options</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Competitor URL */}
                    <div>
                      <Label htmlFor="competitor-url" className="text-xs mb-1.5 text-slate-600">
                        Competitor URL (optional)
                      </Label>
                      <Input
                        id="competitor-url"
                        type="url"
                        placeholder="https://competitor.com"
                        value={competitorUrl}
                        onChange={(e) => validateCompetitorUrl(e.target.value)}
                        className="w-full text-sm"
                      />
                      {competitorUrlError && (
                        <div className="text-red-500 text-xs mt-1">{competitorUrlError}</div>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        Compare your content against a competing website
                      </p>
                    </div>
                    
                    {/* Industry Selection */}
                    <div>
                      <Label htmlFor="industry" className="text-xs mb-1.5 text-slate-600">
                        Industry (optional)
                      </Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger id="industry" className="w-full text-sm">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific industry</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="media">Media & Publishing</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="realestate">Real Estate</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Get industry-specific recommendations
                      </p>
                    </div>
                    
                    {/* Content Focus */}
                    <div>
                      <Label htmlFor="content-focus" className="text-xs mb-1.5 text-slate-600">
                        Content Focus (optional)
                      </Label>
                      <Select value={contentFocus} onValueChange={setContentFocus}>
                        <SelectTrigger id="content-focus" className="w-full text-sm">
                          <SelectValue placeholder="Select content focus" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">General content</SelectItem>
                          <SelectItem value="question_focused">Question-focused</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                          <SelectItem value="product">Product/Service</SelectItem>
                          <SelectItem value="news">News/Updates</SelectItem>
                          <SelectItem value="howto">How-to Guides</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Tailor analysis to your content type
                      </p>
                    </div>
                    
                    {/* Analysis Depth */}
                    <div>
                      <Label htmlFor="analysis-depth" className="text-xs mb-1.5 text-slate-600">
                        Analysis Depth
                      </Label>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={analysisDepth === "standard" ? "default" : "outline"}
                          size="sm"
                          className={analysisDepth === "standard" ? "gradient-bg text-white" : ""}
                          onClick={() => setAnalysisDepth("standard")}
                        >
                          Standard
                        </Button>
                        <Button 
                          type="button"
                          variant={analysisDepth === "advanced" ? "default" : "outline"}
                          size="sm"
                          className={analysisDepth === "advanced" ? "gradient-bg text-white" : ""}
                          onClick={() => setAnalysisDepth("advanced")}
                        >
                          Advanced
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Advanced analysis includes more detailed scoring factors
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-center text-sm text-slate-500">
                <p>Powered by Llama 3.3 - Analysis takes just a few seconds</p>
              </div>
            </div>
          </CardContent>
        )}
        
        {/* Analysis Loading Section */}
        {viewState === "analyzing" && (
          <CardContent className="px-6 py-8">
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
              
              {/* AI Enhanced Loading Animation */}
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 relative">
                  {/* Connecting line container - Neural pathways between steps */}
                  <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 overflow-hidden">
                    {/* Data flow animation for active processing */}
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
              
              {/* AI Brain Visualization with Neural Network */}
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
              
              {/* Result Skeleton Preview - Only shown when approaching completion */}
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
                
                {/* Process title with enhanced styling */}
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
                        <span className="relative">Analyzing content with Llama 3.3...</span>
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
                
                {/* Detailed sub-step progress with enhanced visuals */}
                <div className="relative">
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
                  
                  {/* Current sub-step text with processing indicator */}
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
                </div>
                
                <div className="mt-3 text-primary text-sm animate-pulse">
                  <span className="inline-flex items-center">
                    <span className="w-3 h-3 rounded-full bg-primary/30 mr-2 animate-neural-pulse"></span>
                    Expected completion in {Math.max(8 - Math.floor(progress / 12.5), 1)} seconds
                  </span>
                </div>
                
                {/* Precise progress percentage */}
                <div className="mt-2 text-xs text-slate-500">
                  <span className="bg-primary/5 px-2 py-0.5 rounded-md text-primary font-medium">
                    {progress}% complete
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        )}
        
        {/* Analysis Results Section */}
        {viewState === "results" && analysisResult && (
          <>
            {/* Results Header with Score */}
            <div className="px-6 py-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Score Visualization */}
                <div className="relative">
                  <ScoreCircle score={analysisResult.overallScore} />
                </div>
                
                {/* Analysis Summary */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    AEO Analysis Results for{" "}
                    <span className="text-primary">{getHostnameFromUrl(url)}</span>
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {analysisResult.summary}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysisResult.scoreSummary.map((stat: AnalysisScoreSummary, index) => (
                      <div 
                        key={stat.category} 
                        className="bg-slate-50 rounded-lg p-4 border border-slate-200 metric-card"
                        style={{ 
                          animation: 'metric-highlight 1.5s ease-in-out',
                          animationDelay: `${index * 200}ms`,
                          animationFillMode: 'backwards'
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-sm text-slate-500 mb-1">{stat.category}</div>
                          <div className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium animate-badge-pop"
                               style={{ animationDelay: `${index * 200 + 600}ms` }}>
                            AEO Factor
                          </div>
                        </div>
                        <div className="flex items-baseline">
                          <div 
                            className="text-2xl font-semibold text-primary animate-number-increment"
                            style={{ animationDelay: `${index * 200 + 300}ms` }}
                          >
                            {stat.score}
                            <span className="text-sm font-normal text-slate-500 ml-1">/100</span>
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                          <div 
                            className="h-full rounded-full animate-metric-bar-fill"
                            style={{ 
                              width: `${stat.score}%`, 
                              backgroundColor: stat.score > 80 ? "rgb(34, 197, 94)" : 
                                              stat.score > 60 ? "rgb(59, 130, 246)" : 
                                              stat.score > 40 ? "rgb(234, 179, 8)" : 
                                              "rgb(239, 68, 68)",
                              animationDelay: `${index * 200 + 500}ms`
                            }}
                          ></div>
                        </div>
                        
                        {/* Category performance text */}
                        <div 
                          className="text-xs mt-2"
                          style={{ 
                            opacity: 0, 
                            animation: 'score-reveal 0.6s ease forwards',
                            animationDelay: `${index * 200 + 700}ms`,
                            color: stat.score > 80 ? "rgb(22, 163, 74)" : 
                                    stat.score > 60 ? "rgb(37, 99, 235)" : 
                                    stat.score > 40 ? "rgb(202, 138, 4)" : 
                                    "rgb(220, 38, 38)"
                          }}
                        >
                          {stat.score > 80 ? "Excellent" : 
                           stat.score > 60 ? "Good" : 
                           stat.score > 40 ? "Needs improvement" : 
                           "Poor performance"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detailed Insights */}
            <div className="p-6">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Key Insights & Recommendations</h3>
                
                {/* Recommendations Cards */}
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec: Recommendation, index: number) => (
                    <RecommendationCard
                      key={index}
                      recommendation={rec}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              
              {/* Score Breakdown */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Detailed Score Breakdown</h3>
                
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm mb-6">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Factor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {analysisResult.scoreBreakdown.map((factor: ScoreBreakdown, index: number) => (
                        <tr 
                          key={index} 
                          className="hover:bg-slate-50 transition-colors duration-200 ease-in-out"
                          style={{ 
                            animation: 'metric-highlight 1.2s ease-in-out',
                            animationDelay: `${index * 150}ms`,
                            animationFillMode: 'backwards'
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-800">{factor.factor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-[60px] h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full animate-metric-bar-fill"
                                  style={{ 
                                    width: `${factor.score}%`, 
                                    backgroundColor: factor.score > 80 ? "rgb(34, 197, 94)" : 
                                                    factor.score > 60 ? "rgb(59, 130, 246)" : 
                                                    factor.score > 40 ? "rgb(234, 179, 8)" : 
                                                    "rgb(239, 68, 68)",
                                    animationDelay: `${index * 120 + 300}ms`
                                  }}
                                ></div>
                              </div>
                              <div 
                                className="text-sm font-medium animate-number-increment" 
                                style={{ animationDelay: `${index * 120 + 100}ms` }}
                              >
                                {factor.score}
                                <span className="text-xs text-slate-500 font-normal">/100</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div 
                              className="text-sm text-slate-600 font-medium" 
                              style={{ 
                                opacity: 0, 
                                animation: 'score-reveal 0.6s ease forwards',
                                animationDelay: `${index * 120 + 200}ms` 
                              }}
                            >
                              {(factor.weight * 100).toFixed(0)}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div 
                              className="text-sm text-slate-600"
                              style={{ 
                                opacity: 0, 
                                animation: 'score-reveal 0.6s ease forwards',
                                animationDelay: `${index * 120 + 400}ms` 
                              }}
                            >
                              {factor.details}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800"
                  >
                    Analyze Another Website
                  </Button>
                  <Button
                    className="ml-4 px-6 py-3 gradient-bg hover:from-primary/90 hover:to-indigo-500/90"
                  >
                    Get Detailed Report
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
