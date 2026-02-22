export type JarType = 'spend' | 'save' | 'give'
export type TransactionType = 'deposit' | 'withdrawal' | 'interest'

export interface Profile {
  id: string
  name: string
  age?: number
  avatar_color: string
  created_at: string
  updated_at: string
}

export interface Jar {
  id: string
  profile_id: string
  type: JarType
  balance: number
  goal_amount?: number
  goal_description?: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  jar_id: string
  profile_id: string
  type: TransactionType
  jar_type: JarType
  amount: number
  note?: string
  is_charity_log: boolean
  charity_recipient?: string
  created_at: string
}

export interface ProfileOverview {
  id: string
  name: string
  age?: number
  avatar_color: string
  spend_balance: number
  save_balance: number
  give_balance: number
  save_goal?: number
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      jars: {
        Row: Jar
        Insert: Omit<Jar, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Jar, 'id' | 'created_at' | 'updated_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>
      }
    }
    Views: {
      profile_overview: {
        Row: ProfileOverview
      }
    }
  }
}