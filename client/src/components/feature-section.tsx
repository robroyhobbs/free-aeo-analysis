import { FEATURES } from "@/lib/constants";

export function FeatureSection() {
  return (
    <section className="bg-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why AEO Matters for Your Website</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            AI Answer Engines are transforming how people discover content online. Optimize your website to get featured in direct answers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-primary mb-4">
                <i className={`fas fa-${feature.icon} text-3xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
