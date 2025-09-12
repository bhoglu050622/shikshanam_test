# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Shikshanam application.

## Prerequisites

- Google Cloud Console account
- Access to the Shikshanam project

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API" if not already enabled

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application** as the application type
4. Configure the OAuth consent screen if prompted

## Step 4: Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Shikshanam
   - **User support email**: your-email@domain.com
   - **Developer contact information**: your-email@domain.com
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Add test users (for development)

## Step 5: Configure OAuth Client

1. In the OAuth 2.0 Client ID creation form:
   - **Name**: Shikshanam Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3001` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3001/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)

## Step 6: Get Credentials

1. After creating the OAuth client, you'll get:
   - **Client ID**: Copy this value
   - **Client Secret**: Copy this value

## Step 7: Update Environment Variables

Update your `.env.local` file with the credentials:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
ENABLE_GOOGLE_AUTH=true

# Make sure the base URL matches your development server
NEXT_PUBLIC_BASE_URL=http://localhost:3001
```

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3001/auth/login`

3. Click "Continue with Google"

4. You should be redirected to Google's OAuth consent screen

5. After authorization, you'll be redirected back to the application

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**:
   - Ensure the redirect URI in Google Console exactly matches your callback URL
   - Check that the port number is correct (3001 for development)

2. **"invalid_client" error**:
   - Verify your Client ID and Client Secret are correct
   - Make sure there are no extra spaces or characters

3. **"access_denied" error**:
   - Check that the OAuth consent screen is properly configured
   - Ensure test users are added if using external user type

4. **"unauthorized_client" error**:
   - Verify the authorized JavaScript origins include your domain
   - Check that the OAuth client type is set to "Web application"

### Development vs Production

For production deployment:

1. Update the authorized origins and redirect URIs in Google Console
2. Update the environment variables with production URLs
3. Ensure the OAuth consent screen is published (not in testing mode)

## Security Notes

1. **Never commit credentials to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate credentials regularly**
4. **Use HTTPS in production**
5. **Implement proper session management**

## API Endpoints

The following endpoints are available for OAuth:

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/google/callback` - Handles OAuth callback
- `POST /api/auth/email` - Email/password authentication

## Testing Credentials

For development testing, you can use these demo credentials:

**Email Authentication:**
- Email: `demo@shikshanam.com`
- Password: `demo123`

- Email: `test@shikshanam.com`
- Password: `test123`

## Next Steps

After setting up Google OAuth:

1. Test the complete authentication flow
2. Implement user session management
3. Add user profile management
4. Integrate with Graphy API for learner creation
5. Set up proper error handling and logging

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server logs for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure the Google Cloud Console configuration matches your setup