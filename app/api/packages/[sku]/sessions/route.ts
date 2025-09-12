import { NextRequest, NextResponse } from 'next/server'
import { dummySessions } from '@/lib/fixtures/packages-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const { sku } = params

    // Get sessions for the package
    const sessions = dummySessions[sku] || []

    return NextResponse.json({
      success: true,
      sessions
    })

  } catch (error) {
    console.error('Sessions API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch sessions' 
      },
      { status: 500 }
    )
  }
}
