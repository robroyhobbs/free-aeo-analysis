// Schema.org structured data helpers for SEO
import { BlogPost } from "@/blog/blog-data";

// Website organization schema
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Free AEO Analysis",
    "url": "https://free-aeo-analysis.com",
    "logo": "https://free-aeo-analysis.com/logo.png",
    "description": "Free tools and resources for optimizing your website for Answer Engine Optimization (AEO) and AI readiness."
  };
}

// Home page schema
export function getHomePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://free-aeo-analysis.com",
    "name": "Free AEO Analysis",
    "description": "Analyze your website for Answer Engine Optimization (AEO) and AI readiness. Get actionable insights and improve your visibility in AI-powered search.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://free-aeo-analysis.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

// FAQPage schema
export function getFaqPageSchema(faqItems: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

// Blog article schema
export function getBlogPostSchema(post: BlogPost) {
  const authorName = post.author?.name || "AEO Analysis Team";
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.coverImage,
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "Free AEO Analysis",
      "logo": {
        "@type": "ImageObject",
        "url": "https://free-aeo-analysis.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://free-aeo-analysis.com/blog/${post.slug}`
    },
    "keywords": post.tags.join(", ")
  };
}

// Blog index page schema
export function getBlogIndexSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "AEO Blog Articles",
    "description": "Articles and guides about Answer Engine Optimization (AEO) and optimizing your content for AI assistants.",
    "url": "https://free-aeo-analysis.com/blog",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://free-aeo-analysis.com/blog/${post.slug}`,
        "name": post.title
      }))
    }
  };
}

// Guide page schema
export function getGuidePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "The Ultimate Guide to Answer Engine Optimization (AEO)",
    "description": "A comprehensive guide to optimizing your content for AI assistants and answer engines.",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Understanding AEO",
        "text": "Learn what Answer Engine Optimization is and why it matters for your content strategy."
      },
      {
        "@type": "HowToStep",
        "name": "Question-Based Content",
        "text": "Structure your content around questions that users ask AI assistants."
      },
      {
        "@type": "HowToStep",
        "name": "Implementing Structured Data",
        "text": "Add schema markup to help AI systems understand your content better."
      },
      {
        "@type": "HowToStep",
        "name": "Measuring Success",
        "text": "Track your performance with AEO-specific metrics and KPIs."
      }
    ]
  };
}