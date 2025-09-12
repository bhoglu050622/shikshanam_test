import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth/auth-service'
import { jwtAuth } from '@/lib/auth/jwt'

// Force Node.js runtime to avoid Edge runtime incompatibility with jsonwebtoken
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get user from token
    const user = await jwtAuth.getUserFromRequest(request)
    
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (user && refreshToken) {
      // Logout user
      await authService.logout(user.userId, refreshToken)
    }

    // Clear all auth cookies
    await jwtAuth.clearTokenCookies()

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    
    // Clear cookies even if logout fails
    await jwtAuth.clearTokenCookies()
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
