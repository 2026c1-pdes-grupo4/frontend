import { useState, useEffect } from 'react'
import {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
} from '../services/adminService'

export {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
}

export function useAdminData<T>(fetcher: (token: string) => Promise<T[]>, token: string, active: boolean) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prevActive, setPrevActive] = useState(active)
  const [prevToken, setPrevToken] = useState(token)

  if (active !== prevActive || token !== prevToken) {
    setPrevActive(active)
    setPrevToken(token)
    if (active && token) {
      setLoading(true)
      setError(null)
    }
  }

  useEffect(() => {
    if (!active || !token) return
    fetcher(token)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [active, token, fetcher])

  return { data, loading, error }
}
