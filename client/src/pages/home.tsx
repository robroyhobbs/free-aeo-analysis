import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AnalysisTool } from "@/components/analysis-tool";
import { FeatureSection } from "@/components/feature-section";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div id="analysis-tool">
          <AnalysisTool />
        </div>
        <FeatureSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
