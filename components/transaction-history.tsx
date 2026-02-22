'use client'

import React, { useState } from 'react'
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Filter,
  Calendar,
  Wallet,
  PiggyBank,
  Heart,
  Percent
} from 'lucide-react'
import { JarType } from '@/lib/supabase/types'

export interface Transaction {
  id: string
  jarType: JarType
  amount: number
  type: 'add' | 'spend' | 'interest'
  note: string
  timestamp: Date
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  isVisible: boolean
}

export function TransactionHistory({ transactions, isVisible }: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'add' | 'spend' | 'interest'>('all')
  const [filterJar, setFilterJar] = useState<'all' | JarType>('all')

  if (!isVisible) return null

  const jarConfig = {
    spend: { 
      label: 'Spend', 
      icon: Wallet, 
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    save: { 
      label: 'Save', 
      icon: PiggyBank, 
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    give: { 
      label: 'Give', 
      icon: Heart, 
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  }

  const typeConfig = {
    add: {
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100',
      symbol: '+',
      label: 'Added'
    },
    spend: {
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100',
      symbol: '-',
      label: 'Spent'
    },
    interest: {
      icon: Percent,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      symbol: '+',
      label: 'Interest'
    }
  }

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => filterJar === 'all' || t.jarType === filterJar)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const getTotalByType = (type: 'add' | 'spend' | 'interest') => {
    return filteredTransactions
      .filter(t => t.type === type)
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return (
    <div className="mt-8 rounded-3xl bg-white/95 p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Clock className="h-6 w-6 text-purple-600" />
          Transaction History
        </h2>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-sm text-gray-600">Total Added</p>
            <p className="text-lg font-bold text-green-600">
              +${getTotalByType('add').toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-lg font-bold text-red-600">
              -${getTotalByType('spend').toFixed(2)}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center">
            <p className="text-sm text-gray-600">Total Interest</p>
            <p className="text-lg font-bold text-purple-600">
              +${getTotalByType('interest').toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
        </div>
        
        {/* Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="add">Added</option>
          <option value="spend">Spent</option>
          <option value="interest">Interest</option>
        </select>

        {/* Jar Filter */}
        <select
          value={filterJar}
          onChange={(e) => setFilterJar(e.target.value as any)}
          className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Jars</option>
          <option value="spend">Spend Jar</option>
          <option value="save">Save Jar</option>
          <option value="give">Give Jar</option>
        </select>
      </div>

      {/* Transaction List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Add or spend money to see history</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const jar = jarConfig[transaction.jarType]
            const type = typeConfig[transaction.type]
            const JarIcon = jar.icon
            const TypeIcon = type.icon

            return (
              <div
                key={transaction.id}
                className={`rounded-lg border ${jar.border} p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {/* Jar Icon */}
                    <div className={`rounded-full ${jar.bg} p-2`}>
                      <JarIcon className={`h-5 w-5 ${jar.color}`} />
                    </div>
                    
                    {/* Transaction Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">
                          {jar.label} Jar
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${type.bg} ${type.color}`}>
                          <TypeIcon className="h-3 w-3" />
                          {type.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {transaction.note}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className={`text-lg font-bold ${type.color}`}>
                    {type.symbol}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {filteredTransactions.length > 5 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}