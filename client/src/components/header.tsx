import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="content-container">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex-shrink-0 flex items-center cursor-pointer">
                <div className="gradient-bg text-white rounded-lg p-2.5 mr-4">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold gradient-text tracking-tight">Free AEO Analysis</span>
                  <span className="text-xs text-slate-500 mt-0.5">free-aeo-analysis.com</span>
                </div>
              </div>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href="/analyzer" className="text-slate-800 hover:text-primary font-medium tracking-tight transition-colors duration-200">Analyzer</Link>
            <Link href="/guide" className="text-slate-800 hover:text-primary font-medium tracking-tight transition-colors duration-200">AEO Guide</Link>
            <Link href="/blog" className="text-slate-800 hover:text-primary font-medium tracking-tight transition-colors duration-200">Blog</Link>
            <Link href="/faq" className="text-slate-800 hover:text-primary font-medium tracking-tight transition-colors duration-200">FAQ</Link>
            <Link href="/analyzer">
              <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90 px-5 py-2.5 transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3">
            <div className="flex flex-col space-y-4 pb-4 border-t border-gray-100 pt-4 mt-2">
              <Link href="/analyzer" className="text-slate-800 hover:text-primary font-medium py-2.5 px-2 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>Analyzer</Link>
              <Link href="/guide" className="text-slate-800 hover:text-primary font-medium py-2.5 px-2 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>AEO Guide</Link>
              <Link href="/blog" className="text-slate-800 hover:text-primary font-medium py-2.5 px-2 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/faq" className="text-slate-800 hover:text-primary font-medium py-2.5 px-2 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Link href="/analyzer" onClick={() => setMobileMenuOpen(false)}>
                <Button className="gradient-bg w-full py-2.5 mt-2 transition-all duration-200">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
