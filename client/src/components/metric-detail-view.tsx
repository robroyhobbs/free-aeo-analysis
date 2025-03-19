import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, BarChart2, PieChart, TrendingUp, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricDetailProps {
  title: string;
  value: number;
  category: string;
  isOpen: boolean;
  onClose: () => void;
  benchmark?: number;
  description?: string;
}

export function MetricDetailView({
  title,
  value,
  category,
  isOpen,
  onClose,
  benchmark,
  description
}: MetricDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState<{ week: string; value: number }[]>([]);
  const [subMetrics, setSubMetrics] = useState<{ name: string; value: number; weight: number }[]>([]);
  const [recommendations, setRecommendations] = useState<{ text: string; impact: string }[]>([]);
  
  // Mock data generation for visualizations - in a real app, this would come from the API
  useEffect(() => {
    if (isOpen) {
      // Generate some mock data for visualizations
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      const weeklyData = weeks.map(week => ({
        week,
        value: Math.floor(Math.random() * 30) + (value - 15)
      }));
      setChartData(weeklyData);
      
      // Sub-metrics that make up this score
      setSubMetrics([
        { name: `${title} Structure`, value: Math.floor(Math.random() * 20) + (value - 10), weight: 0.3 },
        { name: `${title} Content`, value: Math.floor(Math.random() * 20) + (value - 5), weight: 0.4 },
        { name: `${title} Optimization`, value: Math.floor(Math.random() * 20) + (value - 8), weight: 0.3 }
      ]);
      
      // Recommendations based on score
      setRecommendations([
        { 
          text: `Improve ${title.toLowerCase()} by implementing structured data markup`, 
          impact: 'High' 
        },
        { 
          text: `Enhance content with more specific question-based headings`, 
          impact: 'Medium' 
        },
        { 
          text: `Add more detailed explanations with examples for key concepts`, 
          impact: 'Medium' 
        }
      ]);
    }
  }, [isOpen, title, value]);
  
  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  
  // Background color based on value
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-blue-50";
    if (score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };
  
  // Status text based on value
  const getScoreStatus = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header with navigation */}
            <div className="bg-slate-50 border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">{title}</h2>
                <Badge variant="outline" className="ml-2">
                  {category}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content with scrollable area */}
            <div className="flex-1 overflow-auto p-6">
              {/* Score summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <motion.div 
                  className={`w-32 h-32 rounded-full ${getScoreBgColor(value)} flex items-center justify-center border-8 border-white shadow-md`}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                >
                  <span className={`text-4xl font-bold ${getScoreColor(value)}`}>{value}</span>
                </motion.div>
                
                <div className="text-center sm:text-left">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className={`text-xl font-medium mb-1 ${getScoreColor(value)}`}>
                      {getScoreStatus(value)}
                    </h3>
                    <p className="text-slate-600 mb-3">
                      {description || `Your ${title.toLowerCase()} score indicates ${getScoreStatus(value).toLowerCase()} performance for AI and search engine optimization.`}
                    </p>
                    
                    {benchmark && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Industry benchmark:</span>
                        <span className="font-medium">{benchmark}</span>
                        <span className={value > benchmark ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {value > benchmark ? `+${(value - benchmark).toFixed(0)}` : `${(value - benchmark).toFixed(0)}`}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              {/* Tabs for different views */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                  <TabsTrigger value="breakdown">Score Breakdown</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-medium mb-2">About This Metric</h3>
                    <p className="text-slate-600 mb-4">
                      The {title} score measures how well your content is optimized for answer engines and AI assistants. 
                      This includes factors like content structure, relevance, and semantic quality.
                    </p>
                    
                    <h4 className="font-medium mb-1 text-sm">Key Insights:</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 mb-4">
                      <li>Your score is {value > benchmark! ? "above" : "below"} the industry average of {benchmark}</li>
                      <li>Your strongest component is {subMetrics[0]?.name}</li>
                      <li>The biggest area for improvement is {subMetrics[2]?.name}</li>
                    </ul>
                    
                    <h4 className="font-medium mb-1 text-sm">Quick Actions:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        View detailed breakdown
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Analyze trends
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share this report
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Learn more
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h3 className="text-lg font-medium mb-4">Score Trends</h3>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border mb-6">
                      <h4 className="text-sm font-medium mb-3">Monthly Performance</h4>
                      <div className="h-64 w-full">
                        {/* Chart visualization - In a real app, this would be an actual chart component */}
                        <div className="relative h-full w-full flex items-end gap-3 pt-6">
                          {chartData.map((item, index) => (
                            <div key={item.week} className="flex-1 flex flex-col items-center gap-2">
                              <div 
                                className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden"
                                style={{ 
                                  height: `${(item.value * 100) / 100}%`,
                                  transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              >
                                <div 
                                  className="absolute inset-0 bg-primary opacity-60"
                                  style={{ 
                                    animation: `rise 0.5s ease-out forwards`,
                                    animationDelay: `${0.1 + index * 0.1}s`
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{item.week}</span>
                              <span className="text-xs">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-lg p-4 border">
                        <h4 className="text-sm font-medium mb-2">Performance Summary</h4>
                        <p className="text-sm text-slate-600 mb-2">
                          Your {title.toLowerCase()} score has {
                            chartData[chartData.length - 1]?.value > chartData[0]?.value 
                              ? `improved by ${chartData[chartData.length - 1]?.value - chartData[0]?.value} points`
                              : `decreased by ${chartData[0]?.value - chartData[chartData.length - 1]?.value} points`
                          } over the last month.
                        </p>
                        <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                          chartData[chartData.length - 1]?.value > chartData[0]?.value 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {chartData[chartData.length - 1]?.value > chartData[0]?.value 
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingUp className="h-3 w-3 transform rotate-180" />
                          }
                          <span>{
                            Math.abs(
                              ((chartData[chartData.length - 1]?.value - chartData[0]?.value) / chartData[0]?.value) * 100
                            ).toFixed(1)
                          }% {
                            chartData[chartData.length - 1]?.value > chartData[0]?.value ? 'increase' : 'decrease'
                          }</span>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 rounded-lg p-4 border">
                        <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                        <p className="text-sm text-slate-600">
                          {chartData[chartData.length - 1]?.value > chartData[0]?.value 
                            ? 'Continue your optimization efforts to maintain this positive trend.'
                            : 'Focus on improving your content structure and implementing the recommendations to reverse this trend.'
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Breakdown Tab */}
                <TabsContent value="breakdown" className="space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h3 className="text-lg font-medium mb-4">Score Breakdown</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Your {title} score is composed of several factors, each with different weights.
                    </p>
                    
                    <div className="space-y-4 mb-6">
                      {subMetrics.map((metric, index) => (
                        <div key={metric.name} className="bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-sm">{metric.name}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{metric.value}</span>
                              <Badge variant="outline" className="text-xs">
                                {(metric.weight * 100).toFixed(0)}% weight
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                            <div 
                              className="h-full rounded-full bg-primary"
                              style={{ 
                                width: `${metric.value}%`, 
                                animation: `grow 1s ease-out forwards`,
                                animationDelay: `${0.2 + index * 0.1}s`
                              }}
                            ></div>
                          </div>
                          
                          <p className="text-xs text-slate-500 mt-2">
                            {metric.value >= 80 
                              ? 'Excellent performance in this aspect'
                              : metric.value >= 60
                              ? 'Good performance with some room for improvement'
                              : metric.value >= 40
                              ? 'Needs improvement to optimize for AI systems'
                              : 'Critical area requiring immediate attention'
                            }
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-4 border">
                      <h4 className="text-sm font-medium mb-2">Score Calculation</h4>
                      <p className="text-sm text-slate-600 mb-2">
                        Your overall score of <span className="font-medium">{value}</span> is a weighted average of the component scores.
                      </p>
                      <div className="text-xs text-slate-500">
                        <div className="font-mono bg-slate-100 p-2 rounded">
                          {subMetrics.map((metric, i) => (
                            <div key={i}>
                              {metric.value} × {metric.weight} {i < subMetrics.length - 1 ? '+ ' : '= '}
                            </div>
                          ))}
                          <div className="border-t mt-1 pt-1 font-medium">
                            {value} (Overall Score)
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
                
                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h3 className="text-lg font-medium mb-4">Optimization Recommendations</h3>
                    
                    <div className="space-y-4 mb-6">
                      {recommendations.map((rec, index) => (
                        <motion.div 
                          key={index} 
                          className="bg-white rounded-lg border p-4"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm flex-1">{rec.text}</h4>
                            <Badge 
                              className={`
                                ${rec.impact === 'High' ? 'bg-red-100 text-red-800' : 
                                  rec.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'}
                              `}
                            >
                              {rec.impact} Impact
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-slate-600 mt-2">
                            Implementing this change could significantly improve your content's performance in AI systems.
                          </p>
                          
                          <div className="mt-3 flex gap-2">
                            <Button variant="outline" size="sm" className="text-xs h-7">
                              Learn More
                            </Button>
                            <Button variant="default" size="sm" className="text-xs h-7">
                              Apply Fix
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <h4 className="text-sm font-medium mb-2 text-primary">Pro Tip</h4>
                      <p className="text-sm text-slate-600">
                        Implementing these recommendations can improve your content's visibility in AI responses and search results. 
                        Focus on high-impact changes first for the best results.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Footer with actions */}
            <div className="border-t px-6 py-4 bg-slate-50 flex justify-between items-center">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button>Export Report</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Keyframe animations for the charts
const style = document.createElement('style');
style.textContent = `
  @keyframes rise {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  @keyframes grow {
    from { width: 0%; }
  }
`;
document.head.appendChild(style);