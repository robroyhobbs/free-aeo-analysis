export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'aeo';
}

export const faqItems: FAQItem[] = [
  {
    question: "What is AEO (Answer Engine Optimization)?",
    answer: "Answer Engine Optimization (AEO) refers to the process of optimizing your content to be featured as direct answers in AI-powered search engines and language models. Unlike traditional SEO that focuses on ranking web pages, AEO focuses on getting your content selected as the direct answer to user queries in tools like ChatGPT, Claude, Perplexity, or Google's AI Overview.",
    category: "general"
  },
  {
    question: "How is AEO different from traditional SEO?",
    answer: "While SEO focuses on ranking web pages in search engine results pages (SERPs), AEO focuses on getting your content selected as the direct answer to user queries in AI systems. SEO aims to drive traffic to your website, while AEO aims to get your content and brand featured as authoritative answers, often with attribution and citations back to your content.",
    category: "general"
  },
  {
    question: "Why should I care about AEO?",
    answer: "As more users turn to AI assistants and answer engines for information, traditional web traffic may decrease. By optimizing for AEO, you ensure your content remains discoverable and authoritative in this new paradigm. Additionally, being cited as an authoritative source by AI systems can significantly enhance your brand reputation and visibility.",
    category: "general"
  },
  {
    question: "What factors affect AEO score?",
    answer: "Several factors influence AEO effectiveness: content clarity, structured data implementation, question-based content formatting, semantic keyword usage, content freshness, authority signals (citations, backlinks), and comprehensiveness of information. Our analyzer evaluates all these factors to provide you with an overall score and specific recommendations.",
    category: "technical"
  },
  {
    question: "How often should I check my AEO score?",
    answer: "We recommend checking your AEO score after any significant content update or at least monthly. AI systems and their evaluation criteria evolve rapidly, so regular monitoring helps ensure your content remains optimized for the latest versions of AI answer engines.",
    category: "technical"
  },
  {
    question: "Is AEO Analysis free to use?",
    answer: "Yes, our basic AEO analysis is completely free to use. The free version includes a comprehensive analysis of your content's AEO effectiveness and practical recommendations for improvement. We also offer premium features for advanced users, including historical tracking, PDF reports, and bulk analysis.",
    category: "pricing"
  },
  {
    question: "What premium features are available?",
    answer: "Our premium features include: historical score tracking to monitor your progress over time, detailed PDF reports for sharing with clients or team members, bulk analysis for analyzing multiple URLs simultaneously, and advanced competitive analysis to see how your content compares to competitors in your industry.",
    category: "pricing"
  },
  {
    question: "How accurate is the AEO score?",
    answer: "Our AEO score is based on comprehensive analysis of factors known to influence how AI systems evaluate and select content. While no system can perfectly predict AI behavior due to the proprietary nature of these systems, our methodology is continuously refined based on testing and observation of real-world results with major AI systems like ChatGPT, Claude, and others.",
    category: "technical"
  },
  {
    question: "Can I analyze any website with this tool?",
    answer: "Yes, you can analyze any publicly accessible web page. However, the analysis works best on content-focused pages rather than purely functional or e-commerce product pages. For best results, analyze specific blog posts, articles, or resource pages rather than homepages or navigation-heavy pages.",
    category: "technical"
  },
  {
    question: "What specific AEO improvements should I prioritize?",
    answer: "The most effective AEO improvements typically include: structuring content in a question-answer format, implementing proper semantic HTML markup, adding comprehensive structured data, ensuring content is factually accurate and up-to-date, organizing content with clear headings and subheadings, and providing comprehensive coverage of your topic with authoritative citations.",
    category: "aeo"
  },
  {
    question: "Will improving my AEO score help with traditional SEO?",
    answer: "Yes! Many AEO best practices align with quality content creation principles that also benefit traditional SEO. Structured content, comprehensive topic coverage, clear organization, and authoritative citations are all factors that can improve both AEO and SEO performance. Think of AEO as an extension of your existing content optimization strategy.",
    category: "aeo"
  },
  {
    question: "How quickly will I see results after implementing AEO recommendations?",
    answer: "The timeframe for seeing results varies. AI systems like ChatGPT and Claude update their knowledge cutoffs periodically, so it may take some time before they incorporate your latest content. However, web-connected AI services may discover your optimized content more quickly. Generally, you should allow 2-4 weeks to see meaningful changes in how often your content is cited by AI systems.",
    category: "aeo"
  }
];