// Secure CMS Content Management System
// API-only approach with proper security, validation, and error handling

import { useState, useEffect, useCallback } from 'react';
import { config } from './config/cms-config';

// Type definitions
interface CMSContent {
  mainTitle?: string;
  subtitle?: string;
  question?: string;
  buttonText?: string;
  description?: string;
  [key: string]: string | undefined;
}

interface ContentResponse {
  success: boolean;
  content?: string;
  error?: string;
  timestamp?: string;
}

interface ContentCache {
  data: CMSContent;
  timestamp: number;
  expires: number;
}

// Configuration - using centralized config
const CONFIG = {
  API_BASE_URL: config.CMS_API_URL,
  CACHE_DURATION: config.CACHE_DURATION,
  MAX_RETRIES: config.MAX_RETRIES,
  RETRY_DELAY: config.RETRY_DELAY,
  REQUEST_TIMEOUT: config.REQUEST_TIMEOUT,
} as const;

// Secure cache management
class SecureContentCache {
  private cache = new Map<string, ContentCache>();
  private readonly maxSize = 100; // Prevent memory leaks

  set(key: string, data: CMSContent): void {
    // Prevent cache overflow
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + CONFIG.CACHE_DURATION,
    });
  }

  get(key: string): CMSContent | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // Check if expired
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
const contentCache = new SecureContentCache();

// Input validation and sanitization
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length to prevent DoS
}

function validateFilePath(filePath: string): boolean {
  if (typeof filePath !== 'string') return false;
  
  // Allow only specific file paths to prevent path traversal
  const allowedPaths = [
    'components/sections/Hero.tsx',
    'components/sections/Schools.tsx',
    'components/sections/MeetGurus.tsx',
    'components/sections/FAQ.tsx',
    'components/sections/Community.tsx',
    'components/sections/Contribute.tsx',
    'components/sections/DownloadAppNew.tsx',
    'components/sections/AlignYourself.tsx',
  ];
  
  return allowedPaths.includes(filePath);
}

// Secure content parsing with validation
function parseCMSContent(contentString: string): CMSContent {
  const content: CMSContent = {};
  
  if (!contentString || typeof contentString !== 'string') {
    return content;
  }
  
  try {
    const lines = contentString.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;
      
      // Parse key-value pairs with validation
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = sanitizeInput(trimmedLine.substring(0, colonIndex).trim().toLowerCase());
      const value = sanitizeInput(trimmedLine.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, ''));
      
      // Map to structured content
      switch (key) {
        case 'main title':
        case 'maintitle':
          content.mainTitle = value;
          break;
        case 'subtitle':
          content.subtitle = value;
          break;
        case 'question':
          content.question = value;
          break;
        case 'button text':
        case 'buttontext':
          content.buttonText = value;
          break;
        case 'description':
          content.description = value;
          break;
        default:
          // Only allow known keys to prevent injection
          if (key.length < 50 && /^[a-zA-Z0-9\s-]+$/.test(key)) {
            content[key] = value;
          }
      }
    }
  } catch (error) {
    console.warn('Error parsing CMS content:', error);
  }
  
  return content;
}

// Secure API request with retry logic and timeout
async function secureApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Retry mechanism for failed requests
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = CONFIG.RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Secure content fetching from CMS API
async function fetchContentFromCMS(filePath: string): Promise<CMSContent> {
  // Validate input
  if (!validateFilePath(filePath)) {
    console.warn(`Invalid file path: ${filePath}`);
    return {};
  }

  // Check cache first
  const cached = contentCache.get(filePath);
  if (cached) {
    return cached;
  }

  try {
    const url = `${CONFIG.API_BASE_URL}/api/content?filePath=${encodeURIComponent(filePath)}`;
    
    const response = await fetchWithRetry(async () => {
      return await secureApiRequest(url, {
        method: 'GET',
        credentials: 'omit', // Don't send credentials for public content
      });
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Content not found for ${filePath}`);
        return {};
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ContentResponse = await response.json();
    
    if (data.success && data.content) {
      const parsedContent = parseCMSContent(data.content);
      contentCache.set(filePath, parsedContent);
      return parsedContent;
    }
    
    return {};
  } catch (error) {
    console.warn(`Error fetching CMS content for ${filePath}:`, error);
    return {};
  }
}

// Default content fallbacks with validation
export const defaultContent: { [key: string]: CMSContent } = {
  'components/sections/Hero.tsx': {
    mainTitle: 'Welcome to Ancient Wisdom',
    subtitle: 'Where Technology meets Tradition',
    question: 'What are you looking for?',
    buttonText: 'Explore Now',
    description: 'Discover the timeless wisdom of ancient India through modern technology'
  },
  'components/sections/Schools.tsx': {
    mainTitle: 'Schools of Philosophy',
    subtitle: 'Explore Different Paths to Wisdom',
    question: 'Which school resonates with you?',
    buttonText: 'Learn More'
  },
  'components/sections/MeetGurus.tsx': {
    mainTitle: 'Meet Our Gurus',
    subtitle: 'Learn from Experienced Teachers',
    question: 'Ready to begin your journey?',
    buttonText: 'Start Learning'
  }
};

// Secure content management functions
export async function getCMSContent(filePath: string): Promise<CMSContent> {
  try {
    const cmsContent = await fetchContentFromCMS(filePath);
    return {
      ...defaultContent[filePath],
      ...cmsContent
    };
  } catch (error) {
    console.warn(`Failed to fetch CMS content for ${filePath}:`, error);
    return defaultContent[filePath] || {};
  }
}

export function clearContentCache(): void {
  contentCache.clear();
}

export function cleanupContentCache(): void {
  contentCache.cleanup();
}

// Secure React hook for CMS content
export function useCMSContent(filePath: string) {
  const [content, setContent] = useState<CMSContent>(defaultContent[filePath] || {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadContent = useCallback(async () => {
    if (!validateFilePath(filePath)) {
      setError('Invalid file path');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const cmsContent = await getCMSContent(filePath);
      setContent(cmsContent);
      setRetryCount(0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
      
      // Fallback to default content
      setContent(defaultContent[filePath] || {});
    } finally {
      setLoading(false);
    }
  }, [filePath]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Retry function
  const retry = useCallback(() => {
    if (retryCount < CONFIG.MAX_RETRIES) {
      loadContent();
    }
  }, [loadContent, retryCount]);

  return { 
    content, 
    loading, 
    error, 
    retry, 
    retryCount,
    canRetry: retryCount < CONFIG.MAX_RETRIES
  };
}

// Server-side content fetching (for SSR)
export async function getServerSideCMSContent(filePath: string): Promise<CMSContent> {
  try {
    if (!validateFilePath(filePath)) {
      return defaultContent[filePath] || {};
    }

    const cmsContent = await fetchContentFromCMS(filePath);
    return {
      ...defaultContent[filePath],
      ...cmsContent
    };
  } catch (error) {
    console.warn(`Server-side CMS content fetch failed for ${filePath}:`, error);
    return defaultContent[filePath] || {};
  }
}

// Content validation utilities
export function validateContent(content: CMSContent): boolean {
  if (!content || typeof content !== 'object') return false;
  
  // Check for required fields based on file path
  const requiredFields = ['mainTitle', 'subtitle'];
  return requiredFields.every(field => 
    content[field] && typeof content[field] === 'string' && content[field]!.length > 0
  );
}

// Export configuration for debugging
export const CMS_CONFIG = CONFIG;
