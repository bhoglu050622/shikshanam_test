import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('sectionId')

    // Mock data for different sections
    const sections = {
      hero: {
        title: 'Unlock Ancient Indian Wisdom',
        subtitle: 'Master Sanskrit, Darshanas, and Self-help through our comprehensive learning platform',
        description: 'Join thousands of students in discovering the timeless knowledge of ancient India',
        ctaText: 'Start Learning',
        ctaLink: '/courses',
        stats: [
          { label: 'Active Students', value: '2,500+' },
          { label: 'Certified Gurus', value: '50+' },
          { label: 'Courses Available', value: '100+' }
        ]
      },
      schools: {
        title: 'Our Learning Schools',
        subtitle: 'Choose your path of wisdom',
        schools: [
          {
            id: 'sanskrit',
            name: 'Sanskrit School',
            description: 'Master the ancient language of wisdom',
            icon: 'book',
            link: '/schools/sanskrit'
          },
          {
            id: 'darshana',
            name: 'Darshan School',
            description: 'Explore Indian philosophical systems',
            icon: 'lightbulb',
            link: '/schools/darshana'
          },
          {
            id: 'self-help',
            name: 'Self-help School',
            description: 'Transform your life with ancient wisdom',
            icon: 'heart',
            link: '/schools/self-help'
          }
        ]
      },
      gurus: {
        title: 'Meet Our Gurus',
        subtitle: 'Learn from authentic masters',
        gurus: [
          {
            id: 'meera-patel',
            name: 'Meera Patel',
            title: 'Sanskrit Scholar',
            description: 'Expert in classical Sanskrit literature',
            image: '/assets/avatars/meera-patel.jpg'
          },
          {
            id: 'priya-sharma',
            name: 'Priya Sharma',
            title: 'Vedanta Teacher',
            description: 'Specialist in Advaita Vedanta philosophy',
            image: '/assets/avatars/priya-sharma.jpg'
          },
          {
            id: 'rajesh-kumar',
            name: 'Rajesh Kumar',
            title: 'Yoga Master',
            description: 'Traditional Hatha Yoga practitioner',
            image: '/assets/avatars/rajesh-kumar.jpg'
          }
        ]
      }
    }

    if (!sectionId || !sections[sectionId as keyof typeof sections]) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: sections[sectionId as keyof typeof sections]
    })

  } catch (error) {
    console.error('Homepage API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch homepage data' },
      { status: 500 }
    )
  }
}
