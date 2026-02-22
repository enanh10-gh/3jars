import { useState, useEffect } from 'react'
import { Profile, ProfileOverview } from '@/lib/supabase/types'
import { 
  getProfiles, 
  getProfileById, 
  createProfile,
  getAllProfileOverviews
} from '@/lib/supabase/queries'

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [overviews, setOverviews] = useState<ProfileOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      setIsLoading(true)
      const [profilesData, overviewsData] = await Promise.all([
        getProfiles(),
        getAllProfileOverviews()
      ])
      setProfiles(profilesData)
      setOverviews(overviewsData)
      setError(null)
    } catch (err) {
      console.error('Error loading profiles:', err)
      setError('Failed to load profiles')
    } finally {
      setIsLoading(false)
    }
  }

  const addProfile = async (name: string, age: number, avatarColor: string) => {
    try {
      const newProfile = await createProfile(name, age, avatarColor)
      await loadProfiles() // Reload to get updated data with jars
      return newProfile
    } catch (err) {
      console.error('Error creating profile:', err)
      throw err
    }
  }

  return {
    profiles,
    overviews,
    isLoading,
    error,
    refetch: loadProfiles,
    addProfile
  }
}

export function useProfileById(id: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    loadProfile(id)
  }, [id])

  const loadProfile = async (profileId: string) => {
    try {
      setIsLoading(true)
      const data = await getProfileById(profileId)
      setProfile(data)
      setError(null)
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    profile,
    isLoading,
    error,
    refetch: () => id && loadProfile(id)
  }
}