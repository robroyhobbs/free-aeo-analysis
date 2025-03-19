import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

// Constants
const DEFAULT_TITLE = 'Free AEO Analysis - AI-Powered Website Analysis';
const DEFAULT_DESCRIPTION = 'Analyze your website for Answer Engine Optimization (AEO) and AI readiness. Get actionable insights and improve your visibility in AI-powered search.';
const DEFAULT_KEYWORDS = 'AEO, Answer Engine Optimization, AI optimization, website analysis, SEO, content optimization';
const DOMAIN = 'https://free-aeo-analysis.com';
const STRUCTURED_DATA_ID = 'structured-data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
  structuredData?: Record<string, any> | null;
}

export function SEO({ 
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = '',
  ogType = 'website',
  canonical = '',
  structuredData = undefined
}: SEOProps) {
  const [location] = useLocation();
  const fullTitle = `${title} | free-aeo-analysis.com`;
  const fullCanonical = canonical ? `${DOMAIN}${canonical}` : `${DOMAIN}${location}`;
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`) : '';
  
  // Memoized helper functions using useCallback
  const updateMetaTag = useCallback((name: string, content: string) => {
    const selector = `meta[${name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name'}="${name}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      const attributeName = name.startsWith('og:') || name.startsWith('twitter:') ? 'property' : 'name';
      meta.setAttribute(attributeName, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }, []);
  
  const updateCanonicalLink = useCallback((href: string) => {
    let link = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', href);
  }, []);
  
  const addStructuredData = useCallback((data: Record<string, any>) => {
    removeStructuredData();
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = STRUCTURED_DATA_ID;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }, []);
  
  const removeStructuredData = useCallback(() => {
    const script = document.getElementById(STRUCTURED_DATA_ID);
    if (script) {
      script.remove();
    }
  }, []);

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:url', fullCanonical);
    if (fullOgImage) {
      updateMetaTag('og:image', fullOgImage);
    }
    
    // Update Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    if (fullOgImage) {
      updateMetaTag('twitter:image', fullOgImage);
    }
    
    // Update canonical link
    updateCanonicalLink(fullCanonical);
    
    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    } else {
      removeStructuredData();
    }
    
    return () => {
      removeStructuredData();
    };
  }, [
    title, 
    description, 
    keywords, 
    ogImage, 
    ogType, 
    location, 
    canonical, 
    structuredData,
    fullTitle,
    fullCanonical,
    fullOgImage,
    updateMetaTag,
    updateCanonicalLink,
    addStructuredData,
    removeStructuredData
  ]);
  
  return null;
}