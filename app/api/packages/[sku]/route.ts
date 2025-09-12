import { NextRequest, NextResponse } from 'next/server'
import { dummyPackages } from '@/lib/fixtures/packages-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { sku: string } }
) {
  try {
    const { sku } = params

    // Find the package by SKU
    const packageData = dummyPackages.find(pkg => pkg.sku === sku)

    if (!packageData) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Package not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      package: packageData
    })

  } catch (error) {
    console.error('Package API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch package' 
      },
      { status: 500 }
    )
  }
}
