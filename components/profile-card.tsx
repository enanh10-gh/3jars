'use client'

import React from 'react'
import { User, Sparkles } from 'lucide-react'
import { Profile } from '@/lib/supabase/types'

interface ProfileCardProps {
  profile: Profile
  onClick: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${profile.avatar_color}88, ${profile.avatar_color})`
      }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/10" />
      
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="relative">
          <div 
            className="h-24 w-24 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: profile.avatar_color }}
          >
            <User size={48} />
          </div>
          <Sparkles className="absolute -right-2 -top-2 h-8 w-8 text-yellow-300 animate-pulse" />
        </div>
        
        <h2 className="text-2xl font-bold text-white drop-shadow-md">
          {profile.name}
        </h2>
        
        {profile.age && (
          <p className="text-lg text-white/90">
            Age {profile.age}
          </p>
        )}
        
        <div className="mt-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">
            Click to Enter
          </span>
        </div>
      </div>
    </button>
  )
}