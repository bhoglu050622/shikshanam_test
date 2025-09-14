// CMS Content Management System
// This file handles fetching content from the CMS API

import { useState, useEffect } from 'react';

interface CMSContent {
  mainTitle?: string;
  subtitle?: string;
  question?: string;
  buttonText?: string;
  [key: string]: any;
}

interface ContentStorage {
  [filePath: string]: {
    content: string;
    lastUpdated: string;
    message: string;
  };
}

// Cache for content to avoid repeated API calls
let contentCache: { [key: string]: CMSContent } = {};
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Parse CMS content string into structured data
function parseCMSContent(contentString: string): CMSContent {
  const content: CMSContent = {};
  
  if (!contentString) return content;
  
  const lines = contentString.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    // Parse key-value pairs
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = trimmedLine.substring(0, colonIndex).trim().toLowerCase();
    const value = trimmedLine.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    
    switch (key) {
      case 'main title':
        content.mainTitle = value;
        break;
      case 'subtitle':
        content.subtitle = value;
        break;
      case 'question':
        content.question = value;
        break;
      case 'button text':
        content.buttonText = value;
        break;
      default:
        content[key] = value;
    }
  }
  
  return content;
}

// Fetch content from CMS API
async function fetchContentFromCMS(filePath: string): Promise<CMSContent> {
  try {
    // Check cache first
    const now = Date.now();
    if (contentCache[filePath] && (now - cacheTimestamp) < CACHE_DURATION) {
      return contentCache[filePath];
    }
    
    // Fetch from CMS API
    const response = await fetch(`https://cms-admin-q4bv31v7n-amanamns-projects.vercel.app/api/content?filePath=${encodeURIComponent(filePath)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add authentication headers if needed
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch CMS content for ${filePath}:`, response.status);
      return {};
    }
    
    const data = await response.json();
    
    if (data.success && data.content) {
      const parsedContent = parseCMSContent(data.content);
      contentCache[filePath] = parsedContent;
      cacheTimestamp = now;
      return parsedContent;
    }
    
    return {};
  } catch (error) {
    console.warn(`Error fetching CMS content for ${filePath}:`, error);
    return {};
  }
}

// Get content for a specific component
export async function getCMSContent(filePath: string): Promise<CMSContent> {
  return await fetchContentFromCMS(filePath);
}

// Clear cache (useful for development)
export function clearContentCache(): void {
  contentCache = {};
  cacheTimestamp = 0;
}

// Default content fallbacks
export const defaultContent: { [key: string]: CMSContent } = {
  'components/sections/Hero.tsx': {
    mainTitle: 'Welcome to Ancient Wisdom',
    subtitle: 'Where Technology meets Tradition',
    question: 'What are you looking for?',
    buttonText: 'Explore Now'
  }
};

// Hook for React components to use CMS content
export function useCMSContent(filePath: string) {
  const [content, setContent] = useState<CMSContent>(defaultContent[filePath] || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);
        setError(null);
        
        const cmsContent = await getCMSContent(filePath);
        
        // Merge with defaults
        const mergedContent = {
          ...defaultContent[filePath],
          ...cmsContent
        };
        
        setContent(mergedContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content');
        // Fallback to default content
        setContent(defaultContent[filePath] || {});
      } finally {
        setLoading(false);
      }
    }
    
    loadContent();
  }, [filePath]);
  
  return { content, loading, error };
}

// For server-side rendering
export async function getServerSideCMSContent(filePath: string): Promise<CMSContent> {
  try {
    const cmsContent = await getCMSContent(filePath);
    return {
      ...defaultContent[filePath],
      ...cmsContent
    };
  } catch (error) {
    console.warn(`Server-side CMS content fetch failed for ${filePath}:`, error);
    return defaultContent[filePath] || {};
  }
}
