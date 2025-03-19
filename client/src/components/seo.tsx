import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';

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
  title = 'Free AEO Analysis - AI-Powered Website Analysis',
  description = 'Analyze your website for Answer Engine Optimization (AEO) and AI readiness. Get actionable insights and improve your visibility in AI-powered search.',
  keywords = 'AEO, Answer Engine Optimization, AI optimization, website analysis, SEO, content optimization',
  ogImage = '',
  ogType = 'website',
  canonical = '',
  structuredData = undefined
}: SEOProps) {
  const [location] = useLocation();
  const domain = 'https://free-aeo-analysis.com';
  const fullTitle = title + ' | free-aeo-analysis.com';
  const fullCanonical = canonical ? `${domain}${canonical}` : `${domain}${location}`;
  const fullOgImage = ogImage ? (ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`) : '';

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
      // Clean up structured data when component unmounts
      removeStructuredData();
    };
  }, [title, description, keywords, ogImage, ogType, location, canonical, structuredData]);
  
  return null;
}

// Helper functions
function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name);
    } else {
      meta.setAttribute('name', name);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', href);
}

function addStructuredData(data: Record<string, any>) {
  removeStructuredData(); // Remove any existing structured data
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'structured-data';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeStructuredData() {
  const script = document.getElementById('structured-data');
  if (script) {
    script.remove();
  }
}