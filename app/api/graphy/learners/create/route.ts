import { NextRequest, NextResponse } from 'next/server'
import { graphyAPI } from '@/lib/services/graphy-api'

/**
 * POST /api/graphy/learners/create
 * Create or update a learner in Graphy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, password, mobile, sendEmail, customFields } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!graphyAPI.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const learnerData = {
      email,
      name,
      password,
      mobile,
      sendEmail: sendEmail !== undefined ? sendEmail : true,
      customFields: customFields || { source: 'shikshanam' }
    }

    const result = await graphyAPI.createOrUpdateLearner(learnerData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create/update learner' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Learner created/updated successfully'
    })
  } catch (error) {
    console.error('Graphy API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
