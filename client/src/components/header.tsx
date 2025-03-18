import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="gradient-bg text-white rounded-lg p-2 mr-3">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text">Free AEO Analysis</span>
                <span className="text-xs text-slate-500">free-aeo-analysis.com</span>
              </div>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            <a href="#features" className="text-slate-800 hover:text-primary font-medium">Features</a>
            <a href="#analysis-tool" className="text-slate-800 hover:text-primary font-medium">Analyzer</a>
            <a href="#impact" className="text-slate-800 hover:text-primary font-medium">Business Impact</a>
            <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90">
              Get Started
            </Button>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
