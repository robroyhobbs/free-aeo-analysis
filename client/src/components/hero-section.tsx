import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="content-container py-16 text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        <span className="gradient-text">
          AI-Powered Analysis for AEO Success
        </span>
      </h1>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4 leading-relaxed">
        <strong>Answer Engine Optimization (AEO)</strong> helps your content become <span className="text-primary font-semibold">the answer</span> that AI delivers to users
      </p>
      <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-8 leading-relaxed">
        Businesses optimized for answer engines see up to <strong className="text-primary">3-5x more visibility</strong> in AI search results
      </p>
      
      <div className="flex justify-center gap-4 mt-2">
        <Link href="/analyzer">
          <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90 px-8 py-6 text-lg transition-all duration-200">
            Analyze Your Website Now
          </Button>
        </Link>
        <Link href="/guide">
          <Button variant="outline" className="px-8 py-6 text-lg border-2 border-slate-200 hover:border-primary/60 transition-all duration-200">
            Learn About AEO
          </Button>
        </Link>
      </div>
    </section>
  );
}
