export function CallToAction() {
  return (
    <section className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Act Now: The AI Content Race Has Begun</h2>
            <div className="space-y-4">
              <p className="text-indigo-100">
                Companies that optimize for AI answer engines today will dominate their industries tomorrow. While your competitors are still focused solely on traditional SEO, you have a limited-time opportunity to get ahead.
              </p>
              <p className="text-indigo-100">
                Our AI-powered analysis tool provides immediate, actionable insights to transform your content strategy and make it AI-ready in minutes, not months.
              </p>
              <div className="pt-4">
                <a href="#analysis-tool" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-800 bg-white hover:bg-indigo-50 shadow-md transition-colors duration-150">
                  Analyze Your Website Now
                  <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="bg-indigo-800 rounded-lg p-8 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Why Our Analysis Matters:</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Proprietary scoring algorithm based on actual AI system analysis patterns</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Instant results with prioritized action items for maximum impact</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Backed by industry-leading AI technology with powerful LLM integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-300 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Complete analysis in seconds, not hours or days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}