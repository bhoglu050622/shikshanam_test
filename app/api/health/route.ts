/**
 * System Health Check API
 * Temporarily simplified to avoid Prisma issues during build
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = request.headers.get('x-request-id') || `health_${Date.now()}`;
  
  // Verify cron secret for security (optional but recommended)
  const cronSecret = request.headers.get('authorization');
  const expectedSecret = process.env.CRON_SECRET;
  
  if (expectedSecret && cronSecret !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Simple health check without database
    const responseTime = Date.now() - startTime;

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      components: {
        system: {
          status: 'healthy',
          uptime: `${Math.floor(process.uptime())}s`,
          nodeVersion: process.version,
          platform: process.platform,
        },
      },
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Response-Time': `${responseTime}ms`,
        'X-Request-ID': requestId,
      },
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        error: 'Health check failed',
      },
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Response-Time': `${responseTime}ms`,
          'X-Request-ID': requestId,
        },
      }
    );
  }
}