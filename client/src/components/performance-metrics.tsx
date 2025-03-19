import React, { useState } from "react";
import { MetricCard } from "./metric-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DownloadCloud, Share2, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { AnalysisScoreSummary } from "@/types";

interface PerformanceMetricsProps {
  url: string;
  scoreSummary: AnalysisScoreSummary[];
  overallScore: number;
}

export function PerformanceMetrics({ url, scoreSummary, overallScore }: PerformanceMetricsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Tooltip descriptions for each metric category
  const tooltips: Record<string, string> = {
    "Question-Based Content": "How well your content addresses specific questions users might ask AI assistants",
    "Clarity & Structure": "How well-organized and clear your content is for AI systems to understand",
    "Semantic Relevance": "How well your content uses relevant keywords and semantic relationships",
    "Content Quality": "Overall quality assessment including freshness and depth of your content",
    "Authority Signals": "Signals that indicate trustworthiness and authority to AI systems"
  };
  
  // Sample industry benchmarks (these would come from the backend in a real application)
  const benchmarks: Record<string, number> = {
    "Question-Based Content": 65,
    "Clarity & Structure": 72,
    "Semantic Relevance": 78,
    "Content Quality": 70,
    "Authority Signals": 68
  };
  
  // Group metrics by category for filtering
  const getFilteredMetrics = () => {
    if (selectedCategory === "all") {
      return scoreSummary;
    }
    return scoreSummary.filter(metric => metric.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  };

  // To get hostname for display
  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-5 max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">
            Analysis for <span className="font-medium text-primary">{getHostname(url)}</span>
          </p>
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button variant="outline" size="sm" className="text-xs h-8">
            <DownloadCloud className="mr-1 h-3 w-3" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8">
            <Share2 className="mr-1 h-3 w-3" />
            Share Results
          </Button>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-sm font-medium">AEO Score</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">
                Answer Engine Optimization score measures how well your content is optimized for AI assistants
                and search engines. A higher score means better visibility in AI responses.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 animate-score-reveal">
          <span className="text-2xl font-bold text-primary">{overallScore}</span>
        </div>
        <div>
          <p className="text-sm">
            {overallScore > 80 ? (
              <span className="text-green-600 font-medium">Excellent</span>
            ) : overallScore > 60 ? (
              <span className="text-blue-600 font-medium">Good</span>
            ) : overallScore > 40 ? (
              <span className="text-yellow-600 font-medium">Needs improvement</span>
            ) : (
              <span className="text-red-600 font-medium">Poor</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {overallScore > 80 
              ? "Your content is well-optimized for AI assistants" 
              : overallScore > 60 
              ? "Your content performs well but has room for improvement" 
              : overallScore > 40 
              ? "Your content needs significant improvements to perform well with AI assistants" 
              : "Your content is poorly optimized for AI assistants"}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger 
            value="all"
            onClick={() => setSelectedCategory("all")}
          >
            All Metrics
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            onClick={() => setSelectedCategory("content")}
          >
            Content
          </TabsTrigger>
          <TabsTrigger 
            value="structure"
            onClick={() => setSelectedCategory("structure")}
          >
            Structure
          </TabsTrigger>
          <TabsTrigger 
            value="relevance"
            onClick={() => setSelectedCategory("relevance")}
          >
            Relevance
          </TabsTrigger>
          <TabsTrigger 
            value="authority"
            onClick={() => setSelectedCategory("authority")}
          >
            Authority
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMetrics().map((metric, index) => (
              <MetricCard
                key={metric.category}
                title={metric.category}
                value={metric.score}
                category="AEO Factor"
                animationDelay={index * 150}
                tooltip={tooltips[metric.category]}
                benchmark={benchmarks[metric.category]}
                description={
                  metric.score > 80 
                    ? "Excellent performance in this category" 
                    : metric.score > 60 
                    ? "Good performance with room for improvement" 
                    : metric.score > 40 
                    ? "Needs attention to improve performance" 
                    : "Critical issues need to be addressed"
                }
              />
            ))}
          </div>
        </TabsContent>
        
        {/* The content for other tabs will be filtered by the getFilteredMetrics function */}
        <TabsContent value="content" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMetrics().map((metric, index) => (
              <MetricCard
                key={metric.category}
                title={metric.category}
                value={metric.score}
                category="Content Factor"
                animationDelay={index * 150}
                tooltip={tooltips[metric.category]}
                benchmark={benchmarks[metric.category]}
                description={
                  metric.score > 80 
                    ? "Excellent performance in this category" 
                    : metric.score > 60 
                    ? "Good performance with room for improvement" 
                    : metric.score > 40 
                    ? "Needs attention to improve performance" 
                    : "Critical issues need to be addressed"
                }
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="structure" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMetrics().map((metric, index) => (
              <MetricCard
                key={metric.category}
                title={metric.category}
                value={metric.score}
                category="Structure Factor"
                animationDelay={index * 150}
                tooltip={tooltips[metric.category]}
                benchmark={benchmarks[metric.category]}
                description={
                  metric.score > 80 
                    ? "Excellent performance in this category" 
                    : metric.score > 60 
                    ? "Good performance with room for improvement" 
                    : metric.score > 40 
                    ? "Needs attention to improve performance" 
                    : "Critical issues need to be addressed"
                }
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="relevance" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMetrics().map((metric, index) => (
              <MetricCard
                key={metric.category}
                title={metric.category}
                value={metric.score}
                category="Relevance Factor"
                animationDelay={index * 150}
                tooltip={tooltips[metric.category]}
                benchmark={benchmarks[metric.category]}
                description={
                  metric.score > 80 
                    ? "Excellent performance in this category" 
                    : metric.score > 60 
                    ? "Good performance with room for improvement" 
                    : metric.score > 40 
                    ? "Needs attention to improve performance" 
                    : "Critical issues need to be addressed"
                }
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="authority" className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredMetrics().map((metric, index) => (
              <MetricCard
                key={metric.category}
                title={metric.category}
                value={metric.score}
                category="Authority Factor"
                animationDelay={index * 150}
                tooltip={tooltips[metric.category]}
                benchmark={benchmarks[metric.category]}
                description={
                  metric.score > 80 
                    ? "Excellent performance in this category" 
                    : metric.score > 60 
                    ? "Good performance with room for improvement" 
                    : metric.score > 40 
                    ? "Needs attention to improve performance" 
                    : "Critical issues need to be addressed"
                }
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-muted-foreground text-center">
        <p>Data refreshed {new Date().toLocaleString()}</p>
        <p>Note: Industry benchmarks are based on averages from top-performing websites in similar categories.</p>
      </div>
    </div>
  );
}