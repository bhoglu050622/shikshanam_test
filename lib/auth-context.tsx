'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { setAuthCookie, getAuthCookie, deleteAuthCookie } from './cookies'
import { graphyPackageIntegration } from './services/graphy-package-integration'

interface User {
  name: string
  email: string
  avatar?: string
  graphyLearnerId?: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  isInitialized: boolean
  isCreatingLearner: boolean
  learnerCreationError: string | null
  login: (userData: User) => void
  logout: () => void
  createGraphyLearner: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isCreatingLearner, setIsCreatingLearner] = useState(false)
  const [learnerCreationError, setLearnerCreationError] = useState<string | null>(null)

  // Define login function first to avoid initialization error
  const login = useCallback((userData: User) => {
    setIsLoggedIn(true)
    setUser(userData)
    setAuthCookie(userData)
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setUser(null)
    deleteAuthCookie()
  }, [])

  // Create Graphy learner when user logs in
  const createGraphyLearner = useCallback(async () => {
    if (!user || isCreatingLearner) return

    setIsCreatingLearner(true)
    setLearnerCreationError(null)

    try {
      const result = await graphyPackageIntegration.createLearnerFromAuth({
        name: user.name,
        email: user.email,
        mobile: undefined
      })

      if (result.success && result.data) {
        // Update user with Graphy learner ID
        const updatedUser = { ...user, graphyLearnerId: result.data.id }
        setUser(updatedUser)
        setAuthCookie(updatedUser)
      } else {
        setLearnerCreationError(result.error || 'Failed to create Graphy learner')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setLearnerCreationError(errorMessage)
    } finally {
      setIsCreatingLearner(false)
    }
  }, [user, isCreatingLearner])

  // Check for existing auth state on mount
  useEffect(() => {
    try {
      // Check for saved auth state in cookies
      const authData = getAuthCookie()
      if (authData && authData.isLoggedIn && authData.user) {
        setIsLoggedIn(true)
        setUser(authData.user)
      }
    } catch (error) {
      console.warn('Failed to load auth state from cookies:', error)
      // Clear potentially corrupted auth data
      deleteAuthCookie()
    }
    
    setIsInitialized(true)
  }, [])

  // Auto-create Graphy learner when user logs in (if not already created)
  useEffect(() => {
    if (isLoggedIn && user && !user.graphyLearnerId && !isCreatingLearner) {
      createGraphyLearner()
    }
  }, [isLoggedIn, user, isCreatingLearner, createGraphyLearner])

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      isInitialized, 
      isCreatingLearner,
      learnerCreationError,
      login, 
      logout,
      createGraphyLearner
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
