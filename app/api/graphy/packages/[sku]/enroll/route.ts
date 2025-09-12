import { NextRequest, NextResponse } from 'next/server'
import { graphyPackageIntegration } from '@/lib/services/graphy-package-integration'

/**
 * POST /api/graphy/packages/[sku]/enroll
 * Enroll a learner in a specific package
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const { sku } = params
    const body = await request.json()
    const { learnerId } = body

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

    const result = await graphyPackageIntegration.enrollLearnerInPackage(learnerId, sku)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to enroll in package' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Successfully enrolled in package'
    })
  } catch (error) {
    console.error('Graphy enrollment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
