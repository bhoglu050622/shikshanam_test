#!/bin/bash

# Setup script for Shikshanam environment configuration
echo "Setting up Shikshanam environment configuration..."

# Create main app .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local for main app..."
    cat > .env.local << 'EOF'
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
EOF
    echo "✅ Created .env.local for main app"
else
    echo "⚠️  .env.local already exists for main app"
fi

# Create CMS admin .env.local if it doesn't exist
if [ ! -f "cms-admin/.env.local" ]; then
    echo "Creating .env.local for CMS admin..."
    cat > cms-admin/.env.local << 'EOF'
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
EOF
    echo "✅ Created .env.local for CMS admin"
else
    echo "⚠️  .env.local already exists for CMS admin"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the environment variables in both .env.local files with your actual values"
echo "2. For Google OAuth:"
echo "   - Go to Google Cloud Console"
echo "   - Create OAuth 2.0 credentials"
echo "   - Set authorized redirect URI to: http://localhost:3000/api/auth/google/callback"
echo "   - Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local"
echo "3. Start the main app: npm run dev (runs on port 3000)"
echo "4. Start the CMS admin: cd cms-admin && npm run dev (runs on port 3001)"
echo ""
echo "📚 See GOOGLE_OAUTH_SETUP.md for detailed OAuth setup instructions"
