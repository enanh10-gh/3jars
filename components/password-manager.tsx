'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Lock, Key, Check, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface PasswordManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordManager({ isOpen, onClose }: PasswordManagerProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const CURRENT_PASSWORD = process.env.NEXT_PUBLIC_PARENT_PASSWORD || '195811'

  const handleSubmit = () => {
    setError('')
    setSuccess(false)

    // Validate current password
    if (currentPassword !== CURRENT_PASSWORD) {
      setError('Current password is incorrect')
      return
    }

    // Validate new password
    if (!newPassword) {
      setError('Please enter a new password')
      return
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password')
      return
    }

    // In a real app, this would update the password in a database
    // For now, we'll just show success and instructions
    setSuccess(true)
    
    // Reset form after 3 seconds and close
    setTimeout(() => {
      handleClose()
    }, 3000)
  }

  const handleClose = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess(false)
    setShowCurrent(false)
    setShowNew(false)
    setShowConfirm(false)
    onClose()
  }

  const passwordRequirements = [
    { met: newPassword.length >= 4, text: 'At least 4 characters' },
    { met: newPassword !== currentPassword, text: 'Different from current password' },
    { met: newPassword === confirmPassword && confirmPassword !== '', text: 'Passwords match' }
  ]

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Parent Password">
      {success ? (
        <div className="space-y-4 text-center py-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            Password Update Instructions
          </h3>
          <div className="text-left bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 mb-2">
              To complete the password change:
            </p>
            <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
              <li>Open your <code className="bg-amber-100 px-1 rounded">.env.local</code> file</li>
              <li>Update <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_PARENT_PASSWORD={newPassword}</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
          <p className="text-sm text-gray-600">
            Your new password: <span className="font-mono font-bold">{newPassword}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-purple-100 p-4">
              <Key className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Password changes require updating your environment file and restarting the server.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {newPassword && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {req.met ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border border-gray-300" />
                    )}
                    <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 rounded-lg bg-purple-500 py-2.5 font-medium text-white hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-5 w-5" />
              Update Password
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}