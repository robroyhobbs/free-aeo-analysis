import { FEATURES } from "@/lib/constants";

export function FeatureSection() {
  return (
    <section id="features" className="bg-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why AEO Matters for Your Business</h2>
          <p className="text-slate-600 max-w-3xl mx-auto mb-4">
            AI Answer Engines are transforming how people discover content online. Optimize your website to get featured in direct answers and capture valuable traffic.
          </p>
          <div className="max-w-4xl mx-auto text-slate-700 mb-8">
            <p>
              <strong>70% of searches</strong> now involve AI systems that extract and present answers directly to users. 
              Without proper AEO, your content may never be seen even if you rank well in traditional search results.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-slate-200">
              <div className="text-primary mb-4">
                <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {feature.icon === "bullseye" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                  {feature.icon === "code" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />}
                  {feature.icon === "tachometer-alt" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                  {feature.icon === "chart-line" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />}
                  {feature.icon === "trophy" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />}
                  {feature.icon === "mobile-alt" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />}
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div id="impact" className="mt-16 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-semibold mb-4 text-center">The Business Impact of AEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">59%</div>
              <p className="text-slate-600">of online consumers now start their information-seeking journey with an AI assistant rather than traditional search</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">83%</div>
              <p className="text-slate-600">higher conversion rate for businesses whose content is featured in AI answer boxes</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">47%</div>
              <p className="text-slate-600">of business websites are completely invisible to modern AI systems due to poor optimization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
