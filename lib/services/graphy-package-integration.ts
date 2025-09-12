import { graphyAPI, GraphyLearner, GraphyAPIResponse } from './graphy-api'
import { Package, UserPackage, Session } from '@/lib/types/packages'

// Graphy Product mapping for Shikshanam packages
export interface GraphyProductMapping {
  sku: string
  graphyProductId: string
  graphyCourseIds: string[]
  liveClassIds?: string[]
}

// Mapping of Shikshanam packages to Graphy products
export const PACKAGE_TO_GRAPHY_MAPPING: Record<string, GraphyProductMapping> = {
  'sanskrit-foundations': {
    sku: 'sanskrit-foundations',
    graphyProductId: 'sanskrit_foundations_001',
    graphyCourseIds: ['sanskrit_alphabet_001', 'sanskrit_grammar_001', 'sanskrit_vocab_001'],
    liveClassIds: ['sanskrit_live_001']
  },
  'vedic-philosophy-complete': {
    sku: 'vedic-philosophy-complete',
    graphyProductId: 'vedic_philosophy_001',
    graphyCourseIds: ['upanishads_001', 'vedanta_001', 'mimamsa_001'],
    liveClassIds: ['vedic_live_001']
  },
  'yoga-darshan-advanced': {
    sku: 'yoga-darshan-advanced',
    graphyProductId: 'yoga_darshan_001',
    graphyCourseIds: ['yoga_sutras_001', 'yoga_philosophy_001'],
    liveClassIds: ['yoga_live_001']
  },
  'emotional-intelligence-with-samkhya': {
    sku: 'emotional-intelligence-with-samkhya',
    graphyProductId: 'emotional_intelligence_001',
    graphyCourseIds: ['samkhya_001', 'emotional_intelligence_001'],
    liveClassIds: ['ei_live_001']
  },
  'isha-upanishad': {
    sku: 'isha-upanishad',
    graphyProductId: 'isha_upanishad_001',
    graphyCourseIds: ['isha_upanishad_001'],
    liveClassIds: ['isha_live_001']
  },
  'kashmir-shaivism': {
    sku: 'kashmir-shaivism',
    graphyProductId: 'kashmir_shaivism_001',
    graphyCourseIds: ['kashmir_shaivism_001'],
    liveClassIds: ['kashmir_live_001']
  },
  'nyaya-darshan': {
    sku: 'nyaya-darshan',
    graphyProductId: 'nyaya_darshan_001',
    graphyCourseIds: ['nyaya_001'],
    liveClassIds: ['nyaya_live_001']
  },
  'prashna-upanishad': {
    sku: 'prashna-upanishad',
    graphyProductId: 'prashna_upanishad_001',
    graphyCourseIds: ['prashna_upanishad_001'],
    liveClassIds: ['prashna_live_001']
  },
  'samkhya-darshan': {
    sku: 'samkhya-darshan',
    graphyProductId: 'samkhya_darshan_001',
    graphyCourseIds: ['samkhya_001'],
    liveClassIds: ['samkhya_live_001']
  },
  'tantra-darshan': {
    sku: 'tantra-darshan',
    graphyProductId: 'tantra_darshan_001',
    graphyCourseIds: ['tantra_001'],
    liveClassIds: ['tantra_live_001']
  },
  'vaisheshik-darshan': {
    sku: 'vaisheshik-darshan',
    graphyProductId: 'vaisheshik_darshan_001',
    graphyCourseIds: ['vaisheshik_001'],
    liveClassIds: ['vaisheshik_live_001']
  },
  'vedanta-essentials': {
    sku: 'vedanta-essentials',
    graphyProductId: 'vedanta_essentials_001',
    graphyCourseIds: ['vedanta_001'],
    liveClassIds: ['vedanta_live_001']
  },
  'yoga-darshan': {
    sku: 'yoga-darshan',
    graphyProductId: 'yoga_darshan_basic_001',
    graphyCourseIds: ['yoga_basics_001'],
    liveClassIds: ['yoga_basic_live_001']
  }
}

export interface GraphyPackageIntegration {
  // Learner management
  createLearnerFromAuth: (userData: { name: string; email: string; mobile?: string }) => Promise<GraphyAPIResponse<GraphyLearner>>
  getLearnerProgress: (learnerId: string, packageSku: string) => Promise<GraphyAPIResponse<any>>
  
  // Package enrollment
  enrollLearnerInPackage: (learnerId: string, packageSku: string) => Promise<GraphyAPIResponse<any>>
  getLearnerPackages: (learnerId: string) => Promise<GraphyAPIResponse<UserPackage[]>>
  
  // Live sessions
  getLiveClassAttendees: (packageSku: string, liveClassId: string) => Promise<GraphyAPIResponse<any[]>>
  getUpcomingLiveSessions: (packageSku: string) => Promise<GraphyAPIResponse<Session[]>>
  
  // Usage analytics
  getLearnerUsage: (learnerId: string, packageSku: string) => Promise<GraphyAPIResponse<any>>
  getLearnerDiscussions: (learnerId: string, packageSku?: string) => Promise<GraphyAPIResponse<any[]>>
  
