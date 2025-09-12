import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI } from '@/lib/services/graphy-api'

/**
 * GET /api/graphy/learners/[learnerId]
 * Retrieve learner information from Graphy API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { learnerId: string } }
) {
  try {
    const { learnerId } = params
    const { searchParams } = new URL(request.url)
    const includeCourseInfo = searchParams.get('courseInfo') === 'true'

    if (!learnerId) {
      return NextResponse.json(
        { error: 'Learner ID is required' },
        { status: 400 }
      )
    }

    const result = await graphyAPI.getLearner(learnerId, includeCourseInfo)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch learner data' },
        { status: 500 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Graphy API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
