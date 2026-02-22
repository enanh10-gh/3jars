import { supabase } from './client'
import { Profile, Jar, Transaction, ProfileOverview, JarType, TransactionType } from './types'

// Profile Queries
export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('age', { ascending: false })
  
  if (error) {
    console.error('Error fetching profiles:', error)
    return []
  }
  
  return data as Profile[]
}

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }
  
  return data as Profile
}

export async function createProfile(name: string, age: number, avatarColor: string) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      name,
      age,
      avatar_color: avatarColor
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }
  
  return data as Profile
}

// Jar Queries
export async function getJarsByProfileId(profileId: string) {
  const { data, error } = await supabase
    .from('jars')
    .select('*')
    .eq('profile_id', profileId)
  
  if (error) {
    console.error('Error fetching jars:', error)
    return []
  }
  
  return data as Jar[]
}

export async function getJarByType(profileId: string, type: JarType) {
  const { data, error } = await supabase
    .from('jars')
    .select('*')
    .eq('profile_id', profileId)
    .eq('type', type)
    .single()
  
  if (error) {
    console.error('Error fetching jar:', error)
    return null
  }
  
  return data as Jar
}

export async function updateJarGoal(jarId: string, goalAmount: number, goalDescription: string) {
  const { data, error } = await supabase
    .from('jars')
    .update({
      goal_amount: goalAmount,
      goal_description: goalDescription
    })
    .eq('id', jarId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating jar goal:', error)
    throw error
  }
  
  return data as Jar
}

// Transaction Queries
export async function getTransactionsByProfileId(profileId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  
  return data as Transaction[]
}

export async function createTransaction(
  jarId: string,
  profileId: string,
  type: TransactionType,
  jarType: JarType,
  amount: number,
  note: string,
  isCharityLog: boolean = false,
  charityRecipient?: string
) {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      jar_id: jarId,
      profile_id: profileId,
      type,
      jar_type: jarType,
      amount,
      note,
      is_charity_log: isCharityLog,
      charity_recipient: charityRecipient
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
  
  return data as Transaction
}

export async function createMultipleTransactions(transactions: Array<{
  jarId: string
  profileId: string
  type: TransactionType
  jarType: JarType
  amount: number
  note: string
  isCharityLog?: boolean
  charityRecipient?: string
}>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(
      transactions.map(t => ({
        jar_id: t.jarId,
        profile_id: t.profileId,
        type: t.type,
        jar_type: t.jarType,
        amount: t.amount,
        note: t.note,
        is_charity_log: t.isCharityLog || false,
        charity_recipient: t.charityRecipient
      }))
    )
    .select()
  
  if (error) {
    console.error('Error creating transactions:', error)
    throw error
  }
  
  return data as Transaction[]
}

// Profile Overview Query
export async function getProfileOverview(profileId: string) {
  const { data, error } = await supabase
    .from('profile_overview')
    .select('*')
    .eq('id', profileId)
    .single()
  
  if (error) {
    console.error('Error fetching profile overview:', error)
    return null
  }
  
  return data as ProfileOverview
}

export async function getAllProfileOverviews() {
  const { data, error } = await supabase
    .from('profile_overview')
    .select('*')
    .order('age', { ascending: false })
  
  if (error) {
    console.error('Error fetching profile overviews:', error)
    return []
  }
  
  return data as ProfileOverview[]
}

// Interest Processing
export async function processMonthlyInterest(profileId: string, amount: number, note: string) {
  // Get the save jar for this profile
  const saveJar = await getJarByType(profileId, 'save')
  
  if (!saveJar) {
    throw new Error('Save jar not found for profile')
  }
  
  // Create an interest transaction (triggers will update balance)
  return createTransaction(
    saveJar.id,
    profileId,
    'interest',
    'save',
    amount,
    note,
    false
  )
}

// Charity Transactions
export async function getCharityTransactions(profileId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('profile_id', profileId)
    .eq('is_charity_log', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching charity transactions:', error)
    return []
  }
  
  return data as Transaction[]
}

// Real-time subscriptions
export function subscribeToProfileChanges(profileId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`profile-${profileId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'jars',
        filter: `profile_id=eq.${profileId}`
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `profile_id=eq.${profileId}`
      },
      callback
    )
    .subscribe()
}