  // Device management
  resetLearnerDevice: (email: string) => Promise<GraphyAPIResponse<any>>
  resetIOSScreenshotRestriction: (email: string) => Promise<GraphyAPIResponse<any>>
}

class GraphyPackageIntegrationService implements GraphyPackageIntegration {
  
  /**
   * Create a learner in Graphy when user authenticates
   */
  async createLearnerFromAuth(userData: { name: string; email: string; mobile?: string }): Promise<GraphyAPIResponse<GraphyLearner>> {
    try {
      const result = await graphyAPI.createOrUpdateLearner({
        email: userData.email,
        name: userData.name,
        mobile: userData.mobile,
        sendEmail: true,
        customFields: {
          source: 'shikshanam',
          registrationDate: new Date().toISOString(),
          platform: 'web'
        }
      })

      return result
    } catch (error) {
      console.error('Error creating learner from auth:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create learner'
      }
    }
  }

  /**
   * Get learner progress for a specific package
   */
  async getLearnerProgress(learnerId: string, packageSku: string): Promise<GraphyAPIResponse<any>> {
    try {
      const mapping = PACKAGE_TO_GRAPHY_MAPPING[packageSku]
      if (!mapping) {
        return {
          success: false,
          error: `Package mapping not found for SKU: ${packageSku}`
        }
      }

      // Get learner with course info
      const learnerResult = await graphyAPI.getLearner(learnerId, true)
      if (!learnerResult.success) {
        return learnerResult
      }

      // Get usage data for the product
      const usageResult = await graphyAPI.getLearnerUsage(learnerId, mapping.graphyProductId)
      if (!usageResult.success) {
        return usageResult
      }

      return {
        success: true,
        data: {
          learner: learnerResult.data,
          usage: usageResult.data,
          packageSku,
          graphyProductId: mapping.graphyProductId
        }
      }
    } catch (error) {
      console.error('Error getting learner progress:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get learner progress'
      }
    }
  }

  /**
   * Enroll learner in a package (simulate enrollment in Graphy)
   */
  async enrollLearnerInPackage(learnerId: string, packageSku: string): Promise<GraphyAPIResponse<any>> {
    try {
      const mapping = PACKAGE_TO_GRAPHY_MAPPING[packageSku]
      if (!mapping) {
        return {
          success: false,
          error: `Package mapping not found for SKU: ${packageSku}`
        }
      }

      // In a real implementation, this would call Graphy's enrollment API
      // For now, we'll simulate successful enrollment
      const enrollmentData = {
        learnerId,
        packageSku,
        graphyProductId: mapping.graphyProductId,
        enrolledAt: new Date().toISOString(),
        status: 'active',
        courses: mapping.graphyCourseIds,
        liveClasses: mapping.liveClassIds || []
      }

      return {
        success: true,
        data: enrollmentData,
        message: 'Successfully enrolled in package'
      }
    } catch (error) {
      console.error('Error enrolling learner in package:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to enroll in package'
      }
    }
  }

  /**
   * Get learner's enrolled packages
   */
  async getLearnerPackages(learnerId: string): Promise<GraphyAPIResponse<UserPackage[]>> {
    try {
      // Get learner with course info
      const learnerResult = await graphyAPI.getLearner(learnerId, true)
      if (!learnerResult.success) {
        return {
          success: false,
          error: learnerResult.error || 'Failed to fetch learner data'
        }
      }

      // Map Graphy course data to Shikshanam UserPackage format
      const userPackages: UserPackage[] = []
      
      // This would typically come from Graphy's enrollment data
      // For now, we'll simulate based on the learner's course info
      if (learnerResult.data?.courseInfo?.enrolledCourses) {
        const enrolledCourses = learnerResult.data.courseInfo.enrolledCourses
        
        // Group courses by package
        const packageGroups: Record<string, any[]> = {}
        enrolledCourses.forEach((course: any) => {
          // Find which package this course belongs to
          for (const [sku, mapping] of Object.entries(PACKAGE_TO_GRAPHY_MAPPING)) {
            if (mapping.graphyCourseIds.includes(course.id)) {
              if (!packageGroups[sku]) {
                packageGroups[sku] = []
              }
              packageGroups[sku].push(course)
            }
          }
        })

        // Convert to UserPackage format
        for (const [sku, courses] of Object.entries(packageGroups)) {
          const mapping = PACKAGE_TO_GRAPHY_MAPPING[sku]
          if (mapping) {
            userPackages.push({
              sku,
              name: this.getPackageName(sku),
              accessExpiresAt: undefined, // Lifetime access
              status: 'active',
              progress: this.calculateProgress(courses),
              nextLiveSession: undefined, // Would be populated from live class data
              availableMentorHours: 0, // Would come from package configuration
              certificateStatus: this.getCertificateStatus(courses),
              includedCourses: courses.map(course => ({
                id: course.id,
                title: course.title,
                duration: course.duration || '4 weeks',
                link: `/courses/${course.id}`
              }))
            })
          }
        }
      }

      return {
        success: true,
        data: userPackages
      }
    } catch (error) {
      console.error('Error getting learner packages:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get learner packages'
      }
    }
  }

