import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/auth-service'
import { jwtAuth } from '@/lib/auth/jwt'

// Force Node.js runtime to avoid Edge runtime incompatibility with jsonwebtoken
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token not found' },
        { status: 401 }
      )
    }

    // Refresh the token
    const result = await authService.refreshToken(refreshToken)

    if (!result.success) {
      // Clear invalid cookies
      await jwtAuth.clearTokenCookies()
      
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Set new secure cookies
    if (result.tokens) {
      await jwtAuth.setTokenCookies(result.tokens.accessToken, result.tokens.refreshToken)
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      message: 'Token refreshed successfully'
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}