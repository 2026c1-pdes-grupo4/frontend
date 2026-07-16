import { useState, useEffect } from 'react'
import { createPurchase, fetchMyPurchases } from '../services/purchaseService'
import { useAuthContext } from '../context/AuthContext'
import type { Purchase } from '../models/types'

export function usePurchases() {
  const { token } = useAuthContext()

  const buyProperty = async (agencyPropertyId: number) => {
    if (!token) return
    await createPurchase(token, agencyPropertyId)
  }

  return { buyProperty }
}

export function useMyPurchases() {
  const { token } = useAuthContext()
  const [list, setList] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prevToken, setPrevToken] = useState(token)

  if (token !== prevToken) {
    setPrevToken(token)
    if (token) setLoading(true)
  }

  useEffect(() => {
    if (!token) return
    fetchMyPurchases(token)
      .then(setList)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Error loading purchases'))
      .finally(() => setLoading(false))
  }, [token])

  return { list, loading, error }
}
