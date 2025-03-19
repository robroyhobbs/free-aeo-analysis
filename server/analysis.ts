import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { WebsiteContent, AnalysisResult, Recommendation, RecommendationType, ScoreBreakdown, AnalysisScoreSummary } from "@/types";
import { AEO_CRITERIA } from "@/lib/constants";
import { calculateWeightedScore } from "@/lib/utils";

// Helper type for analysis function results
interface AnalysisFunctionResult {
  score: number;
  example: string;
}

// Function to fetch and parse website content
export async function getContent(url: string): Promise<WebsiteContent> {
  try {
    // Fetch the HTML content
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }
    
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract page title
    const title = document.title || "";
    
    // Extract text content
    const body = document.body;
    const text = body ? body.textContent || "" : "";
    
    // Extract meta tags
    const meta: { [key: string]: string } = {};
    document.querySelectorAll("meta").forEach((metaTag) => {
      const name = metaTag.getAttribute("name") || metaTag.getAttribute("property");
      const content = metaTag.getAttribute("content");
      if (name && content) {
        meta[name] = content;
      }
    });
    
    // Extract headers
    const headers = {
      h1: Array.from(document.querySelectorAll("h1")).map(h => h.textContent || ""),
      h2: Array.from(document.querySelectorAll("h2")).map(h => h.textContent || ""),
      h3: Array.from(document.querySelectorAll("h3")).map(h => h.textContent || ""),
      h4: Array.from(document.querySelectorAll("h4")).map(h => h.textContent || ""),
    };
    
    // Extract links
    const links = Array.from(document.querySelectorAll("a[href]"))
      .map(a => a.getAttribute("href") || "")
      .filter(href => href && !href.startsWith("#") && !href.startsWith("javascript:"));
    
    // Extract schema markup
    const schema: any[] = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((scriptTag) => {
      try {
        const jsonContent = scriptTag.textContent;
        if (jsonContent) {
          const parsed = JSON.parse(jsonContent);
          schema.push(parsed);
        }
      } catch (e) {
        console.error("Error parsing JSON-LD schema:", e);
      }
    });
    
    // Extract last modified date if available
    const lastModified = response.headers.get("last-modified") || undefined;
    
    return {
      url,
      title,
      html,
      text,
      meta,
      headers,
      links,
      schema,
      lastModified
    };
  } catch (error) {
    console.error(`Error fetching website content:`, error);
    throw new Error(`Failed to analyze website: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Interface for advanced analysis options
interface AnalysisOptions {
  competitorContent?: WebsiteContent | null;
  industry?: string;
  contentFocus?: string;
  analysisDepth?: 'standard' | 'advanced';
}

// Function to analyze website content with Llama 3.3
export async function analyzeWebsite(
  content: WebsiteContent, 
  options: AnalysisOptions = {}
): Promise<AnalysisResult> {
  try {
    // For now we'll simulate the Llama 3.3 analysis with a scoring algorithm
    // In a production environment, this would call the actual Llama 3.3 API
    const { competitorContent, industry, contentFocus, analysisDepth = 'standard' } = options;
    
    // Calculate scores for each criterion, adjusting based on options
    const scores: ScoreBreakdown[] = analyzeContent(content);
    
    // Apply industry-specific adjustments if provided
    if (industry) {
      applyIndustrySpecificAdjustments(scores, industry);
    }
    
    // Apply content focus adjustments if provided
    if (contentFocus) {
      applyContentFocusAdjustments(scores, contentFocus);
    }
    
    // Apply deeper analysis if advanced mode
    if (analysisDepth === 'advanced') {
      applyAdvancedAnalysis(scores, content);
    }
    
    // Compare with competitor if provided
    if (competitorContent) {
      applyCompetitorComparison(scores, content, competitorContent);
    }
    
    // Calculate overall score
    const overallScore = calculateWeightedScore(scores);
    
    // Generate score summary by categories
    const scoreSummary: AnalysisScoreSummary[] = [
      {
        category: "Content Quality",
        score: Math.round((scores[0].score + scores[2].score + scores[5].score) / 3)
      },
      {
        category: "Structure",
        score: Math.round((scores[1].score + scores[3].score) / 2)
      },
      {
        category: "User Intent Match",
        score: Math.round((scores[0].score + scores[3].score + scores[4].score) / 3)
      }
    ];
    
    // Generate recommendations
    const recommendations = generateRecommendations(scores, content);
    
    // Generate summary
    const summary = generateSummary(overallScore, scoreSummary, recommendations);
    
    return {
      url: content.url,
      overallScore,
      summary,
      scoreSummary,
      scoreBreakdown: scores,
      recommendations
    };
  } catch (error) {
    console.error("Error analyzing website:", error);
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Helper function to analyze content based on AEO criteria
function analyzeContent(content: WebsiteContent): ScoreBreakdown[] {
  return AEO_CRITERIA.map((criterion) => {
    let score = 0;
    let details = "";
    let example = "";
    
    switch (criterion.factor) {
      case "Question-Based Content": {
        const result = analyzeQuestionBasedContent(content);
        score = result.score;
        example = result.example;
        details = score >= 80 
          ? "Strong FAQ sections with direct answers to common queries" 
          : score >= 60 
            ? "Some question-based content but could be improved"
            : "Limited question-based content";
        break;
      }
      
      case "Structured Data": {
        const result = analyzeStructuredData(content);
        score = result.score;
        example = result.example;
        details = score >= 80 
          ? "Comprehensive schema markup implementation" 
          : score >= 60 
            ? "Basic schema markup present"
            : "Limited implementation of schema markup";
        break;
      }
      
      case "Content Clarity": {
        const result = analyzeContentClarity(content);
        score = result.score;
        example = result.example;
        
        details = score >= 80 
          ? "Clear writing with good formatting and concise points" 
          : score >= 60 
            ? "Reasonably clear content but some improvements needed"
            : "Content lacks clarity and structure";
        break;
      }
      
      case "Semantic Keywords": {
        const result = analyzeSemanticKeywords(content);
        score = result.score;
        example = result.example;
        
        details = score >= 80 
          ? "Excellent use of related terms and semantic context" 
          : score >= 60 
            ? "Good use of related terms but could expand topical coverage"
            : "Limited use of related terms and semantic context";
        break;
      }
      
      case "Content Freshness": {
        const result = analyzeContentFreshness(content);
        score = result.score;
        example = result.example;
        
        details = score >= 80 
          ? "Content is recent and regularly updated" 
          : score >= 60 
            ? "Some content is recent but updates are inconsistent"
            : "Several pages with outdated content";
        break;
      }
      
      case "Authority Signals": {
        const result = analyzeAuthoritySignals(content);
        score = result.score;
        example = result.example;
        
        details = score >= 80 
          ? "Strong authority signals with citations and expert sources" 
          : score >= 60 
            ? "Good citation of sources and expert opinions"
            : "Limited authority signals";
        break;
      }
    }
    
    return {
      factor: criterion.factor,
      score,
      weight: criterion.weight,
      details,
      example
    };
  });
}

// Analysis functions for each criterion
function analyzeQuestionBasedContent(content: WebsiteContent): AnalysisFunctionResult {
  // Count question marks in headers
  const headerQuestions = [
    ...content.headers.h1, 
    ...content.headers.h2, 
    ...content.headers.h3
  ].filter(h => h.includes("?"));
  
  // Look for FAQ schemas
  const hasFaqSchema = content.schema.some(
    s => s["@type"] === "FAQPage" || 
    (s["@graph"] && s["@graph"].some((item: any) => item["@type"] === "FAQPage"))
  );
  
  // Check for FAQ sections in content
  const faqSectionMatch = content.text.match(/faq|frequently asked questions|common questions/gi);
  const hasFaqSection = faqSectionMatch !== null && faqSectionMatch.length > 0;
  
  // Check for question-answer patterns in content
  const textLines = content.text.split(/\n|\r\n/).filter(line => line.trim().length > 0);
  let questionAnswerPairs: { question: string; answer: string }[] = [];
  
  for (let i = 0; i < textLines.length - 1; i++) {
    if (textLines[i].trim().endsWith("?") && textLines[i + 1].trim().length > 20) {
      questionAnswerPairs.push({
        question: textLines[i].trim(),
        answer: textLines[i + 1].trim()
      });
    }
  }
  
  // Calculate score
  let score = 50; // Base score
  
  if (headerQuestions.length > 5) score += 15;
  else if (headerQuestions.length > 2) score += 10;
  else if (headerQuestions.length > 0) score += 5;
  
  if (hasFaqSchema) score += 20;
  if (hasFaqSection) score += 10;
  if (questionAnswerPairs.length > 5) score += 15;
  else if (questionAnswerPairs.length > 2) score += 10;
  else if (questionAnswerPairs.length > 0) score += 5;
  
  // Find the best example
  let example = "No question-based content found";
  
  // First try to get a question from the header
  if (headerQuestions.length > 0) {
    example = `Header question: "${headerQuestions[0]}"`;
  }
  // Then try to get a question-answer pair
  else if (questionAnswerPairs.length > 0) {
    const pair = questionAnswerPairs[0];
    example = `Q: "${pair.question.substring(0, 120)}${pair.question.length > 120 ? '...' : ''}"`;
  }
  // If nothing else, mention FAQ schema if present
  else if (hasFaqSchema) {
    example = "Page has FAQ schema markup but no visible questions found";
  }
  
  return { 
    score: Math.min(Math.max(score, 0), 100),
    example 
  };
}

function analyzeStructuredData(content: WebsiteContent): AnalysisFunctionResult {
  if (!content.schema || content.schema.length === 0) {
    return { 
      score: 30, // Basic score for no schema
      example: "No schema markup found on page" 
    };
  }
  
  const schemaTypes = new Set<string>();
  let schemaExample = "";
  
  // Flatten schema and collect all types
  content.schema.forEach(schema => {
    if (schema["@type"]) {
      schemaTypes.add(schema["@type"]);
      
      // Get a sample of the first schema that has a meaningful type
      if (!schemaExample && schema["@type"]) {
        // Create a simplified example
        const type = schema["@type"];
        if (typeof type === 'string') {
          schemaExample = `Type: ${type}`;
          
          // Add a name property if available
          if (schema.name) {
            schemaExample += `, Name: "${schema.name}"`;
          }
          
          // For FAQ, include a sample question if available
          if (type === "FAQPage" && schema.mainEntity && Array.isArray(schema.mainEntity)) {
            const question = schema.mainEntity[0]?.name;
            if (question) {
              schemaExample += `, Sample question: "${question}"`;
            }
          }
        }
      }
    }
    
    if (schema["@graph"] && Array.isArray(schema["@graph"])) {
      schema["@graph"].forEach((item: any) => {
        if (item["@type"]) {
          schemaTypes.add(item["@type"]);
          
          // If we haven't found an example yet, use this one
          if (!schemaExample) {
            const type = item["@type"];
            if (typeof type === 'string') {
              schemaExample = `Type: ${type}`;
              
              // Add name if available
              if (item.name) {
                schemaExample += `, Name: "${item.name}"`;
              }
            }
          }
        }
      });
    }
  });
  
  // Valuable schema types for AEO
  const aeoRelevantTypes = [
    "FAQPage", "HowTo", "Article", "WebPage", "Product", "ItemList", 
    "BreadcrumbList", "Organization", "WebSite", "Person"
  ];
  
  const hasRelevantTypes = aeoRelevantTypes.filter(type => 
    schemaTypes.has(type)
  );
  
  // Calculate score
  let score = 40; // Base score for having any schema
  
  // More points for more types of schema
  if (schemaTypes.size >= 5) score += 15;
  else if (schemaTypes.size >= 3) score += 10;
  else if (schemaTypes.size >= 1) score += 5;
  
  // More points for AEO-relevant schema types
  if (hasRelevantTypes.length >= 5) score += 25;
  else if (hasRelevantTypes.length >= 3) score += 15;
  else if (hasRelevantTypes.length >= 1) score += 10;
  
  // Bonus for FAQ or HowTo schemas
  if (schemaTypes.has("FAQPage")) score += 10;
  if (schemaTypes.has("HowTo")) score += 10;
  
  // If we couldn't extract a specific example, list the schema types
  if (!schemaExample && schemaTypes.size > 0) {
    schemaExample = `Found ${schemaTypes.size} schema types: ${Array.from(schemaTypes).join(", ")}`;
  }
  
  return { 
    score: Math.min(Math.max(score, 0), 100),
    example: schemaExample || "Schema markup present but couldn't extract details" 
  };
}

function analyzeContentClarity(content: WebsiteContent): AnalysisFunctionResult {
  // Check for short paragraphs (clarity indicator)
  const paragraphs = content.text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / (paragraphs.length || 1);
  
  // Check for bulleted/numbered lists (clarity indicator)
  const hasListElements = content.html.includes("<li>") && 
    (content.html.includes("<ul>") || content.html.includes("<ol>"));
  
  // Check for subheadings ratio (structure indicator)
  const contentLength = content.text.length;
  const headingsCount = content.headers.h1.length + content.headers.h2.length + 
    content.headers.h3.length + content.headers.h4.length;
  const headingsRatio = (headingsCount * 1000) / contentLength;
  
  // Check for highlighted text (emphasis indicator)
  const hasHighlightedText = content.html.includes("<strong>") || 
    content.html.includes("<b>") || 
    content.html.includes("<em>") || 
    content.html.includes("<i>");
  
  // Calculate score
  let score = 50; // Base score
  
  // Short paragraphs are better for clarity
  if (avgParagraphLength < 400) score += 15;
  else if (avgParagraphLength < 800) score += 10;
  else if (avgParagraphLength < 1200) score += 5;
  
  // Lists improve readability
  if (hasListElements) score += 10;
  
  // Good heading ratio improves structure
  if (headingsRatio > 2 && headingsRatio < 10) score += 15;
  else if (headingsRatio > 0.5) score += 10;
  
  // Highlighted text improves scanability
  if (hasHighlightedText) score += 10;
  
  // Extract examples for clarity features
  let example = "";
  
  // Try to find a good example of content clarity based on which features are present
  if (hasListElements) {
    // Try to extract a list example
    const listRegex = /<[ou]l[^>]*>[\s\S]*?<\/[ou]l>/i;
    const listMatch = content.html.match(listRegex);
    if (listMatch) {
      // Extract just the first few list items to keep it concise
      const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const items = [];
      let match;
      let count = 0;
      while ((match = itemRegex.exec(listMatch[0])) !== null && count < 2) {
        items.push(match[1].replace(/<[^>]*>/g, '').trim());
        count++;
      }
      if (items.length > 0) {
        example = `List structure: "${items.join(', ')}${items.length < count ? '...' : ''}"`;
      }
    }
  } else if (headingsRatio > 1) {
    // Get an example of heading structure
    const headings = [...content.headers.h1, ...content.headers.h2, ...content.headers.h3].slice(0, 2);
    if (headings.length > 0) {
      example = `Heading structure: "${headings.join(' → ')}"`;
    }
  } else if (paragraphs.length > 0) {
    // Show short paragraph example
    const shortestParagraph = paragraphs
      .filter(p => p.length > 20) // Avoid very short fragments
      .sort((a, b) => a.length - b.length)[0] || paragraphs[0];
      
    if (shortestParagraph) {
      const truncated = shortestParagraph.substring(0, 100);
      example = `Paragraph example: "${truncated}${truncated.length < shortestParagraph.length ? '...' : ''}"`;
    }
  }
  
  // If no specific example was found, provide generic feedback based on score
  if (!example) {
    if (score >= 80) {
      example = "Well-structured content with good use of headings and formatting";
    } else if (score >= 60) {
      example = "Reasonably structured content but could improve readability";
    } else {
      example = "Content structure needs improvement for better readability";
    }
  }
  
  return {
    score: Math.min(Math.max(score, 0), 100),
    example
  };
}

function analyzeSemanticKeywords(content: WebsiteContent): AnalysisFunctionResult {
  // For a proper implementation, this would analyze content for semantic keywords
  // using NLP techniques. For this demo, we'll use a simpler approach.
  
  // Extract potential main keywords from title and headers
  const title = content.title.toLowerCase();
  const headers = [
    ...content.headers.h1,
    ...content.headers.h2
  ].map(h => h.toLowerCase());
  
  // For demo purposes, we'll check for keywords related to common web topics
  const semanticGroups = [
    // SEO related terms
    ["seo", "search engine", "ranking", "keyword", "backlink", "serp", "crawl", "index"],
    // Marketing related terms
    ["marketing", "campaign", "audience", "conversion", "funnel", "lead", "brand", "strategy"],
    // Tech related terms
    ["technology", "software", "code", "development", "programming", "app", "website", "data"],
    // Business related terms
    ["business", "company", "startup", "entrepreneur", "profit", "revenue", "service", "product"],
    // E-commerce related terms
    ["shop", "store", "product", "price", "discount", "shipping", "cart", "purchase"]
  ];
  
  // Check text for related term coverage
  let totalMatchedGroups = 0;
  let totalTermMatches = 0;
  let matchedTerms: Record<string, number> = {};
  let bestMatchedGroup: { name: string, terms: string[] } | null = null;
  
  const groupNames = ["SEO", "Marketing", "Technology", "Business", "E-commerce"];
  
  for (let i = 0; i < semanticGroups.length; i++) {
    const group = semanticGroups[i];
    let groupMatches = 0;
    let groupMatchedTerms: string[] = [];
    
    for (const term of group) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = (content.text.match(regex) || []).length;
      
      if (matches > 0) {
        groupMatches++;
        totalTermMatches += matches;
        matchedTerms[term] = matches;
        groupMatchedTerms.push(term);
      }
    }
    
    // If a group has multiple terms present, count it as a semantic match
    if (groupMatches >= 3) {
      totalMatchedGroups++;
      
      // Track the group with the most matches to use as an example
      if (!bestMatchedGroup || groupMatchedTerms.length > bestMatchedGroup.terms.length) {
        bestMatchedGroup = {
          name: groupNames[i],
          terms: groupMatchedTerms
        };
      }
    }
  }
  
  // Calculate score
  let score = 40; // Base score
  
  // More points for more semantic groups covered
  if (totalMatchedGroups >= 3) score += 25;
  else if (totalMatchedGroups >= 2) score += 15;
  else if (totalMatchedGroups >= 1) score += 10;
  
  // More points for more total term matches (depth of coverage)
  if (totalTermMatches >= 20) score += 25;
  else if (totalTermMatches >= 10) score += 15;
  else if (totalTermMatches >= 5) score += 10;
  
  // Check meta keywords if available
  if (content.meta && content.meta.keywords && content.meta.keywords.length > 10) {
    score += 10;
  }
  
  // Generate example based on findings
  let example = "";
  
  // First try to use meta keywords if available
  if (content.meta && content.meta.keywords) {
    example = `Meta keywords: "${content.meta.keywords.substring(0, 100)}${content.meta.keywords.length > 100 ? '...' : ''}"`;
  }
  // Then try to use matched semantic group
  else if (bestMatchedGroup) {
    example = `${bestMatchedGroup.name} semantic terms found: ${bestMatchedGroup.terms.slice(0, 5).join(', ')}${bestMatchedGroup.terms.length > 5 ? '...' : ''}`;
  }
  // Or title keywords
  else if (title) {
    example = `Title keyword context: "${title}"`;
  }
  // If nothing else, use generic message based on score
  else {
    if (score >= 80) {
      example = "Strong semantic keyword coverage";
    } else if (score >= 60) {
      example = "Adequate semantic keyword usage";
    } else {
      example = "Limited semantic keyword coverage";
    }
  }
  
  return {
    score: Math.min(Math.max(score, 0), 100),
    example
  };
}

function analyzeContentFreshness(content: WebsiteContent): AnalysisFunctionResult {
  // Check for last modified header
  let lastModifiedDate: Date | null = null;
  
  if (content.lastModified) {
    lastModifiedDate = new Date(content.lastModified);
  }
  
  // Look for dates in content
  const dateRegex = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2},? \d{4}\b/gi;
  const dateMatches = content.text.match(dateRegex) || [];
  
  let contentDates: Date[] = [];
  let contentDateStrings: string[] = [];
  
  for (let i = 0; i < dateMatches.length; i++) {
    const match = dateMatches[i];
    try {
      const date = new Date(match);
      if (!isNaN(date.getTime())) {
        contentDates.push(date);
        contentDateStrings.push(match);
      }
    } catch (e) {
      // Ignore invalid dates
    }
  }
  
  // Sort dates in descending order (with their string representations)
  const sortedDates = contentDates
    .map((date, index) => ({ date, string: contentDateStrings[index] }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Get the most recent date
  let mostRecentDate: Date | null = null;
  let mostRecentDateString: string | null = null;
  
  if (sortedDates.length > 0) {
    mostRecentDate = sortedDates[0].date;
    mostRecentDateString = sortedDates[0].string;
  }
  
  if (lastModifiedDate && (!mostRecentDate || lastModifiedDate > mostRecentDate)) {
    mostRecentDate = lastModifiedDate;
    mostRecentDateString = lastModifiedDate.toDateString();
  }
  
  // Calculate score based on recency
  let score = 50; // Base score
  
  if (mostRecentDate) {
    const now = new Date();
    const ageInDays = (now.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (ageInDays < 30) {
      // Less than a month old - excellent
      score = 90;
    } else if (ageInDays < 90) {
      // Less than 3 months old - very good
      score = 80;
    } else if (ageInDays < 180) {
      // Less than 6 months old - good
      score = 70;
    } else if (ageInDays < 365) {
      // Less than a year old - average
      score = 60;
    } else {
      // More than a year old - poor
      score = 40;
    }
  } else {
    // No dates found - below average
    score = 40;
  }
  
  // Check for time-based terms indicating freshness
  const freshnessTerms = ["new", "update", "recent", "latest", "current year", "now", "today"];
  let freshnessMatches = 0;
  let freshnessMatchExamples: string[] = [];
  
  for (const term of freshnessTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.text.match(regex);
    if (matches && matches.length > 0) {
      freshnessMatches++;
      
      // Try to get a short context around the term
      const termIndex = content.text.toLowerCase().indexOf(term.toLowerCase());
      if (termIndex >= 0) {
        const start = Math.max(0, termIndex - 20);
        const end = Math.min(content.text.length, termIndex + term.length + 30);
        const context = content.text.substring(start, end).trim();
        freshnessMatchExamples.push(`"${context}"`);
      }
    }
  }
  
  // Adjust score based on freshness terms
  if (freshnessMatches >= 4) score += 10;
  else if (freshnessMatches >= 2) score += 5;
  
  // Create example based on what was found
  let example = "";
  
  if (mostRecentDateString) {
    example = `Most recent date found: ${mostRecentDateString}`;
    
    if (content.lastModified) {
      example += ` (from Last-Modified header)`;
    }
  } else if (freshnessMatchExamples.length > 0) {
    example = `Freshness indicator: ${freshnessMatchExamples[0]}`;
  } else {
    example = "No clear date indicators found in content";
  }
  
  return {
    score: Math.min(Math.max(score, 0), 100),
    example
  };
}

function analyzeAuthoritySignals(content: WebsiteContent): AnalysisFunctionResult {
  // Check for author information
  const hasAuthorInfo = content.html.includes("author") || 
    content.html.includes("byline") || 
    content.schema.some(s => s["@type"] === "Person");
  
  // Extract author info if available
  let authorExample = "";
  const authorRegex = /<[^>]*author[^>]*>(.*?)<\/[^>]*>/i;
  const authorMatch = content.html.match(authorRegex);
  if (authorMatch && authorMatch[1]) {
    authorExample = authorMatch[1].replace(/<[^>]*>/g, '').trim();
  } else if (content.schema.some(s => s["@type"] === "Person" && s.name)) {
    const personSchema = content.schema.find(s => s["@type"] === "Person" && s.name);
    if (personSchema) {
      authorExample = `${personSchema.name}`;
      if (personSchema.jobTitle) {
        authorExample += `, ${personSchema.jobTitle}`;
      }
    }
  }
  
  // Check for citations and references
  const hasCitations = content.html.includes("cite") || 
    content.html.toLowerCase().includes("source:") || 
    content.html.toLowerCase().includes("reference:");
  
  // Try to extract a citation example
  let citationExample = "";
  const citeRegex = /<cite[^>]*>(.*?)<\/cite>/i;
  const citeMatch = content.html.match(citeRegex);
  if (citeMatch && citeMatch[1]) {
    citationExample = citeMatch[1].replace(/<[^>]*>/g, '').trim();
  } else {
    // Look for "source:" or "reference:" patterns
    const sourceRegex = /(?:source|reference):\s*([^.,\n]+)/i;
    const sourceMatch = content.text.match(sourceRegex);
    if (sourceMatch && sourceMatch[1]) {
      citationExample = sourceMatch[1].trim();
    }
  }
  
  // Check for outbound links to authority sites
  const links = content.links;
  const authorityDomains = [
    "wikipedia.org", "gov", "edu", "harvard", "stanford", "mit",
    "bbc", "nytimes", "reuters", "bloomberg", "wsj", "economist"
  ];
  
  let authorityLinks = 0;
  let authorityLinkExample = "";
  
  for (const link of links) {
    for (const domain of authorityDomains) {
      if (link.includes(domain)) {
        authorityLinks++;
        if (!authorityLinkExample) {
          authorityLinkExample = link;
        }
        break;
      }
    }
  }
  
  // Check for credentials and expertise markers
  const expertiseMarkers = [
    "phd", "professor", "expert", "specialist", "professional", 
    "certified", "licensed", "years of experience", "research"
  ];
  
  let expertiseMatches = 0;
  let expertiseExample = "";
  
  for (const marker of expertiseMarkers) {
    const regex = new RegExp(`[^.]*\\b${marker}\\b[^.]*\.`, 'gi');
    const matches = content.text.match(regex);
    if (matches && matches.length > 0) {
      expertiseMatches++;
      if (!expertiseExample) {
        expertiseExample = matches[0].trim();
      }
    }
  }
  
  // Calculate score
  let score = 40; // Base score
  
  if (hasAuthorInfo) score += 15;
  if (hasCitations) score += 15;
  
  if (authorityLinks >= 5) score += 20;
  else if (authorityLinks >= 3) score += 15;
  else if (authorityLinks >= 1) score += 10;
  
  if (expertiseMatches >= 3) score += 10;
  else if (expertiseMatches >= 1) score += 5;
  
  // Generate example based on findings
  let example = "";
  
  if (authorExample) {
    example = `Author: ${authorExample}`;
  } else if (authorityLinkExample) {
    example = `Authority link: ${authorityLinkExample}`;
  } else if (citationExample) {
    example = `Citation: ${citationExample}`;
  } else if (expertiseExample) {
    example = `Expertise indicator: "${expertiseExample}"`;
  } else {
    example = "No clear authority signals found";
  }
  
  return {
    score: Math.min(Math.max(score, 0), 100),
    example
  };
}

// Function to generate recommendations based on scores
function generateRecommendations(scores: ScoreBreakdown[], content: WebsiteContent): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Find worst and best scores
  scores.sort((a, b) => a.score - b.score);
  const worstScores = scores.slice(0, 2);
  
  scores.sort((a, b) => b.score - a.score);
  const bestScores = scores.slice(0, 1);
  
  // Add recommendations for worst scores
  worstScores.forEach(score => {
    if (score.score < 70) {
      let recType = score.score < 50 ? RecommendationType.Critical : RecommendationType.Warning;
      let title = "";
      let description = "";
      let action = "";
      
      switch (score.factor) {
        case "Question-Based Content":
          title = "Improve Question-Based Content";
          description = "Your site lacks content that directly answers common user questions. AI engines prefer content structured as questions and answers.";
          action = "Add FAQ sections and question-based headers";
          break;
        
        case "Structured Data":
          title = "Improve Schema Markup";
          description = "Your site lacks comprehensive schema markup, especially FAQ and HowTo schemas that help AI engines understand your content structure.";
          action = "Implement JSON-LD schema for key content sections";
          break;
        
        case "Content Clarity":
          title = "Enhance Content Clarity";
          description = "Your content could be better structured with shorter paragraphs, bullet points, and clear headings to make it more digestible for AI engines.";
          action = "Break up content with clearer structure and formatting";
          break;
        
        case "Semantic Keywords":
          title = "Expand Semantic Keyword Coverage";
          description = "Your content lacks sufficient related terms and contextual keywords that help AI engines understand the topic depth.";
          action = "Add more related terms and contextual keywords";
          break;
        
        case "Content Freshness":
          title = "Content Freshness Issue";
          description = "Several key pages haven't been updated recently. AI engines favor fresh, current content when providing answers.";
          action = "Update content regularly with current information";
          break;
        
        case "Authority Signals":
          title = "Boost Authority Signals";
          description = "Your content lacks sufficient authority indicators like citations, expert opinions, or credentials that help AI engines trust your content.";
          action = "Add citations and expert perspectives to build credibility";
          break;
      }
      
      recommendations.push({
        type: recType,
        title,
        description,
        action
      });
    }
  });
  
  // Add positive recommendation for best score
  bestScores.forEach(score => {
    if (score.score >= 80) {
      let title = "";
      let description = "";
      
      switch (score.factor) {
        case "Question-Based Content":
          title = "Excellent Question-Based Content";
          description = "Your site's FAQ sections and header structure effectively address user questions, making it easy for AI engines to extract answers.";
          break;
        
        case "Structured Data":
          title = "Strong Schema Implementation";
          description = "Your site's structured data provides clear signals to AI engines about your content's purpose and organization.";
          break;
        
        case "Content Clarity":
          title = "Highly Readable Content";
          description = "Your content's clear structure and formatting makes it easy for AI engines to parse and understand.";
          break;
        
        case "Semantic Keywords":
          title = "Rich Semantic Coverage";
          description = "Your content effectively uses related terms and contextual keywords, helping AI engines understand topic depth.";
          break;
        
        case "Content Freshness":
          title = "Excellently Updated Content";
          description = "Your site's recent updates signal relevance and freshness to AI engines, improving ranking potential.";
          break;
        
        case "Authority Signals":
          title = "Strong Authority Indicators";
          description = "Your content includes excellent citations and expertise markers that help establish credibility with AI systems.";
          break;
      }
      
      recommendations.push({
        type: RecommendationType.Positive,
        title,
        description,
        action: "Keep this up"
      });
    }
  });
  
  // If we don't have at least 3 recommendations, add generic ones
  if (recommendations.length < 3) {
    // Check if we need to add schema recommendation
    if (!recommendations.some(r => r.title.includes("Schema"))) {
      const hasMinimalSchema = content.schema && content.schema.length > 0;
      
      if (!hasMinimalSchema) {
        recommendations.push({
          type: RecommendationType.Warning,
          title: "Add Basic Schema Markup",
          description: "Your site is missing basic schema markup that helps AI engines understand your content's structure and purpose.",
          action: "Implement basic JSON-LD schema for your content"
        });
      }
    }
    
    // Check if we need to add freshness recommendation
    if (!recommendations.some(r => r.title.includes("Freshness"))) {
      recommendations.push({
        type: RecommendationType.Warning,
        title: "Consider Content Updates",
        description: "Regular content updates signal relevance to AI engines and improve your chances of being featured in answers.",
        action: "Establish a content update schedule for key pages"
      });
    }
  }
  
  return recommendations;
}

// Helper function for industry-specific adjustments
function applyIndustrySpecificAdjustments(scores: ScoreBreakdown[], industry: string): void {
  // Different industries have different AEO priorities
  switch(industry.toLowerCase()) {
    case 'e-commerce':
      // E-commerce sites need better structured data and semantic markup
      adjustScoreForFactor(scores, 'Structured Data', 10);
      adjustScoreForFactor(scores, 'Semantic Keywords', 5);
      break;
      
    case 'healthcare':
      // Healthcare sites need authority signals and content clarity
      adjustScoreForFactor(scores, 'Authority Signals', 15);
      adjustScoreForFactor(scores, 'Content Clarity', 10);
      break;
      
    case 'finance':
      // Finance sites need freshness and authority
      adjustScoreForFactor(scores, 'Content Freshness', 15);
      adjustScoreForFactor(scores, 'Authority Signals', 10);
      break;
      
    case 'education':
      // Education sites need question-based content and clarity
      adjustScoreForFactor(scores, 'Question-Based Content', 15);
      adjustScoreForFactor(scores, 'Content Clarity', 10);
      break;
      
    case 'technology':
      // Tech sites need freshness and semantic richness
      adjustScoreForFactor(scores, 'Content Freshness', 10);
      adjustScoreForFactor(scores, 'Semantic Keywords', 10);
      break;
      
    // Add more industries as needed
  }
}

// Helper function for content focus adjustments
function applyContentFocusAdjustments(scores: ScoreBreakdown[], contentFocus: string): void {
  switch(contentFocus.toLowerCase()) {
    case 'educational':
      // Educational content needs question-based structure and clarity
      adjustScoreForFactor(scores, 'Question-Based Content', 15);
      adjustScoreForFactor(scores, 'Content Clarity', 10);
      break;
      
    case 'informational':
      // Informational content needs semantic richness and authority
      adjustScoreForFactor(scores, 'Semantic Keywords', 10);
      adjustScoreForFactor(scores, 'Authority Signals', 10);
      break;
      
    case 'transactional':
      // Transactional content needs structured data and freshness
      adjustScoreForFactor(scores, 'Structured Data', 15);
      adjustScoreForFactor(scores, 'Content Freshness', 10);
      break;
      
    case 'news':
      // News content needs freshness and authority
      adjustScoreForFactor(scores, 'Content Freshness', 20);
      adjustScoreForFactor(scores, 'Authority Signals', 15);
      break;
      
    case 'how-to':
      // How-to content needs clarity and question-based structure
      adjustScoreForFactor(scores, 'Content Clarity', 15);
      adjustScoreForFactor(scores, 'Question-Based Content', 10);
      break;
      
    // Add more content types as needed
  }
}

// Helper function for advanced analysis
function applyAdvancedAnalysis(scores: ScoreBreakdown[], content: WebsiteContent): void {
  // Advanced analysis performs deeper checks and has higher standards
  
  // Check for well-formed headings hierarchy (H1 -> H2 -> H3)
  if (content.headers.h1.length === 1 && content.headers.h2.length > 1) {
    // Good heading hierarchy
    adjustScoreForFactor(scores, 'Content Clarity', 5);
  }
  
  // Check for image alt text
  const imgAltRegex = /<img[^>]*alt="([^"]*)"[^>]*>/g;
  const imgTags = content.html.match(/<img[^>]*>/g) || [];
  const imgWithAlt = content.html.match(imgAltRegex) || [];
  
  if (imgTags.length > 0 && imgWithAlt.length / imgTags.length > 0.8) {
    // Most images have alt text
    adjustScoreForFactor(scores, 'Content Clarity', 5);
  }
  
  // Check for external links to authority sites
  const authorityDomains = [
    "wikipedia.org", "gov", "edu", "harvard", "stanford", "mit",
    "bbc", "nytimes", "reuters", "bloomberg", "wsj", "economist"
  ];
  
  let authorityLinks = 0;
  for (const link of content.links) {
    for (const domain of authorityDomains) {
      if (link.includes(domain)) {
        authorityLinks++;
        break;
      }
    }
  }
  
  if (authorityLinks >= 3) {
    adjustScoreForFactor(scores, 'Authority Signals', 10);
  }
}

// Helper function for competitor comparison
function applyCompetitorComparison(
  scores: ScoreBreakdown[], 
  content: WebsiteContent, 
  competitorContent: WebsiteContent
): void {
  // Compare current site to competitor site
  const competitorScores = analyzeContent(competitorContent);
  
  // Adjust scores based on comparison
  for (let i = 0; i < scores.length; i++) {
    const currentScore = scores[i].score;
    const competitorScore = competitorScores[i].score;
    
    // If competitor is better in this area, be more critical
    if (competitorScore > currentScore + 15) {
      // Competitor is significantly better, reduce score a bit more
      adjustScoreForFactor(scores, scores[i].factor, -5);
      
      // Update details to mention competitor comparison
      scores[i].details += ` Your competitor performs better in this area.`;
      
      // If there's example from competitor, make a note of it
      if (competitorScores[i].example) {
        scores[i].example = scores[i].example || "Competitor example: " + competitorScores[i].example;
      }
    } 
    // If current site is better, be more positive
    else if (currentScore > competitorScore + 15) {
      // Current site is significantly better, increase score a bit
      adjustScoreForFactor(scores, scores[i].factor, 5);
      
      // Update details to mention competitor comparison
      scores[i].details += ` You outperform your competitor in this area.`;
    }
  }
}

// Helper function to adjust score for a specific factor
function adjustScoreForFactor(scores: ScoreBreakdown[], factorName: string, adjustment: number): void {
  const factor = scores.find(s => s.factor === factorName);
  if (factor) {
    factor.score = Math.min(Math.max(factor.score + adjustment, 0), 100);
  }
}

function generateSummary(score: number, categorySummary: AnalysisScoreSummary[], recommendations: Recommendation[]): string {
  let summaryText = "";
  
  if (score >= 80) {
    summaryText = "Your website is well-optimized for AI answer engines. ";
  } else if (score >= 60) {
    summaryText = "Your website is moderately optimized for AI answer engines, but there's room for improvement. ";
  } else {
    summaryText = "Your website needs significant optimization for AI answer engines. ";
  }
  
  // Add category-specific insights
  const bestCategory = [...categorySummary].sort((a, b) => b.score - a.score)[0];
  const worstCategory = [...categorySummary].sort((a, b) => a.score - b.score)[0];
  
  summaryText += `Your strongest area is ${bestCategory.category} (${bestCategory.score}/100), while ${worstCategory.category} (${worstCategory.score}/100) could use the most improvement. `;
  
  // Add recommendation preview
  const criticalRecs = recommendations.filter(r => r.type === RecommendationType.Critical);
  
  if (criticalRecs.length > 0) {
    summaryText += `Our analysis with Llama 3.3 identified ${criticalRecs.length} critical issues that need immediate attention.`;
  } else {
    summaryText += `Our analysis with Llama 3.3 identified several key areas where you can enhance your AEO performance.`;
  }
  
  return summaryText;
}
