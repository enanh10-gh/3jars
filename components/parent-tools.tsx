'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { PasswordManager } from '@/components/password-manager'
import { Lock, Unlock, TrendingUp, DollarSign, CheckCircle, Key } from 'lucide-react'
import { calculateInterest, formatInterestDate } from '@/lib/interest-calculator'

interface ParentToolsProps {
  isOpen: boolean
  onClose: () => void
  profiles: Array<{
    id: string
    name: string
    saveBalance: number
  }>
  onProcessInterest: (interests: Array<{
    profileId: string
    amount: number
    note: string
  }>) => void
}

export function ParentTools({ isOpen, onClose, profiles, onProcessInterest }: ParentToolsProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [processingComplete, setProcessingComplete] = useState(false)
  const [showPasswordManager, setShowPasswordManager] = useState(false)

  // Simple password check (in production, this should be more secure)
   const PARENT_PASSWORD = process.env.NEXT_PUBLIC_PARENT_PASSWORD || '195811' // Change this to your desired password
   
  // Debug logging
  console.log('ParentTools - Password from env:', process.env.NEXT_PUBLIC_PARENT_PASSWORD)
  console.log('ParentTools - Using password:', PARENT_PASSWORD)

  const handleUnlock = () => {
    console.log('ParentTools - Entered password:', password)
    console.log('ParentTools - Expected password:', PARENT_PASSWORD)
    console.log('ParentTools - Passwords match?', password === PARENT_PASSWORD)
    
    if (password === PARENT_PASSWORD) {
      setIsUnlocked(true)
      setError('')
      setPassword('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleProcessInterest = () => {
    const interests = profiles.map(profile => {
      const { amount, isFlat } = calculateInterest(profile.saveBalance)
      return {
        profileId: profile.id,
        amount,
        note: `Monthly Interest Reward - ${formatInterestDate()} (${
          isFlat ? 'Flat $5 bonus' : '10% interest'
        })`
      }
    })

    onProcessInterest(interests)
    setProcessingComplete(true)

    // Reset after 3 seconds
    setTimeout(() => {
      setProcessingComplete(false)
      handleClose()
    }, 3000)
  }

  const handleClose = () => {
    setIsUnlocked(false)
    setPassword('')
    setError('')
    setProcessingComplete(false)
    onClose()
  }

  const getTotalInterest = () => {
    return profiles.reduce((total, profile) => {
      const { amount } = calculateInterest(profile.saveBalance)
      return total + amount
    }, 0)
  }

  return (
    <>
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Parent Tools"
    >
      {!isUnlocked ? (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-gray-100 p-4">
              <Lock className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          
          <p className="text-center text-gray-600">
            This section is password protected
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Enter parent password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          
          <button
            onClick={handleUnlock}
            className="w-full rounded-lg bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
          >
            <Unlock className="h-5 w-5" />
            Unlock
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {processingComplete ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Interest Processed Successfully!
              </h3>
              <p className="text-gray-600">
                Monthly interest has been added to all Save jars
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">
                    Process Monthly Interest
                  </h3>
                </div>
                <p className="text-sm text-purple-700">
                  Calculate and add interest to all children&apos;s Save jars
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Interest Preview:</h4>
                
                {profiles.map(profile => {
                  const { amount, isFlat } = calculateInterest(profile.saveBalance)
                  return (
                    <div key={profile.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          {profile.name}
                        </span>
                        <span className="text-green-600 font-semibold">
                          +${amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Current Save Balance: ${profile.saveBalance.toFixed(2)}</div>
                        <div className="mt-1">
                          {isFlat ? (
                            <span className="text-blue-600">
                              Flat bonus (balance under $100)
                            </span>
                          ) : (
                            <span className="text-green-600">
                              10% interest rate applied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total Interest to Add:</span>
                  <span className="text-green-600">
                    ${getTotalInterest().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProcessInterest}
                  className="flex-1 rounded-lg bg-green-500 py-2.5 font-medium text-white hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="h-5 w-5" />
                  Process Interest
                </button>
              </div>

              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowPasswordManager(true)}
                  className="w-full rounded-lg bg-purple-100 py-2.5 font-medium text-purple-700 hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Key className="h-5 w-5" />
                  Change Password
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>

    <PasswordManager 
      isOpen={showPasswordManager}
      onClose={() => setShowPasswordManager(false)}
    />
    </>
  )
}