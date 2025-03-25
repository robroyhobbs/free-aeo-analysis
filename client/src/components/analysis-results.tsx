import React from 'react';
import { ScoreCircle } from '@/components/score-circle';
import { RecommendationCard } from '@/components/recommendation-card';
import { Button } from '@/components/ui/button';
import { getHostnameFromUrl } from '@/lib/utils';
import { AnalysisResult, ScoreBreakdown, Recommendation, AnalysisScoreSummary } from '@/types';

interface AnalysisResultsProps {
  url: string;
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResults({ url, result, onReset }: AnalysisResultsProps) {
  return (
    <>
      {/* Results Header with Score */}
      <div className="px-6 py-8 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Score Visualization */}
          <div className="relative">
            <ScoreCircle score={result.overallScore} />
          </div>
          
          {/* Analysis Summary */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              AEO Analysis Results for{" "}
              <span className="text-primary">{getHostnameFromUrl(url)}</span>
            </h2>
            <p className="text-slate-600 mb-4">
              {result.summary}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.scoreSummary.map((stat: AnalysisScoreSummary, index) => (
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
            {result.recommendations.map((rec: Recommendation, index: number) => (
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
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {result.scoreBreakdown.map((factor: ScoreBreakdown, index: number) => (
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

                    <td className="px-6 py-4">
                      <div 
                        className="text-sm text-slate-600"
                        style={{ 
                          opacity: 0, 
                          animation: 'score-reveal 0.6s ease forwards',
                          animationDelay: `${index * 120 + 200}ms` 
                        }}
                      >
                        <div>{factor.details}</div>
                        
                        {factor.example && (
                          <div className="mt-2 text-xs text-slate-500 italic border-l-2 border-blue-300 pl-2">
                            <div className="font-medium text-slate-700 mb-0.5">Example from your website:</div>
                            <div>{factor.example}</div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button
              onClick={onReset}
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
  );
} 