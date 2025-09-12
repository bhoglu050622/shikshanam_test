import { useState, useEffect, useCallback } from 'react'
import { graphyPackageIntegration } from '@/lib/services/graphy-package-integration'
import { GraphyAPIResponse } from '@/lib/services/graphy-api'
import { UserPackage, Session } from '@/lib/types/packages'
import { useAuth } from '@/lib/auth-context'

// Hook for managing learner enrollment and packages
export function useGraphyLearner() {
  const { user, isLoggedIn } = useAuth()
  const [learnerId, setLearnerId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create learner when user logs in
  const createLearner = useCallback(async () => {
    if (!user || !isLoggedIn) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await graphyPackageIntegration.createLearnerFromAuth({
        name: user.name,
        email: user.email,
        mobile: undefined // Add mobile if available
      })

      if (result.success && result.data) {
        setLearnerId(result.data.id)
        return result.data
      } else {
        setError(result.error || 'Failed to create learner')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user, isLoggedIn])

  // Auto-create learner when user logs in
  useEffect(() => {
    if (isLoggedIn && user && !learnerId) {
      createLearner()
    }
  }, [isLoggedIn, user, learnerId, createLearner])

  return {
    learnerId,
    isLoading,
    error,
    createLearner,
    isReady: isLoggedIn && !!learnerId
  }
}

// Hook for managing user packages
export function useGraphyPackages() {
  const { learnerId, isReady } = useGraphyLearner()
  const [packages, setPackages] = useState<UserPackage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPackages = useCallback(async () => {
    if (!isReady || !learnerId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await graphyPackageIntegration.getLearnerPackages(learnerId)
      
      if (result.success && result.data) {
        setPackages(result.data)
      } else {
        setError(result.error || 'Failed to fetch packages')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isReady, learnerId])

  const enrollInPackage = useCallback(async (packageSku: string) => {
    if (!isReady || !learnerId) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await graphyPackageIntegration.enrollLearnerInPackage(learnerId, packageSku)
      
      if (result.success) {
        // Refresh packages after enrollment
        await fetchPackages()
        return result.data
      } else {
        setError(result.error || 'Failed to enroll in package')
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [isReady, learnerId, fetchPackages])

  // Fetch packages when learner is ready
  useEffect(() => {
    if (isReady) {
      fetchPackages()
    }
  }, [isReady, fetchPackages])

  return {
    packages,
    isLoading,
    error,
    fetchPackages,
    enrollInPackage,
    isReady
  }
}

// Hook for package-specific data
export function useGraphyPackage(packageSku: string) {
  const { learnerId, isReady } = useGraphyLearner()
  const [progress, setProgress] = useState<any>(null)
  const [usage, setUsage] = useState<any>(null)
  const [liveSessions, setLiveSessions] = useState<Session[]>([])
  const [discussions, setDiscussions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPackageData = useCallback(async () => {
    if (!isReady || !learnerId || !packageSku) return

    setIsLoading(true)
    setError(null)

    try {
      // Fetch all package-related data in parallel
      const [progressResult, usageResult, sessionsResult, discussionsResult] = await Promise.all([
        graphyPackageIntegration.getLearnerProgress(learnerId, packageSku),
        graphyPackageIntegration.getLearnerUsage(learnerId, packageSku),
        graphyPackageIntegration.getUpcomingLiveSessions(packageSku),
        graphyPackageIntegration.getLearnerDiscussions(learnerId, packageSku)
      ])

      if (progressResult.success) setProgress(progressResult.data)
      if (usageResult.success) setUsage(usageResult.data)
      if (sessionsResult.success) setLiveSessions(sessionsResult.data)
      if (discussionsResult.success) setDiscussions(discussionsResult.data)

      // Set error if any critical request failed
      if (!progressResult.success) {
        setError(progressResult.error || 'Failed to fetch package progress')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [isReady, learnerId, packageSku])

  // Fetch data when dependencies change
  useEffect(() => {
    if (isReady && packageSku) {
      fetchPackageData()
    }
  }, [isReady, packageSku, fetchPackageData])

  return {
    progress,
    usage,
    liveSessions,
    discussions,
    isLoading,
    error,
    fetchPackageData,
    isReady
  }
}

// Hook for live class management
export function useGraphyLiveClasses(packageSku: string) {
  const [attendees, setAttendees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendees = useCallback(async (liveClassId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await graphyPackageIntegration.getLiveClassAttendees(packageSku, liveClassId)
      
      if (result.success && result.data) {
        setAttendees(result.data)
      } else {
        setError(result.error || 'Failed to fetch attendees')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [packageSku])

  return {
    attendees,
    isLoading,
    error,
    fetchAttendees
  }
}

// Hook for device management
export function useGraphyDeviceManagement() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resetDevice = useCallback(async () => {
    if (!user?.email) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await graphyPackageIntegration.resetLearnerDevice(user.email)
      
      if (result.success) {
        setSuccess('Device reset successfully')
      } else {
        setError(result.error || 'Failed to reset device')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  const resetIOSScreenshot = useCallback(async () => {
    if (!user?.email) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await graphyPackageIntegration.resetIOSScreenshotRestriction(user.email)
      
      if (result.success) {
        setSuccess('iOS screenshot restriction reset successfully')
      } else {
        setError(result.error || 'Failed to reset iOS screenshot restriction')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user?.email])

  return {
    resetDevice,
    resetIOSScreenshot,
    isLoading,
    error,
    success
  }
}

// Hook for enrollment flow
export function useGraphyEnrollment() {
  const { enrollInPackage, isLoading: packagesLoading } = useGraphyPackages()
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, 'idle' | 'enrolling' | 'success' | 'error'>>({})
  const [enrollmentError, setEnrollmentError] = useState<Record<string, string>>({})

  const enroll = useCallback(async (packageSku: string) => {
    setEnrollmentStatus(prev => ({ ...prev, [packageSku]: 'enrolling' }))
    setEnrollmentError(prev => ({ ...prev, [packageSku]: '' }))

    try {
      const result = await enrollInPackage(packageSku)
      
      if (result) {
        setEnrollmentStatus(prev => ({ ...prev, [packageSku]: 'success' }))
        return result
      } else {
        setEnrollmentStatus(prev => ({ ...prev, [packageSku]: 'error' }))
        setEnrollmentError(prev => ({ ...prev, [packageSku]: 'Enrollment failed' }))
        return null
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setEnrollmentStatus(prev => ({ ...prev, [packageSku]: 'error' }))
      setEnrollmentError(prev => ({ ...prev, [packageSku]: errorMessage }))
      return null
    }
  }, [enrollInPackage])

  const getEnrollmentStatus = useCallback((packageSku: string) => {
    return enrollmentStatus[packageSku] || 'idle'
  }, [enrollmentStatus])

  const getEnrollmentError = useCallback((packageSku: string) => {
    return enrollmentError[packageSku] || ''
  }, [enrollmentError])

  return {
    enroll,
    getEnrollmentStatus,
    getEnrollmentError,
    isLoading: packagesLoading
  }
}
