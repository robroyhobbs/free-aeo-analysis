import { useState } from "react";
import { useWebsiteAnalysis } from "@/hooks/use-website-analysis";
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
  AnalysisScoreSummary 
} from "@/types";

export function AnalysisTool() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const { toast } = useToast();
  
  const { 
    analyze, 
    isAnalyzing, 
    progress, 
    currentStep, 
    analysisResult, 
    reset 
  } = useWebsiteAnalysis({
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setUrlError(error.message);
    }
  });

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

  const handleAnalyze = () => {
    if (validateUrl(url)) {
      analyze(url);
    }
  };

  const handleReset = () => {
    setUrl("");
    setUrlError("");
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <Card className="overflow-hidden shadow-md">
        {/* Analysis Input Section */}
        {!isAnalyzing && !analysisResult && (
          <CardContent className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Analyze Your Website</h2>
              <p className="text-slate-600">
                Enter your website URL below to see how well it's optimized for AI engines
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => validateUrl(e.target.value)}
                    className="w-full px-4 py-3"
                  />
                  {urlError && (
                    <div className="text-red-500 text-sm mt-1">{urlError}</div>
                  )}
                </div>
                <Button 
                  onClick={handleAnalyze}
                  className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90"
                >
                  Analyze Now
                </Button>
              </div>
              
              <div className="mt-4 text-center text-sm text-slate-500">
                <p>Powered by Llama 3.3 - Analysis takes approximately 5 seconds</p>
              </div>
            </div>
          </CardContent>
        )}
        
        {/* Analysis Loading Section */}
        {isAnalyzing && (
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
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
              
              <div className="text-center">
                <p className="text-slate-600 animate-pulse">Please wait while we analyze your website with Llama 3.3</p>
              </div>
            </div>
          </CardContent>
        )}
        
        {/* Analysis Results Section */}
        {analysisResult && (
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
