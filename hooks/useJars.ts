import { useState, useEffect } from 'react'
import { Jar, JarType } from '@/lib/supabase/types'
import { 
  getJarsByProfileId,
  getJarByType,
  updateJarGoal,
  subscribeToProfileChanges
} from '@/lib/supabase/queries'

export function useJars(profileId: string | null) {
  const [jars, setJars] = useState<Jar[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profileId) {
      setJars([])
      setIsLoading(false)
      return
    }

    loadJars(profileId)

    // Subscribe to real-time updates
    const subscription = subscribeToProfileChanges(profileId, (payload) => {
      console.log('Jar update:', payload)
      loadJars(profileId) // Reload jars on any change
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [profileId])

  const loadJars = async (id: string) => {
    try {
      setIsLoading(true)
      const data = await getJarsByProfileId(id)
      setJars(data)
      setError(null)
    } catch (err) {
      console.error('Error loading jars:', err)
      setError('Failed to load jars')
    } finally {
      setIsLoading(false)
    }
  }

  const getJarBalance = (type: JarType): number => {
    const jar = jars.find(j => j.type === type)
    return jar?.balance || 0
  }

  const getBalances = () => {
    return {
      spend: getJarBalance('spend'),
      save: getJarBalance('save'),
      give: getJarBalance('give')
    }
  }

  const setGoal = async (type: JarType, amount: number, description: string) => {
    const jar = jars.find(j => j.type === type)
    if (!jar) throw new Error(`Jar of type ${type} not found`)
    
    try {
      await updateJarGoal(jar.id, amount, description)
      await loadJars(profileId!)
    } catch (err) {
      console.error('Error setting goal:', err)
      throw err
    }
  }

  return {
    jars,
    balances: getBalances(),
    isLoading,
    error,
    refetch: () => profileId && loadJars(profileId),
    setGoal
  }
}