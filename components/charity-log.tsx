'use client'

import React, { useState } from 'react'
import { Heart, Calendar, DollarSign, Building2, Plus, ExternalLink } from 'lucide-react'
import { Transaction } from '@/lib/supabase/types'
import { Modal } from '@/components/ui/modal'

interface CharityLogProps {
  transactions: Transaction[]
  isVisible: boolean
  onAddDonation: (amount: number, recipient: string, note: string) => Promise<void>
  currentBalance: number
}

export function CharityLog({ 
  transactions, 
  isVisible, 
  onAddDonation,
  currentBalance 
}: CharityLogProps) {
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [note, setNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  if (!isVisible) return null

  const charityTransactions = transactions.filter(t => t.is_charity_log)
  
  const totalDonated = charityTransactions.reduce((sum, t) => sum + t.amount, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleSubmitDonation = async () => {
    setError('')
    
    const donationAmount = parseFloat(amount)
    
    if (!amount || isNaN(donationAmount) || donationAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (!recipient.trim()) {
      setError('Please enter the charity/recipient name')
      return
    }
    
    if (donationAmount > currentBalance) {
      setError(`Insufficient balance. Available: $${currentBalance.toFixed(2)}`)
      return
    }
    
    setIsProcessing(true)
    try {
      await onAddDonation(
        donationAmount,
        recipient,
        note || `Donation to ${recipient}`
      )
      
      // Reset form
      setAmount('')
      setRecipient('')
      setNote('')
      setShowDonationModal(false)
    } catch (err) {
      setError('Failed to record donation. Please try again.')
      console.error('Donation error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const popularCharities = [
    'Local Food Bank',
    'Animal Shelter',
    'Children\'s Hospital',
    'Environmental Fund',
    'School Fundraiser',
    'Community Center'
  ]

  return (
    <div className="mt-8 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          Giving History
        </h2>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-sm text-gray-600">Total Given</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalDonated.toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center">
            <p className="text-sm text-gray-600">Available to Give</p>
            <p className="text-2xl font-bold text-green-600">
              ${currentBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowDonationModal(true)}
          className="flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Record Donation
        </button>
      </div>

      {charityTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No donations yet</p>
          <p className="text-sm mt-2">Start making a difference by recording your charitable giving!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {charityTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-lg border border-red-200 bg-red-50/50 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-red-100 p-2">
                    <Building2 className="h-5 w-5 text-red-600" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {transaction.charity_recipient || 'Charity'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {transaction.note}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-lg font-bold text-red-600">
                  ${transaction.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {charityTransactions.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-red-100 to-pink-100">
          <p className="text-sm text-gray-700 text-center">
            ✨ You've made {charityTransactions.length} donation{charityTransactions.length !== 1 ? 's' : ''} totaling ${totalDonated.toFixed(2)}! Keep up the generous spirit!
          </p>
        </div>
      )}

      {/* Donation Modal */}
      <Modal 
        isOpen={showDonationModal} 
        onClose={() => {
          setShowDonationModal(false)
          setError('')
          setAmount('')
          setRecipient('')
          setNote('')
        }} 
        title="Record a Donation"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Donate
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                max={currentBalance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Available: ${currentBalance.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Charity/Recipient Name
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., Red Cross, Local Food Bank"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            
            {/* Quick select buttons */}
            <div className="mt-2 flex flex-wrap gap-2">
              {popularCharities.map(charity => (
                <button
                  key={charity}
                  onClick={() => setRecipient(charity)}
                  className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  {charity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What is this donation for?"
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDonationModal(false)
                setError('')
                setAmount('')
                setRecipient('')
                setNote('')
              }}
              className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDonation}
              className="flex-1 rounded-lg bg-red-500 py-2.5 font-medium text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              disabled={isProcessing}
            >
              <Heart className="h-5 w-5" />
              {isProcessing ? 'Recording...' : 'Record Donation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}