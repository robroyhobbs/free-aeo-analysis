import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="gradient-bg text-white rounded-lg p-2 mr-3">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="text-xl font-bold gradient-text">AEOScore</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-slate-800 hover:text-primary font-medium">Features</a>
            <a href="#" className="text-slate-800 hover:text-primary font-medium">Pricing</a>
            <a href="#" className="text-slate-800 hover:text-primary font-medium">Documentation</a>
            <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90">
              Get Started
            </Button>
          </nav>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <i className="fas fa-bars"></i>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
