import { useState, useEffect } from 'react'
import { Transaction, JarType, TransactionType } from '@/lib/supabase/types'
import { 
  getTransactionsByProfileId,
  createTransaction,
  createMultipleTransactions,
  processMonthlyInterest,
  getCharityTransactions,
  getJarByType
} from '@/lib/supabase/queries'

export function useTransactions(profileId: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setTransactions([])
      setIsLoading(false)
      return
    }

    loadTransactions(profileId)
  }, [profileId])

  const loadTransactions = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await getTransactionsByProfileId(id)
      setTransactions(data)
      setError(null)
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError('Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const addMoney = async (transactions: Array<{
    jarType: JarType
    amount: number
    note: string
  }>) => {
    if (!profileId) throw new Error('No profile selected')

    try {
      // Get jar IDs for each transaction
      const transactionsWithJarIds = await Promise.all(
        transactions.map(async (t) => {
          const jar = await getJarByType(profileId, t.jarType)
          if (!jar) throw new Error(`Jar of type ${t.jarType} not found`)
          
          return {
            jarId: jar.id,
            profileId,
            type: 'deposit' as TransactionType,
            jarType: t.jarType,
            amount: t.amount,
            note: t.note
          }
        })
      )

      await createMultipleTransactions(transactionsWithJarIds)
      await loadTransactions(profileId)
    } catch (err) {
      console.error('Error adding money:', err)
      throw err
    }
  }

  const spendMoney = async (transactions: Array<{
    jarType: JarType
    amount: number
    note: string
  }>) => {
    if (!profileId) throw new Error('No profile selected')

    try {
      const transactionsWithJarIds = await Promise.all(
        transactions.map(async (t) => {
          const jar = await getJarByType(profileId, t.jarType)
          if (!jar) throw new Error(`Jar of type ${t.jarType} not found`)
          
          // Check balance
          if (jar.balance < t.amount) {
            throw new Error(`Insufficient balance in ${t.jarType} jar`)
          }
          
          return {
            jarId: jar.id,
            profileId,
            type: 'withdrawal' as TransactionType,
            jarType: t.jarType,
            amount: t.amount,
            note: t.note
          }
        })
      )

      await createMultipleTransactions(transactionsWithJarIds)
      await loadTransactions(profileId)
    } catch (err) {
      console.error('Error spending money:', err)
      throw err
    }
  }

  const addInterest = async (amount: number, note: string) => {
    if (!profileId) throw new Error('No profile selected')

    try {
      await processMonthlyInterest(profileId, amount, note)
      await loadTransactions(profileId)
    } catch (err) {
      console.error('Error adding interest:', err)
      throw err
    }
  }

  const addCharity = async (amount: number, recipient: string, note: string) => {
    if (!profileId) throw new Error('No profile selected')

    try {
      const giveJar = await getJarByType(profileId, 'give')
      if (!giveJar) throw new Error('Give jar not found')
      
      if (giveJar.balance < amount) {
        throw new Error('Insufficient balance in Give jar')
      }

      await createTransaction(
        giveJar.id,
        profileId,
        'withdrawal',
        'give',
        amount,
        note,
        true,
        recipient
      )
      await loadTransactions(profileId)
    } catch (err) {
      console.error('Error adding charity transaction:', err)
      throw err
    }
  }

  const getCharityLog = async () => {
    if (!profileId) return []
    
    try {
      return await getCharityTransactions(profileId)
    } catch (err) {
      console.error('Error loading charity log:', err)
      return []
    }
  }

  return {
    transactions,
    isLoading,
    error,
    refetch: () => profileId && loadTransactions(profileId),
    addMoney,
    spendMoney,
    addInterest,
    addCharity,
    getCharityLog
  }
}