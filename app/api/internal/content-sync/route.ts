import { NextRequest, NextResponse } from 'next/server';

/**
 * Internal API endpoint for CMS content synchronization
 * This endpoint is designed to be called by the CMS admin without authentication
 * It uses a special internal token for security
 */

const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'shikshanam-internal-sync-2024';

// Validate internal API token
function validateInternalToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return token === INTERNAL_API_TOKEN;
}

/**
 * GET /api/internal/content-sync
 * Fetch current content from the frontend for CMS synchronization
 */
export async function GET(request: NextRequest) {
  try {
    // Validate internal token
    if (!validateInternalToken(request)) {
      return NextResponse.json(
        { success: false, error: 'Invalid internal API token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: 'File path is required' },
        { status: 400 }
      );
    }

    // Simulate fetching content from the frontend
    // In a real implementation, this would read from your content storage
    const mockContent = {
      filePath,
      content: `# Content from ${filePath}

This is the current content from the frontend.
Last updated: ${new Date().toISOString()}

## Sample Content:
- Main Title: "Welcome to Shikshanam"
- Subtitle: "Where AI meets Ancient India"
- Question: "What do you seek?"
- Button Text: "Start Journey"

This content is fetched from the frontend and can be synced to the CMS.`,
      timestamp: new Date().toISOString(),
      source: 'frontend'
    };

    return NextResponse.json({
      success: true,
      data: mockContent
    });

  } catch (error: any) {
    console.error('Internal content sync GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/internal/content-sync
 * Update content in the frontend from CMS
 */
export async function POST(request: NextRequest) {
  try {
    // Validate internal token
    if (!validateInternalToken(request)) {
      return NextResponse.json(
        { success: false, error: 'Invalid internal API token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { filePath, content, message } = body;

    if (!filePath || !content) {
      return NextResponse.json(
        { success: false, error: 'File path and content are required' },
        { status: 400 }
      );
    }

    // Simulate updating content in the frontend
    // In a real implementation, this would update your content storage
    console.log(`Updating content for ${filePath}:`, {
      content: content.substring(0, 100) + '...',
      message: message || 'No message provided',
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: {
        filePath,
        content,
        message: message || 'Content updated successfully',
        timestamp: new Date().toISOString(),
        source: 'cms'
      }
    });

  } catch (error: any) {
    console.error('Internal content sync POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
