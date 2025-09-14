// API endpoint to get current content from the frontend
// This allows the CMS to fetch the current content displayed on the frontend

import { NextRequest, NextResponse } from 'next/server';

// Current content from the frontend components
const currentContent = {
  'components/sections/Hero.tsx': {
    mainTitle: 'Welcome to Ancient Wisdom',
    subtitle: 'Where Technology meets Tradition',
    question: 'What are you looking for?',
    buttonText: 'Explore Now'
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('filePath');
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'filePath parameter is required' },
        { status: 400 }
      );
    }

    // Get current content for the specified file
    const content = currentContent[filePath as keyof typeof currentContent];
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found for the specified file path' },
        { status: 404 }
      );
    }

    // Convert content to the format expected by CMS
    const cmsFormat = Object.entries(content)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    return NextResponse.json({
      success: true,
      filePath,
      content: cmsFormat,
      timestamp: new Date().toISOString(),
      source: 'frontend'
    });

  } catch (error) {
    console.error('Error fetching current content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update content from frontend (for bidirectional sync)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filePath, content } = body;

    if (!filePath || !content) {
      return NextResponse.json(
        { error: 'filePath and content are required' },
        { status: 400 }
      );
    }

    // Parse content from CMS format to object
    const contentLines = content.split('\n');
    const parsedContent: Record<string, string> = {};
    
    contentLines.forEach((line: string) => {
      const [key, ...valueParts] = line.split(': ');
      if (key && valueParts.length > 0) {
        parsedContent[key.trim()] = valueParts.join(': ').trim();
      }
    });

    // Update the current content
    if (currentContent[filePath as keyof typeof currentContent]) {
      Object.assign(currentContent[filePath as keyof typeof currentContent], parsedContent);
    }

    return NextResponse.json({
      success: true,
      filePath,
      message: 'Content updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
