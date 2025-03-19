import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LoadingStep } from "@/components/loading-step";
import { ScoreCircle } from "@/components/score-circle";
import { RecommendationCard } from "@/components/recommendation-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const ANIMATION_STEPS = [
  { step: AnalysisStep.Crawling, endPercent: 25 },
  { step: AnalysisStep.Analyzing, endPercent: 55 },
  { step: AnalysisStep.Calculating, endPercent: 80 },
  { step: AnalysisStep.Generating, endPercent: 100 }
];

export function AnalysisTool() {
  // Form state
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();
  
  // UI state
  const [viewState, setViewState] = useState<"input" | "analyzing" | "results">("input");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(AnalysisStep.Idle);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // Animation refs
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingResultRef = useRef<AnalysisResult | null>(null);
  
  // API mutation
  const analysisMutation = useMutation({
    mutationFn: async (urlToAnalyze: string) => {
      try {
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await apiRequest(
          "POST", 
          "/api/analyze", 
          { url: urlToAnalyze }, 
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

  // Start the animation sequence
  const startAnimation = () => {
    // Reset animation state
    setProgress(0);
    setCurrentStep(AnalysisStep.Crawling);
    setViewState("analyzing");
    pendingResultRef.current = null;
    
    // Clear any existing timer
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
    }
    
    // Track animation start time
    const startTime = Date.now();
    
    // Create animation timer
    animationTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, Math.floor((elapsed / ANIMATION_DURATION) * 100));
      
      // Update progress
      setProgress(newProgress);
      
      // Update current step based on progress
      for (let i = 0; i < ANIMATION_STEPS.length; i++) {
        if (newProgress <= ANIMATION_STEPS[i].endPercent) {
          setCurrentStep(ANIMATION_STEPS[i].step);
          break;
        }
      }
      
      // Check if animation is complete
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
    }, 80); // Update roughly every 80ms (12.5 fps)
  };
  
  // Handle API response
  useEffect(() => {
    if (analysisMutation.data && viewState === "analyzing") {
      // Store the result
      pendingResultRef.current = analysisMutation.data;
      
      // If animation is already complete, show results immediately
      if (progress >= 100) {
        setAnalysisResult(analysisMutation.data);
        setViewState("results");
        pendingResultRef.current = null;
      }
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

  // Start analysis
  const handleAnalyze = () => {
    if (validateUrl(url)) {
      startAnimation(); // Start animation first
      analysisMutation.mutate(url); // Then trigger API call
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
    
    // Reset state
    setProgress(0);
    setCurrentStep(AnalysisStep.Idle);
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
              
              {/* Loading Animation */}
              <div className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8 relative">
                  {/* Connecting line container */}
                  <div className="hidden sm:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                  
                  <LoadingStep
                    icon="search"
                    title="Crawling Content"
                    step={1}
                    isActive={currentStep === AnalysisStep.Crawling}
                    isCompleted={currentStep > AnalysisStep.Crawling}
                  />
                  
                  <LoadingStep
                    icon="robot"
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
                    icon="clipboard-list"
                    title="Generating Insights"
                    step={4}
                    isActive={currentStep === AnalysisStep.Generating}
                    isCompleted={currentStep > AnalysisStep.Generating}
                  />
                </div>
              </div>
              
              <div className="text-center bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4">
                <div className="text-lg font-medium mb-1">
                  {currentStep === AnalysisStep.Crawling && "Crawling website content..."}
                  {currentStep === AnalysisStep.Analyzing && "Analyzing content with Llama 3.3..."}
                  {currentStep === AnalysisStep.Calculating && "Calculating AEO score..."}
                  {currentStep === AnalysisStep.Generating && "Generating optimization insights..."}
                </div>
                <p className="text-slate-600">
                  {currentStep === AnalysisStep.Crawling && "Extracting text, metadata, and structural elements..."}
                  {currentStep === AnalysisStep.Analyzing && "AI is analyzing content relevance and structure..."}
                  {currentStep === AnalysisStep.Calculating && "Determining question-based content score..."}
                  {currentStep === AnalysisStep.Generating && "Creating actionable recommendations..."}
                </p>
                <div className="mt-2 text-primary text-sm animate-pulse">
                  Expected completion in {Math.max(8 - Math.floor(progress / 12.5), 1)} seconds
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
                    {analysisResult.scoreSummary.map((stat: AnalysisScoreSummary) => (
                      <div key={stat.category} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="text-sm text-slate-500 mb-1">{stat.category}</div>
                        <div className="text-2xl font-semibold text-primary">
                          {stat.score}<span className="text-sm font-normal text-slate-500">/100</span>
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
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-800">{factor.factor}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-800">{factor.score}/100</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-slate-600">{factor.weight}%</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">
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
