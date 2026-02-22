'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'

interface AppPasswordGuardProps {
  onAuthenticated: () => void
}

export function AppPasswordGuard({ onAuthenticated }: AppPasswordGuardProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === '1958') {
      localStorage.setItem('app_authenticated', 'true')
      localStorage.setItem('app_auth_time', Date.now().toString())
      onAuthenticated()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-pink-300 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Lock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            3Jars Money App
          </h1>
          <p className="text-gray-600 mt-2">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 rounded-lg border-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                error 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center animate-pulse">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Enter App
          </button>
        </form>
      </div>
    </div>
  )
}