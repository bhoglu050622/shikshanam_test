# Shikshanam Setup Guide

This guide will help you set up both the main Shikshanam application and the CMS admin panel to run independently.

## Quick Start

1. **Run the setup script:**
   ```bash
   ./setup-env.sh
   ```

2. **Install dependencies:**
   ```bash
   # Main app
   npm install
   
   # CMS admin
   cd cms-admin
   npm install
   cd ..
   ```

3. **Configure environment variables** (see sections below)

4. **Start the applications:**
   ```bash
   # Terminal 1: Main app (port 3000)
   npm run dev
   
   # Terminal 2: CMS admin (port 3001)
   cd cms-admin && npm run dev
   ```

## Environment Configuration

### Main App (.env.local)

The main application requires the following environment variables:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
ENABLE_GOOGLE_AUTH=true

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/shikshanam"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# Graphy API Configuration
GRAPHY_API_KEY="your-graphy-api-key-here"
GRAPHY_API_URL="https://api.ongraphy.com"

# Security Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL=http://localhost:3000

# Development Configuration
NODE_ENV=development
```

### CMS Admin (cms-admin/.env.local)

The CMS admin requires the following environment variables:

```bash
# GitHub Configuration
GITHUB_OWNER="your-github-username"
GITHUB_REPO="shikshanam"
GITHUB_TOKEN="your-github-token-here"
DEFAULT_BRANCH="main"

# Vercel Configuration (optional)
VERCEL_TOKEN="your-vercel-token-here"
VERCEL_WEBHOOK_SECRET="your-vercel-webhook-secret-here"

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/shikshanam_cms"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
NODE_ENV=development

# JWT Configuration for CMS
JWT_SECRET="your-cms-jwt-secret-key-here"
JWT_EXPIRES_IN="24h"
```

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### 2. Enable Required APIs

1. Go to **APIs & Services** > **Library**
2. Enable the following APIs:
   - Google+ API
   - Google OAuth2 API

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in the required information:
   - **App name**: Shikshanam
   - **User support email**: your-email@domain.com
   - **Developer contact information**: your-email@domain.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Add test users (for development)

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application**
4. Configure:
   - **Name**: Shikshanam Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)

### 5. Update Environment Variables

Copy the Client ID and Client Secret to your `.env.local` file:

```bash
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

## Database Setup

### Main App Database

1. Create a PostgreSQL database for the main app:
   ```sql
   CREATE DATABASE shikshanam;
   ```

2. Update the `DATABASE_URL` in `.env.local`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/shikshanam"
   ```

3. Run migrations:
   ```bash
   npm run db:push
   ```

### CMS Admin Database

1. Create a separate PostgreSQL database for the CMS:
   ```sql
   CREATE DATABASE shikshanam_cms;
   ```

2. Update the `DATABASE_URL` in `cms-admin/.env.local`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/shikshanam_cms"
   ```

3. Run migrations:
   ```bash
   cd cms-admin
   npm run db:push
   ```

## Redis Setup (for CMS Admin)

The CMS admin uses Redis for job queues and caching:

1. Install Redis:
   ```bash
   # macOS
   brew install redis
   
   # Ubuntu/Debian
   sudo apt-get install redis-server
   ```

2. Start Redis:
   ```bash
   redis-server
   ```

3. Update the `REDIS_URL` in `cms-admin/.env.local` if needed:
   ```bash
   REDIS_URL="redis://localhost:6379"
   ```

## GitHub Integration (for CMS Admin)

The CMS admin integrates with GitHub for content management:

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens
   - Generate a new token with `repo` permissions
   - Copy the token

2. Update the GitHub configuration in `cms-admin/.env.local`:
   ```bash
   GITHUB_OWNER="your-github-username"
   GITHUB_REPO="shikshanam"
   GITHUB_TOKEN="your-github-token-here"
   ```

## Running the Applications

### Development Mode

1. **Main App** (port 3000):
   ```bash
   npm run dev
   ```
   Access at: http://localhost:3000

2. **CMS Admin** (port 3001):
   ```bash
   cd cms-admin
   npm run dev
   ```
   Access at: http://localhost:3001

### Production Mode

1. **Build both applications:**
   ```bash
   # Main app
   npm run build
   
   # CMS admin
   cd cms-admin
   npm run build
   cd ..
   ```

2. **Start both applications:**
   ```bash
   # Main app
   npm start
   
   # CMS admin
   cd cms-admin
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Main app runs on port 3000
   - CMS admin runs on port 3001
   - Make sure these ports are available

2. **OAuth redirect URI mismatch:**
   - Ensure the redirect URI in Google Console exactly matches your callback URL
   - Check that the port number is correct (3000 for main app)

3. **Database connection issues:**
   - Verify PostgreSQL is running
   - Check database credentials in `.env.local`
   - Ensure databases exist

4. **CMS admin not loading:**
   - Check that Redis is running
   - Verify GitHub token has correct permissions
   - Check browser console for errors

### Logs and Debugging

1. **Check application logs:**
   - Main app: Check terminal output
   - CMS admin: Check terminal output

2. **Check browser console:**
   - Open Developer Tools
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Check environment variables:**
   ```bash
   # Verify environment variables are loaded
   node -e "console.log(process.env.GOOGLE_CLIENT_ID)"
   ```

## Security Notes

1. **Never commit credentials to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate credentials regularly**
4. **Use HTTPS in production**
5. **Implement proper session management**

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure all services (PostgreSQL, Redis) are running
5. Check the Google Cloud Console configuration matches your setup

For detailed OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md).
