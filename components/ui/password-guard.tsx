'use client'

import React, { useState } from 'react'
import { Lock, Unlock, AlertCircle } from 'lucide-react'

interface PasswordGuardProps {
  onVerified: () => void
  title?: string
  description?: string
}

export function PasswordGuard({ 
  onVerified, 
  title = "Password Required",
  description = "This action requires parent authorization"
}: PasswordGuardProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const PARENT_PASSWORD = process.env.NEXT_PUBLIC_PARENT_PASSWORD || '195811'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Trim both passwords to handle any whitespace issues
    const trimmedPassword = password.trim()
    const trimmedExpected = PARENT_PASSWORD.trim()
    
    if (trimmedPassword === trimmedExpected) {
      setPassword('')
      setError('')
      onVerified()
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-purple-100 p-4">
          <Lock className="h-8 w-8 text-purple-600" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Parent Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            autoFocus
          />
          {error && (
            <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full rounded-lg bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
        >
          <Unlock className="h-5 w-5" />
          Verify & Continue
        </button>
      </form>
    </div>
  )
}