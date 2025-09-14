// Google OAuth Configuration
export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  // Use the application base URL for redirect URI - ensure it matches the development server port
  REDIRECT_URI: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`,
  SCOPE: 'openid email profile',
}

// OAuth URLs
export const OAUTH_URLS = {
  GOOGLE_AUTH: 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN: 'https://oauth2.googleapis.com/token',
  GOOGLE_USER_INFO: 'https://www.googleapis.com/oauth2/v2/userinfo',
}

// Email authentication URL
export const EMAIL_AUTH_URL = 'https://courses.shikshanam.in/t/u/authenticate'
