'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileCard } from '@/components/profile-card'
import { useProfile } from '@/context/profile-context'
import { useProfiles } from '@/hooks/useProfile'
import { Profile } from '@/lib/supabase/types'
import { Coins, Plus, Loader2 } from 'lucide-react'

export default function ProfileSelection() {
  const router = useRouter()
  const { setCurrentProfile } = useProfile()
  const { profiles, isLoading, error } = useProfiles()
  const [showAddProfile, setShowAddProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [newProfileAge, setNewProfileAge] = useState('')
  const [newProfileColor, setNewProfileColor] = useState('#3B82F6')

  const handleProfileSelect = (profile: Profile) => {
    setCurrentProfile(profile)
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-xl text-white">Loading profiles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center">
        <div className="bg-white/90 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-600 mb-4">Error loading profiles: {error}</p>
          <p className="text-gray-600 mb-4">Make sure Supabase is configured correctly.</p>
          <p className="text-sm text-gray-500">Check that your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Coins className="h-16 w-16 text-yellow-500 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4">
            3Jars Money Manager
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Who&apos;s managing their money today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {profiles.length === 0 ? (
            <div className="col-span-3 text-center">
              <p className="text-white text-xl mb-4">No profiles yet!</p>
              <p className="text-white/80">Click below to add your first child&apos;s profile.</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onClick={() => handleProfileSelect(profile)}
              />
            ))
          )}
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => setShowAddProfile(true)}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <Plus size={20} />
            Add New Profile
          </button>
        </div>
      </div>
    </div>
  )
}