import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Link } from 'wouter';
import { ChevronDown, CheckCircle2, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { guideContent } from '@/lib/guide-data';

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSection = (sectionId: string) => {
    if (activeSection === sectionId) {
      setActiveSection(null);
    } else {
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      
      <main className="bg-slate-50 pb-20">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{guideContent.title}</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {guideContent.introduction}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Button size="lg" className="gradient-bg">
                <Link href="/#analysis-tool" className="text-white">Try Our AEO Analyzer</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <BookOpen className="mr-2 h-4 w-4" />
                View Our Blog
              </Button>
            </div>
          </div>
        </div>

        {/* Table of contents */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Card className="mb-12 shadow-md">
            <CardHeader>
              <CardTitle>Table of Contents</CardTitle>
              <CardDescription>Navigate through our comprehensive AEO guide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {guideContent.sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center p-3 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <span className="mr-2 h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                      {section.title.split('.')[0]}
                    </span>
                    <span className="font-medium text-slate-700 group-hover:text-primary transition-colors">
                      {section.title.split('.')[1].trim()}
                    </span>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Main content */}
          <div className="space-y-8">
            {guideContent.sections.map((section) => (
              <div 
                key={section.id} 
                id={section.id} 
                className="scroll-mt-20 bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button 
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50 border-b border-slate-100 transition-colors focus:outline-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-800">{section.title}</h2>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${activeSection === section.id ? 'transform rotate-180' : ''}`} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeSection === section.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 prose prose-slate max-w-none">
                    {section.content.map((paragraph, idx) => {
                      // Check if the paragraph is a list item
                      if (paragraph.startsWith('- ')) {
                        return <li key={idx} dangerouslySetInnerHTML={{ __html: paragraph.substring(2) }} />;
                      }
                      
                      // Otherwise render as paragraph
                      return <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick checklist */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-6 w-6 text-primary" />
                Quick AEO Checklist
              </CardTitle>
              <CardDescription>Use this checklist to implement AEO best practices on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guideContent.checklist.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="rounded-full h-6 w-6 flex items-center justify-center bg-primary/10 text-primary text-sm mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Example */}
          <Card className="mt-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Example in Action</CardTitle>
              <CardDescription>See how AEO principles apply to real content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-5 rounded-lg">
                <div className="text-lg font-medium mb-3">Query: "{guideContent.example.query}"</div>
                <div className="bg-white p-4 rounded border border-slate-200 mb-3">
                  <div className="font-medium text-primary mb-1">AEO-Optimized Answer:</div>
                  <p>"{guideContent.example.answer}"</p>
                </div>
                <p className="text-slate-500 italic">{guideContent.example.note}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Call to action */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to optimize your content for answer engines?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Put these principles into practice and see how your content performs with our free AEO analyzer tool.
            </p>
            <Button size="lg" className="gradient-bg">
              <Link href="/#analysis-tool" className="text-white">Analyze Your Website Now</Link>
            </Button>
          </div>
        </div>
      </main>
      
      {/* Scroll to top button */}
      <button 
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg transition-opacity ${
          hasScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={scrollToTop}
      >
        <ChevronDown className="h-5 w-5 transform rotate-180" />
      </button>
      
      <Footer />
    </>
  );
}