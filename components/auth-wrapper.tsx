'use client'

import { useState, useEffect } from 'react'
import { AppPasswordGuard } from './app-password-guard'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('app_authenticated')
    const authTime = localStorage.getItem('app_auth_time')
    
    if (authStatus === 'true' && authTime) {
      // Check if authentication is still valid (24 hours)
      const authTimestamp = parseInt(authTime)
      const now = Date.now()
      const hoursSinceAuth = (now - authTimestamp) / (1000 * 60 * 60)
      
      if (hoursSinceAuth < 24) {
        setIsAuthenticated(true)
      } else {
        // Clear expired authentication
        localStorage.removeItem('app_authenticated')
        localStorage.removeItem('app_auth_time')
      }
    }
    
    setIsLoading(false)
  }, [])

  const handleAuthenticated = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-blue-300 to-pink-300">
        <div className="text-2xl font-semibold text-white animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AppPasswordGuard onAuthenticated={handleAuthenticated} />
  }

  return <>{children}</>
}