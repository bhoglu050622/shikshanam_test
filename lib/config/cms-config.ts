// CMS Configuration for Production
// This file contains the correct URLs for the deployed applications

export const CMS_CONFIG = {
  // Main website URL (where the frontend is deployed)
  MAIN_WEBSITE_URL: 'https://shikshanam-kvxwlq7oa-amanamns-projects.vercel.app',
  
  // CMS Admin URL (where the CMS is deployed)
  CMS_API_URL: 'https://cms-admin-djvbhs0ty-amanamns-projects.vercel.app',
  
  // API endpoints
  CONTENT_API_ENDPOINT: '/api/content-secure',
  
  // Security settings
  SECURE_MODE: true,
  RATE_LIMIT_ENABLED: true,
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const;

// Environment-specific configuration
export function getCMSConfig() {
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return {
      ...CMS_CONFIG,
      // Use environment variables if available, otherwise use defaults
      CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL || CMS_CONFIG.CMS_API_URL,
      MAIN_WEBSITE_URL: process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL || CMS_CONFIG.MAIN_WEBSITE_URL,
    };
  }
  
  // Development configuration
  return {
    ...CMS_CONFIG,
    CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001',
    MAIN_WEBSITE_URL: process.env.NEXT_PUBLIC_MAIN_WEBSITE_URL || 'http://localhost:3000',
  };
}

// Export the configuration
export const config = getCMSConfig();
