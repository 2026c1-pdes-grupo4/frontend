import { useState, useEffect } from 'react'
import { fetchAgencyPurchases } from '../services/agencyService'
import { useAuthContext } from '../context/AuthContext'
import type { Purchase } from '../models/types'

export function useAgencyPurchases() {
  const { token } = useAuthContext()
  const [list, setList] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchAgencyPurchases(token)
      .then(setList)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  return { list, loading, error }
}
