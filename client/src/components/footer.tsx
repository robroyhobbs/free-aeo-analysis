import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <div className="flex items-center mb-4 cursor-pointer">
                <div className="gradient-bg text-white rounded-lg p-2 mr-3">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">Free AEO Analysis</span>
                  <span className="text-xs text-slate-400">free-aeo-analysis.com</span>
                </div>
              </div>
            </Link>
            <p className="text-slate-400 mb-4">
              The ultimate tool for analyzing and optimizing your website for AI answer engines. Get actionable insights in seconds.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/freeaeoanalysis" className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/free-aeo-analysis" className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Analysis Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/#analysis-tool" className="text-slate-400 hover:text-white">Website Analyzer</Link></li>
              <li><Link href="/#features" className="text-slate-400 hover:text-white">Feature Overview</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white">Blog</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white">API Access</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">AEO Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">AEO Guide</a></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white">Blog</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Case Studies</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Free AEO Analysis | free-aeo-analysis.com | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
