import { AnalysisTool } from "@/components/analysis-tool";
import { SEO } from "@/components/seo";

export default function AnalyzerPage() {
  return (
    <>
      <SEO 
        title="AEO Analyzer Tool - Free Website Analysis"
        description="Analyze your website for Answer Engine Optimization. Get instant insights and actionable recommendations to improve your content for AI search."
        keywords="AEO analyzer, website analysis, AI optimization, content scoring, free analysis tool"
      />
      
      <div className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="content-container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">AEO Website Analyzer</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Enter any URL below to analyze how well your content is optimized for AI answer engines. 
              Get detailed insights and actionable recommendations in seconds.
            </p>
          </div>
          
          <AnalysisTool />
          
          <div className="mt-16 max-w-3xl mx-auto bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">About This Analyzer</h3>
            <p className="text-slate-700 mb-3">
              Our analyzer uses advanced AI technology to evaluate how well your content is optimized for modern 
              answer engines. The tool examines multiple key factors including question-based content, 
              structured data implementation, content clarity, and more.
            </p>
            <p className="text-slate-700">
              All results are confidential and not stored permanently. This free tool provides the 
              core insights you need to start improving your AEO strategy today.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}