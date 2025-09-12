import { NextRequest, NextResponse } from 'next/server'
import { graphyPackageIntegration } from '@/lib/services/graphy-package-integration'

/**
 * GET /api/graphy/packages/[sku]/sessions
 * Get upcoming live sessions for a package
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const { sku } = params

    if (!sku) {
      return NextResponse.json(
        { error: 'Package SKU is required' },
        { status: 400 }
      )
    }

    const result = await graphyPackageIntegration.getUpcomingLiveSessions(sku)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch live sessions' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Graphy sessions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
