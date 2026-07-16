import { useState, useEffect } from 'react'
import { createPurchase, fetchMyPurchases } from '../services/purchaseService'
import { useAuthContext } from '../context/AuthContext'
import type { Purchase } from '../models/types'

export function usePurchases() {
  const { token } = useAuthContext()
  const [list, setList] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchMyPurchases(token)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const buyProperty = async (agencyPropertyId: number) => {
    if (!token) return
    const purchase = await createPurchase(token, agencyPropertyId)
    setList((prev) => [...prev, purchase])
  }

  return { list, loading, error, buyProperty }
}
