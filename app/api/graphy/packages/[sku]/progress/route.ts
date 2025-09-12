import { NextRequest, NextResponse } from 'next/server'
import { graphyPackageIntegration } from '@/lib/services/graphy-package-integration'

/**
 * GET /api/graphy/packages/[sku]/progress
 * Get learner progress for a specific package
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params
    const { searchParams } = new URL(request.url)
    const learnerId = searchParams.get('learnerId')

    if (!learnerId) {
      return NextResponse.json(
        { error: 'Learner ID is required' },
        { status: 400 }
      )
    }

    if (!sku) {
      return NextResponse.json(
        { error: 'Package SKU is required' },
        { status: 400 }
      )
    }

    const result = await graphyPackageIntegration.getLearnerProgress(learnerId, sku)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Graphy progress error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
