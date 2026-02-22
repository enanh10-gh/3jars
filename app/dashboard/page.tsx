'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/context/profile-context'
import { ArrowLeft, User, Plus, Minus, Sparkles, TrendingUp, Settings, History, Heart, Loader2, LogOut } from 'lucide-react'
import { Jar } from '@/components/ui/jar'
import { JarType } from '@/lib/supabase/types'
import { TransactionModal, TransactionInput } from '@/components/transaction-modal'
import { ParentTools } from '@/components/parent-tools'
import { TransactionHistory } from '@/components/transaction-history'
import { CharityLog } from '@/components/charity-log'
import { useJars } from '@/hooks/useJars'
import { useTransactions } from '@/hooks/useTransactions'

export default function Dashboard() {
  const router = useRouter()
  const { currentProfile, isLoading: profileLoading } = useProfile()
  const { 
    balances: jarBalances, 
    jars,
    isLoading: jarsLoading, 
    refetch: refetchJars 
  } = useJars(currentProfile?.id || null)
  const { 
    transactions, 
    isLoading: transactionsLoading,
    addMoney: addMoneyToDb,
    spendMoney: spendMoneyFromDb,
    addInterest: addInterestToDb,
    addCharity: addCharityToDb,
    refetch: refetchTransactions
  } = useTransactions(currentProfile?.id || null)

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSpendModal, setShowSpendModal] = useState(false)
  const [showParentTools, setShowParentTools] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCharity, setShowCharity] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const isLoading = profileLoading || jarsLoading || transactionsLoading

  // Transform Supabase transactions to component format
  const transactionHistory = transactions.map(t => ({
    id: t.id,
    jarType: t.jar_type,
    amount: t.amount,
    type: (t.type === 'deposit' ? 'add' : t.type === 'withdrawal' ? 'spend' : 'interest') as 'add' | 'spend' | 'interest',
    note: t.note || '',
    timestamp: new Date(t.created_at)
  }))

  useEffect(() => {
    if (!profileLoading && !currentProfile) {
      router.push('/')
    }
  }, [currentProfile, profileLoading, router])

  const handleAddMoney = async (transactionsInput: TransactionInput[]) => {
    setIsProcessing(true)
    try {
      await addMoneyToDb(transactionsInput.map(t => ({
        jarType: t.jarType,
        amount: t.amount,
        note: t.note || 'Money added'
      })))
      await Promise.all([refetchJars(), refetchTransactions()])
      setShowAddModal(false)
    } catch (error) {
      console.error('Error adding money:', error)
      alert('Failed to add money. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSpendMoney = async (transactionsInput: TransactionInput[]) => {
    setIsProcessing(true)
    try {
      await spendMoneyFromDb(transactionsInput.map(t => ({
        jarType: t.jarType,
        amount: t.amount,
        note: t.note || 'Money spent'
      })))
      await Promise.all([refetchJars(), refetchTransactions()])
      setShowSpendModal(false)
    } catch (error) {
      console.error('Error spending money:', error)
      alert('Failed to spend money. ' + (error as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProcessInterest = async (interests: Array<{ profileId: string; amount: number; note: string }>) => {
    setIsProcessing(true)
    try {
      const interest = interests[0] // Current profile's interest
      if (interest) {
        await addInterestToDb(interest.amount, interest.note)
        await Promise.all([refetchJars(), refetchTransactions()])
      }
      setShowParentTools(false)
    } catch (error) {
      console.error('Error processing interest:', error)
      alert('Failed to process interest. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCharityDonation = async (amount: number, recipient: string, note: string) => {
    await addCharityToDb(amount, recipient, note)
    await Promise.all([refetchJars(), refetchTransactions()])
  }

  const handleLogout = () => {
    localStorage.removeItem('app_authenticated')
    localStorage.removeItem('app_auth_time')
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    )
  }

  if (!currentProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-blue-300 to-pink-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => {
              router.push('/')
            }}
            className="flex items-center gap-2 rounded-full bg-white/90 px-5 py-3 font-semibold text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl hover:scale-105"
          >
            <ArrowLeft size={20} />
            Back to Profiles
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm">
              <div 
                className="h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md"
                style={{ backgroundColor: currentProfile.avatar_color }}
              >
                <User size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentProfile.name}
                </h2>
                {currentProfile.age && (
                  <p className="text-sm text-gray-600">
                    Age {currentProfile.age}
                  </p>
                )}
              </div>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse ml-2" />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-500/90 px-4 py-3 font-semibold text-white shadow-lg backdrop-blur-sm transition-all hover:bg-red-600 hover:shadow-xl hover:scale-105"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {currentProfile.name}&apos;s Money Jars
            </h1>
            <p className="mt-2 text-gray-600 flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Total Balance: ${(jarBalances.spend + jarBalances.save + jarBalances.give).toFixed(2)}
            </p>
          </div>
          
          {/* Three Jars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Jar type="spend" balance={jarBalances.spend} />
            <Jar type="save" balance={jarBalances.save} />
            <Jar type="give" balance={jarBalances.give} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
            >
              <Plus className="h-6 w-6" />
              <span>Add Money</span>
              <Sparkles className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={() => setShowSpendModal(true)}
              className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
            >
              <Minus className="h-6 w-6" />
              <span>Spend Money</span>
            </button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setShowHistory(!showHistory)
                setShowCharity(false)
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-colors ${
                showHistory 
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              <History className="h-4 w-4" />
              History
            </button>
            <button
              onClick={() => {
                setShowCharity(!showCharity)
                setShowHistory(false)
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-colors ${
                showCharity 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <Heart className="h-4 w-4" />
              Giving Log
            </button>
            <button
              onClick={() => setShowParentTools(true)}
              className="flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2.5 font-medium text-purple-700 hover:bg-purple-200 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Parent Tools
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <TransactionHistory 
          transactions={transactionHistory}
          isVisible={showHistory}
        />

        {/* Charity Log */}
        <CharityLog
          transactions={transactions}
          isVisible={showCharity}
          onAddDonation={handleCharityDonation}
          currentBalance={jarBalances.give || 0}
        />
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
        currentBalances={jarBalances}
        onSubmit={handleAddMoney}
      />

      <TransactionModal
        isOpen={showSpendModal}
        onClose={() => setShowSpendModal(false)}
        mode="spend"
        currentBalances={jarBalances}
        onSubmit={handleSpendMoney}
      />

      <ParentTools
        isOpen={showParentTools}
        onClose={() => setShowParentTools(false)}
        profiles={currentProfile ? [{
          id: currentProfile.id,
          name: currentProfile.name,
          saveBalance: jarBalances.save || 0
        }] : []}
        onProcessInterest={handleProcessInterest}
      />
    </div>
  )
}