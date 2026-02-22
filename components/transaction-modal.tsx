'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { PasswordGuard } from '@/components/ui/password-guard'
import { Plus, Minus, DollarSign, AlertCircle } from 'lucide-react'
import { JarType } from '@/lib/supabase/types'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'add' | 'spend'
  currentBalances: {
    spend: number
    save: number
    give: number
  }
  onSubmit: (transactions: TransactionInput[]) => void
}

export interface TransactionInput {
  jarType: JarType
  amount: number
  note?: string
}

export function TransactionModal({ 
  isOpen, 
  onClose, 
  mode, 
  currentBalances,
  onSubmit 
}: TransactionModalProps) {
  const [amounts, setAmounts] = useState({
    spend: '',
    save: '',
    give: ''
  })
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(mode !== 'add') // Only require password for 'add'

  const title = mode === 'add' ? 'Add Money' : 'Spend Money'
  const Icon = mode === 'add' ? Plus : Minus

  const jarConfig = {
    spend: { label: 'Spend', color: 'text-blue-600', bg: 'bg-blue-50' },
    save: { label: 'Save', color: 'text-green-600', bg: 'bg-green-50' },
    give: { label: 'Give', color: 'text-red-600', bg: 'bg-red-50' }
  }

  const handleSubmit = () => {
    const newErrors: string[] = []
    const transactions: TransactionInput[] = []

    // Validation and transaction creation
    Object.entries(amounts).forEach(([jar, amount]) => {
      const jarType = jar as JarType
      const numAmount = parseFloat(amount)
      
      if (amount && !isNaN(numAmount) && numAmount > 0) {
        if (mode === 'spend' && numAmount > currentBalances[jarType]) {
          newErrors.push(`Cannot spend $${numAmount} from ${jarConfig[jarType].label} jar (balance: $${currentBalances[jarType].toFixed(2)})`)
        } else {
          transactions.push({
            jarType,
            amount: numAmount,
            note: note || (mode === 'add' ? 'Money added' : 'Money spent')
          })
        }
      }
    })

    if (transactions.length === 0) {
      newErrors.push('Please enter at least one amount')
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(transactions)
    handleClose()
  }

  const handleClose = () => {
    setAmounts({ spend: '', save: '', give: '' })
    setNote('')
    setErrors([])
    setIsAuthenticated(mode !== 'add') // Reset auth state
    onClose()
  }

  const handlePasswordVerified = () => {
    setIsAuthenticated(true)
  }

  const getTotalAmount = () => {
    const total = Object.values(amounts).reduce((sum, amount) => {
      const num = parseFloat(amount) || 0
      return sum + num
    }, 0)
    return total.toFixed(2)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      {!isAuthenticated ? (
        <PasswordGuard 
          onVerified={handlePasswordVerified}
          title="Parent Authorization Required"
          description="Adding money requires parent permission"
        />
      ) : (
        <div className="space-y-6">
        {/* Note Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={mode === 'add' ? "e.g., Weekly allowance" : "e.g., Bought toy"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Jar Inputs */}
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter amounts for each jar:
          </p>
          
          {(Object.keys(jarConfig) as JarType[]).map((jar) => (
            <div key={jar} className={`rounded-lg p-4 ${jarConfig[jar].bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${jarConfig[jar].color}`}>
                  {jarConfig[jar].label} Jar
                </span>
                <span className="text-sm text-gray-600">
                  Balance: ${currentBalances[jar].toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amounts[jar]}
                  onChange={(e) => setAmounts({ ...amounts, [jar]: e.target.value })}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className={mode === 'add' ? 'text-green-600' : 'text-red-600'}>
              {mode === 'add' ? '+' : '-'}${getTotalAmount()}
            </span>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-4">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start gap-2 text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-gray-300 py-2.5 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 rounded-lg py-2.5 font-medium text-white transition-colors flex items-center justify-center gap-2 ${
              mode === 'add' 
                ? 'bg-green-500 hover:bg-green-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            {mode === 'add' ? 'Add Money' : 'Spend Money'}
          </button>
        </div>
      </div>
      )}
    </Modal>
  )
}