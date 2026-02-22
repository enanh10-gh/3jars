import { Profile } from './supabase/types'

export interface InterestCalculation {
  profileId: string
  profileName: string
  currentBalance: number
  interestAmount: number
  isFlat: boolean
  description: string
}

/**
 * Calculate monthly interest for a save jar
 * Rules:
 * - If balance < $100: Flat $5 bonus
 * - If balance >= $100: 10% interest
 */
export function calculateInterest(balance: number): { amount: number; isFlat: boolean } {
  if (balance < 100) {
    return { amount: 5.00, isFlat: true }
  } else {
    return { amount: balance * 0.10, isFlat: false }
  }
}

/**
 * Calculate interest for all profiles
 */
export function calculateInterestForProfiles(
  profiles: Profile[],
  saveBalances: Map<string, number>
): InterestCalculation[] {
  return profiles.map(profile => {
    const balance = saveBalances.get(profile.id) || 0
    const { amount, isFlat } = calculateInterest(balance)
    
    return {
      profileId: profile.id,
      profileName: profile.name,
      currentBalance: balance,
      interestAmount: amount,
      isFlat,
      description: isFlat 
        ? `Flat bonus of $${amount.toFixed(2)} (balance under $100)`
        : `10% interest: $${amount.toFixed(2)} on balance of $${balance.toFixed(2)}`
    }
  })
}

/**
 * Format date for display
 */
export function formatInterestDate(): string {
  const now = new Date()
  const month = now.toLocaleString('default', { month: 'long' })
  const year = now.getFullYear()
  return `${month} ${year}`
}