export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="gradient-bg text-white rounded-lg p-2 mr-3">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="text-xl font-bold text-white">AEOScore</span>
            </div>
            <p className="text-slate-400 mb-4">
              The ultimate tool for analyzing and optimizing your website for AI answer engines.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">Features</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Pricing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">API</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Integration</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Guides</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} AEOScore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
