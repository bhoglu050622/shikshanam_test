import { GOOGLE_OAUTH_CONFIG } from '@/lib/config/auth'

// Graphy API Configuration
const GRAPHY_CONFIG = {
  baseUrl: 'https://api.ongraphy.com',
  mid: process.env.GRAPHY_MID || 'hyperquest',
  apiKey: process.env.GRAPHY_API_KEY || '52bae682-186d-44af-a933-c6b6808596c9',
}

// Types for Graphy API responses
export interface GraphyLearner {
  id: string
  email: string
  name?: string
  mobile?: string
  customFields?: Record<string, any>
  courseInfo?: {
    enrolledCourses: any[]
    progress: Record<string, number>
  }
}

export interface GraphyUsage {
  learnerId: string
  productId: string
  usage: {
    totalTime: number
    sessions: number
    lastAccessed: string
  }
}

export interface GraphyDiscussion {
  id: string
  content: string
  timestamp: string
  courseId?: string
}

export interface GraphyLiveClassAttendee {
  id: string
  name: string
  email: string
  joinTime: string
  duration: number
}

export interface GraphyAPIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class GraphyAPIService {
  private baseUrl: string
  private mid: string
  private apiKey: string

  constructor() {
    this.baseUrl = GRAPHY_CONFIG.baseUrl
    this.mid = GRAPHY_CONFIG.mid
    this.apiKey = GRAPHY_CONFIG.apiKey
  }

  /**
   * Get learner information by ID
   */
  async getLearner(learnerId: string, includeCourseInfo = false): Promise<GraphyAPIResponse<GraphyLearner>> {
    try {
      const url = `${this.baseUrl}/public/v1/learners/${learnerId}?mid=${this.mid}&key=${this.apiKey}&courseInfo=${includeCourseInfo}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching learner:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get learner usage statistics
   */
  async getLearnerUsage(
    learnerId: string, 
    productId: string, 
    date?: string
  ): Promise<GraphyAPIResponse<GraphyUsage>> {
    try {
      const dateParam = date ? `&date=${date}` : ''
      const url = `${this.baseUrl}/public/v1/learners/${learnerId}/usage?mid=${this.mid}&key=${this.apiKey}&productId=${productId}${dateParam}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching learner usage:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get learner discussions
   */
  async getLearnerDiscussions(
    learnerId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<GraphyAPIResponse<GraphyDiscussion[]>> {
    try {
      const startParam = startDate ? `&startDate=${startDate}` : ''
      const endParam = endDate ? `&endDate=${endDate}` : ''
      const url = `${this.baseUrl}/public/v1/learners/${learnerId}/discussions?mid=${this.mid}&key=${this.apiKey}${startParam}${endParam}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching learner discussions:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Get live class attendees
   */
  async getLiveClassAttendees(
    liveClassId: string, 
    skip = 0, 
    limit = 10
  ): Promise<GraphyAPIResponse<GraphyLiveClassAttendee[]>> {
    try {
      const url = `${this.baseUrl}/t/api/public/v3/products/liveclass/attendees?mid=${this.mid}&key=${this.apiKey}&skip=${skip}&limit=${limit}&liveClassId=${liveClassId}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching live class attendees:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Reset learner device registrations
   */
  async resetLearnerDevice(email: string): Promise<GraphyAPIResponse<any>> {
    try {
      const url = `${this.baseUrl}/t/api/public/v3/learners/reset-device?mid=${this.mid}&key=${this.apiKey}&email=${email}`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error resetting learner device:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Create or update learner
   */
  async createOrUpdateLearner(learnerData: {
    email: string
    name?: string
    password?: string
    mobile?: string
    sendEmail?: boolean
    customFields?: Record<string, any>
  }): Promise<GraphyAPIResponse<GraphyLearner>> {
    try {
      const formData = new URLSearchParams()
      formData.append('mid', this.mid)
      formData.append('key', this.apiKey)
      formData.append('email', learnerData.email)
      
      if (learnerData.name) formData.append('name', learnerData.name)
      if (learnerData.password) formData.append('password', learnerData.password)
      if (learnerData.mobile) formData.append('mobile', learnerData.mobile)
      if (learnerData.sendEmail !== undefined) formData.append('sendEmail', learnerData.sendEmail.toString())
      if (learnerData.customFields) formData.append('customFields', JSON.stringify(learnerData.customFields))

      const response = await fetch(`${this.baseUrl}/t/api/public/v3/learners/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error creating/updating learner:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Reset iOS screenshot restriction
   */
  async resetIOSScreenshotRestriction(email: string): Promise<GraphyAPIResponse<any>> {
    try {
      const url = `${this.baseUrl}/t/api/public/v3/learners/reset/ios/screenshot?mid=${this.mid}&key=${this.apiKey}&email=${email}`
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error resetting iOS screenshot restriction:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  /**
   * Helper method to format dates for API calls
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '/')
  }

  /**
   * Helper method to validate email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

// Export singleton instance
export const graphyAPI = new GraphyAPIService()
export default GraphyAPIService
