import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { AnalysisTool } from "@/components/analysis-tool";
import { FeatureSection } from "@/components/feature-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AnalysisTool />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}
