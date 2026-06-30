import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useAuth } from './AuthContext'

export function useIsAdmin() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) { setIsAdmin(false); setChecking(false); return }

    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setIsAdmin(!!data)
        setChecking(false)
      })
  }, [user])

  return { isAdmin, checking }
}