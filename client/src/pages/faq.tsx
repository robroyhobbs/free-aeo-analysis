import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Info, Settings, CreditCard, Lightbulb } from 'lucide-react';
import { faqItems, FAQItem } from '@/lib/faq-data';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'technical' | 'pricing' | 'aeo'>('all');
  
  // Filter FAQ items based on search query and selected category
  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch = 
      searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about AEO Analysis and how to optimize your content for AI answer engines.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        
        {/* Category tabs */}
        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveCategory(value as any)}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="aeo">AEO Tips</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-lg font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose-sm max-w-none">
                    <p>{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-slate-600">
              Try adjusting your search or category filter to find what you're looking for.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
            >
              Reset filters
            </Button>
          </div>
        )}
        
        {/* Contact section */}
        <div className="mt-16 bg-slate-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            If you couldn't find the answer to your question, feel free to reach out to our support team.
          </p>
          <Button className="gradient-bg hover:from-primary/90 hover:to-indigo-500/90">
            Contact Support
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}