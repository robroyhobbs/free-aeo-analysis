import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
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
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/#features" className="text-slate-800 hover:text-primary font-medium">Features</Link>
            <Link href="/#analysis-tool" className="text-slate-800 hover:text-primary font-medium">Analyzer</Link>
            <Link href="/blog" className="text-slate-800 hover:text-primary font-medium">Blog</Link>
            <Link href="/#analysis-tool">
              <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90">
                Get Started
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 px-4">
            <div className="flex flex-col space-y-3 pb-3">
              <Link href="/#features" className="text-slate-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="/#analysis-tool" className="text-slate-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Analyzer</Link>
              <Link href="/blog" className="text-slate-800 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/#analysis-tool" onClick={() => setMobileMenuOpen(false)}>
                <Button className="gradient-bg w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
