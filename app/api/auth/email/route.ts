import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // For development purposes, we'll use a simple mock authentication
    // In production, you would validate against your database
    const mockUsers = [
      {
        id: '1',
        email: 'demo@shikshanam.com',
        password: 'demo123',
        name: 'Demo User',
        avatar: null,
        provider: 'email'
      },
      {
        id: '2',
        email: 'test@shikshanam.com',
        password: 'test123',
        name: 'Test User',
        avatar: null,
        provider: 'email'
      }
    ]

    const user = mockUsers.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Email authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}