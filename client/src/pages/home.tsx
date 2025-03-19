import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AnalysisTool } from "@/components/analysis-tool";
import { FeatureSection } from "@/components/feature-section";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { getHomePageSchema } from "@/lib/schema";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Free AEO Analysis - AI-Powered Website Analysis"
        description="Analyze your website for Answer Engine Optimization (AEO) and get actionable insights to improve visibility in AI search engines and assistants."
        keywords="AEO, Answer Engine Optimization, AI optimization, website analysis, SEO, content optimization, AI readiness"
        canonical="/"
        structuredData={getHomePageSchema()}
      />
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-white to-slate-50">
          <HeroSection />
          <div id="analysis-tool" className="-mt-6">
            <AnalysisTool />
          </div>
        </div>
        <FeatureSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
