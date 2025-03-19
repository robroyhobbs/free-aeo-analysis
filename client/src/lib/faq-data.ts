export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'aeo';
}

export const faqItems: FAQItem[] = [
  // General Category
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
    question: "What does it mean when an AI system 'cites' my content?",
    answer: "When an AI system cites your content, it means the AI identifies your website or content as a reliable source for the information it's providing to users. This can appear as a direct attribution (e.g., 'According to free-aeo-analysis.com...'), a listing of your site among sources, or a direct link to your content. These citations drive awareness and establish your brand as an authority on the topic.",
    category: "general"
  },
  {
    question: "Is AEO only relevant for certain types of websites?",
    answer: "While AEO benefits all types of content, it's especially valuable for informational, educational, and expertise-based content. This includes how-to guides, tutorials, industry insights, research findings, definitions, comparisons, and factual information. E-commerce sites also benefit from AEO through optimized product descriptions, specifications, and FAQ content that can appear in AI shopping recommendations.",
    category: "general"
  },
  {
    question: "How is AEO related to AI-generated search results?",
    answer: "AEO directly influences how your content appears in AI-generated search results like Google's AI Overview, Bing's AI responses, or dedicated AI search engines like Perplexity. These systems analyze web content and generate summaries or direct answers to user queries. With proper AEO techniques, your content is more likely to be selected as a source for these AI-generated summaries and credited accordingly.",
    category: "general"
  },
  {
    question: "What's the difference between AEO and AIO?",
    answer: "AEO (Answer Engine Optimization) focuses on getting your content selected and cited by AI systems when answering user queries. AIO (AI Optimization) is a broader term that encompasses all aspects of optimizing for AI interactions, including AEO but also extending to other AI interactions like chatbots, voice assistants, and AI-powered features across various platforms. Our tool focuses primarily on AEO while incorporating relevant AIO principles.",
    category: "general"
  },
  
  // Technical Category
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
    question: "What is structured data and why is it important for AEO?",
    answer: "Structured data is a standardized format for providing information about a page and classifying its content. It uses specific vocabularies like Schema.org to mark up your content in ways that AI systems can easily parse and understand. For AEO, structured data helps AI systems correctly identify key information like questions, answers, facts, definitions, and relationships between concepts, making your content more likely to be selected as an authoritative source.",
    category: "technical"
  },
  {
    question: "How does the crawler access my content for analysis?",
    answer: "Our analyzer uses a specialized web crawler that accesses your page similarly to how AI systems and search engines do. It reads the HTML structure, extracts text content, analyzes headings and semantic markup, identifies structured data, and evaluates various content patterns. The crawler only accesses publicly available content and doesn't store your full content - only the analysis results and metrics are saved for your reference.",
    category: "technical"
  },
  {
    question: "What metrics are included in the detailed AEO score breakdown?",
    answer: "Our detailed score breakdown includes metrics for: Question-Based Content (how well content is structured around questions users might ask), Content Clarity (readability and directness), Structured Data Implementation (presence and quality of schema markup), Semantic Keyword Usage (relevant terminology), Content Freshness (timeliness), Authority Signals (indicators of expertise and trust), and Content Comprehensiveness (thoroughness of topic coverage).",
    category: "technical"
  },
  {
    question: "How does your tool handle JavaScript-heavy or single-page applications?",
    answer: "Our analyzer executes JavaScript and renders pages similarly to modern browsers, allowing it to analyze dynamically-loaded content in JavaScript-heavy or single-page applications (SPAs). However, if content is heavily gated behind user interactions or requires specific user events to load, those portions may not be fully analyzed. For best results with SPAs, ensure your core content is accessible without requiring multiple user interactions.",
    category: "technical"
  },
  {
    question: "Does page load speed affect AEO score?",
    answer: "While page load speed is not a direct factor in our AEO score (as it's more related to traditional SEO), excessively slow pages can impact how effectively AI systems crawl and index your content. Very slow pages might be partially processed or timed out by some AI crawlers. Additionally, pages with better user experience tend to receive more engagement signals that can indirectly benefit AEO through increased authority metrics.",
    category: "technical"
  },
  
  // Pricing Category
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
  
  // AEO Tips Category
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
  },
  {
    question: "What are FAQPage and HowTo schema markups, and why are they important for AEO?",
    answer: "FAQPage and HowTo schema markups are structured data formats that help AI systems understand question-answer content and step-by-step instructions. FAQPage schema explicitly identifies questions and their corresponding answers, while HowTo schema outlines step-by-step processes with tools, materials, and time requirements. These schemas are crucial for AEO because they directly align with how users phrase queries to AI systems and make it easier for AI to extract and attribute specific answers from your content.",
    category: "aeo"
  },
  {
    question: "How should I format my content for optimal AEO performance?",
    answer: "For optimal AEO performance: 1) Use clear, concise question headings that match likely user queries, 2) Provide direct, comprehensive answers immediately following each question, 3) Organize content with logical H1-H6 heading hierarchies, 4) Include relevant facts, statistics and citations to establish authority, 5) Use bulleted or numbered lists for steps and key points, 6) Implement appropriate schema markup (FAQPage, HowTo, Article), and 7) Ensure content is factually accurate and up-to-date.",
    category: "aeo"
  },
  {
    question: "How does AEO impact my content strategy?",
    answer: "AEO should reshape your content strategy in several ways: 1) Focus on answering specific questions comprehensively rather than keyword-stuffing, 2) Develop content around question clusters and topic hierarchies, 3) Prioritize factual accuracy and citations over opinion, 4) Update content regularly to maintain freshness signals, 5) Structure content with clear headings and schema markup, 6) Consider voice-friendly phrasing for voice assistant compatibility, and 7) Develop content depth over breadth to establish topical authority that AI systems recognize.",
    category: "aeo"
  },
  {
    question: "What are 'entity relationships' and why do they matter for AEO?",
    answer: "Entity relationships are the connections between people, places, things, concepts, and other entities that AI systems use to understand context and relevance. For AEO, clearly establishing entity relationships helps AI systems better understand your content's meaning and authority. For example, if you're writing about digital marketing, explicitly connecting it to related concepts like SEO, social media, and analytics helps AI systems recognize the comprehensive nature of your content and increases the likelihood of citation when users ask about these interconnected topics.",
    category: "aeo"
  },
  {
    question: "How do I optimize images and media for AEO?",
    answer: "While AI systems primarily analyze text content, properly optimized images and media can provide additional context and improve overall content quality: 1) Use descriptive, keyword-rich filenames, 2) Add comprehensive alt text that explains image content and relevance, 3) Include captions that provide additional context, 4) Implement image schema markup when appropriate, 5) Ensure images support and enhance your textual content rather than replacing it, and 6) Consider adding transcripts for video or audio content to make that information accessible to AI systems.",
    category: "aeo"
  },
  {
    question: "What role does E-E-A-T play in AEO?",
    answer: "E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) principles are crucial for AEO success. AI systems prioritize content that demonstrates these qualities when selecting sources to cite. To improve E-E-A-T for AEO: 1) Clearly identify authors and their credentials, 2) Include first-hand experience and insights when relevant, 3) Back claims with data and citations, 4) Maintain up-to-date information with visible update timestamps, 5) Link to authoritative external sources, and 6) Provide comprehensive coverage that demonstrates deep subject matter expertise.",
    category: "aeo"
  }
];