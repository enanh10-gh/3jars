'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Profile } from '@/lib/supabase/types'

interface ProfileContextType {
  currentProfile: Profile | null
  setCurrentProfile: (profile: Profile | null) => void
  isLoading: boolean
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedProfile = localStorage.getItem('currentProfile')
    if (savedProfile) {
      try {
        setCurrentProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Error loading saved profile:', error)
      }
    }
    setIsLoading(false)
  }, [])

  const handleSetCurrentProfile = (profile: Profile | null) => {
    setCurrentProfile(profile)
    if (profile) {
      localStorage.setItem('currentProfile', JSON.stringify(profile))
    } else {
      localStorage.removeItem('currentProfile')
    }
  }

  return (
    <ProfileContext.Provider 
      value={{ 
        currentProfile, 
        setCurrentProfile: handleSetCurrentProfile, 
        isLoading 
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}