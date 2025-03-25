import React, { useState, useRef } from 'react';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getHostnameFromUrl } from "@/lib/utils";
import { AnalysisStep, AnalysisResult } from "@/types";
import { useAnalysisAnimation } from "@/hooks/useAnalysisAnimation";
import { AnalysisLoading } from "@/components/analysis-loading";
import { AnalysisResults } from "@/components/analysis-results";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LoadingStep } from "@/components/loading-step";
import { ScoreCircle } from "@/components/score-circle";
import { RecommendationCard } from "@/components/recommendation-card";
import { AILoadingAnimation } from "@/components/ai-loading-animation";
import { AnalysisSkeleton } from "@/components/analysis-skeleton";

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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const pendingResultRef = useRef<AnalysisResult | null>(null);
  
  // Animation state
  const {
    progress,
    currentStep,
    currentSubStep,
    currentSubStepText,
    startAnimation
  } = useAnalysisAnimation();
  
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const response = await apiRequest(
          "POST", 
          "/api/analyze", 
          params, 
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
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
          throw error;
        }
        throw new Error("An unexpected error occurred during analysis");
      }
    },
    onError: (error: Error) => {
      setViewState("input");
      
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
      return true;
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
      if (competitorUrl && !validateCompetitorUrl(competitorUrl)) {
        return;
      }
      
      startAnimation();
      setViewState("analyzing");
      
      const analysisParams = {
        url,
        ...(competitorUrl ? { competitorUrl } : {}),
        ...(industry ? { industry } : {}),
        ...(contentFocus ? { contentFocus } : {}),
        ...(analysisDepth !== "standard" ? { analysisDepth } : {})
      };
      
      analysisMutation.mutate(analysisParams);
    }
  };

  // Reset everything
  const handleReset = () => {
    setUrl("");
    setUrlError("");
    setCompetitorUrl("");
    setCompetitorUrlError("");
    setIndustry("");
    setContentFocus("");
    setAnalysisDepth("standard");
    setShowAdvancedOptions(false);
    setViewState("input");
    setAnalysisResult(null);
    pendingResultRef.current = null;
  };

  // Handle API response
  React.useEffect(() => {
    if (analysisMutation.data && viewState === "analyzing") {
      pendingResultRef.current = analysisMutation.data;
      
      if (progress >= 100) {
        setAnalysisResult(analysisMutation.data);
        setViewState("results");
        pendingResultRef.current = null;
      }
    }
  }, [analysisMutation.data, progress, viewState]);

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
              
              {/* Advanced Options */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors"
                >
                  {showAdvancedOptions ? (
                    <>
                      <span>Hide Advanced Options</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Show Advanced Options</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                {showAdvancedOptions && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        Compare your site against a competitor
                      </p>
                    </div>
                    
                    {/* Industry Selection */}
                    <div>
                      <Label htmlFor="industry" className="text-xs mb-1.5 text-slate-600">
                        Industry (optional)
                      </Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger id="industry" className="w-full text-sm">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        Tailor analysis to your industry
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
                          <SelectItem value="general">General content</SelectItem>
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
                )}
              </div>
              
              <div className="mt-4 text-center text-sm text-slate-500">
                <p>Powered by 20 years of expertise and AI - your personal analysis is just seconds away</p>
              </div>
            </div>
          </CardContent>
        )}
        
        {/* Analysis Loading Section */}
        {viewState === "analyzing" && (
          <AnalysisLoading
            url={url}
            progress={progress}
            currentStep={currentStep}
            currentSubStep={currentSubStep}
            currentSubStepText={currentSubStepText}
          />
        )}
        
        {/* Analysis Results Section */}
        {viewState === "results" && analysisResult && (
          <AnalysisResults
            url={url}
            result={analysisResult}
            onReset={handleReset}
          />
        )}
      </Card>
    </div>
  );
}