  /**
   * Get live class attendees for a package
   */
  async getLiveClassAttendees(packageSku: string, liveClassId: string): Promise<GraphyAPIResponse<any[]>> {
    try {
      const result = await graphyAPI.getLiveClassAttendees(liveClassId, 0, 100)
      return result
    } catch (error) {
      console.error('Error getting live class attendees:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get live class attendees'
      }
    }
  }

  /**
   * Get upcoming live sessions for a package
   */
  async getUpcomingLiveSessions(packageSku: string): Promise<GraphyAPIResponse<Session[]>> {
    try {
      const mapping = PACKAGE_TO_GRAPHY_MAPPING[packageSku]
      if (!mapping || !mapping.liveClassIds) {
        return {
          success: true,
          data: []
        }
      }

      // In a real implementation, this would fetch from Graphy's live class API
      // For now, we'll return mock data
      const sessions: Session[] = mapping.liveClassIds.map((liveClassId, index) => ({
        id: liveClassId,
        date: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        seatRemaining: Math.floor(Math.random() * 50) + 10,
        maxSeats: 100,
        title: `Live Session ${index + 1} - ${this.getPackageName(packageSku)}`
      }))

      return {
        success: true,
        data: sessions
      }
    } catch (error) {
      console.error('Error getting upcoming live sessions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get live sessions'
      }
    }
  }

  /**
   * Get learner usage for a specific package
   */
  async getLearnerUsage(learnerId: string, packageSku: string): Promise<GraphyAPIResponse<any>> {
    try {
      const mapping = PACKAGE_TO_GRAPHY_MAPPING[packageSku]
      if (!mapping) {
        return {
          success: false,
          error: `Package mapping not found for SKU: ${packageSku}`
        }
      }

      const result = await graphyAPI.getLearnerUsage(learnerId, mapping.graphyProductId)
      return result
    } catch (error) {
      console.error('Error getting learner usage:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get learner usage'
      }
    }
  }

  /**
   * Get learner discussions
   */
  async getLearnerDiscussions(learnerId: string, packageSku?: string): Promise<GraphyAPIResponse<any[]>> {
    try {
      const result = await graphyAPI.getLearnerDiscussions(learnerId)
      return result
    } catch (error) {
      console.error('Error getting learner discussions:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get learner discussions'
      }
    }
  }

  /**
   * Reset learner device
   */
  async resetLearnerDevice(email: string): Promise<GraphyAPIResponse<any>> {
    try {
      const result = await graphyAPI.resetLearnerDevice(email)
      return result
    } catch (error) {
      console.error('Error resetting learner device:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset learner device'
      }
    }
  }

  /**
   * Reset iOS screenshot restriction
   */
  async resetIOSScreenshotRestriction(email: string): Promise<GraphyAPIResponse<any>> {
    try {
      const result = await graphyAPI.resetIOSScreenshotRestriction(email)
      return result
    } catch (error) {
      console.error('Error resetting iOS screenshot restriction:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset iOS screenshot restriction'
      }
    }
  }

  // Helper methods
  private getPackageName(sku: string): string {
    const packageNames: Record<string, string> = {
      'sanskrit-foundations': 'Sanskrit Foundations',
      'vedic-philosophy-complete': 'Vedic Philosophy Complete',
      'yoga-darshan-advanced': 'Yoga Darshan Advanced',
      'emotional-intelligence-with-samkhya': 'Emotional Intelligence with Samkhya',
      'isha-upanishad': 'Isha Upanishad',
      'kashmir-shaivism': 'Kashmir Shaivism',
      'nyaya-darshan': 'Nyaya Darshan',
      'prashna-upanishad': 'Prashna Upanishad',
      'samkhya-darshan': 'Samkhya Darshan',
      'tantra-darshan': 'Tantra Darshan',
      'vaisheshik-darshan': 'Vaisheshik Darshan',
      'vedanta-essentials': 'Vedanta Essentials',
      'yoga-darshan': 'Yoga Darshan'
    }
    return packageNames[sku] || sku
  }

  private calculateProgress(courses: any[]): number {
    if (!courses || courses.length === 0) return 0
    
    const totalProgress = courses.reduce((sum, course) => sum + (course.progress || 0), 0)
    return Math.round(totalProgress / courses.length)
  }

  private getCertificateStatus(courses: any[]): 'not_available' | 'pending' | 'issued' {
    if (!courses || courses.length === 0) return 'not_available'
    
    const allCompleted = courses.every(course => course.progress === 100)
    if (allCompleted) {
      return 'issued'
    }
    
    const someCompleted = courses.some(course => course.progress === 100)
    return someCompleted ? 'pending' : 'not_available'
  }
}

// Export singleton instance
export const graphyPackageIntegration = new GraphyPackageIntegrationService()
export default GraphyPackageIntegrationService
