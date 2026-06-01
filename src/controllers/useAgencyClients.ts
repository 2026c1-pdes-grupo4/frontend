import { useState, useEffect } from 'react'
import { fetchAgencyClients } from '../services/agencyService'
import { useAuthContext } from '../context/AuthContext'
import type { AgencyClient } from '../models/types'

export function useAgencyClients() {
  const { token } = useAuthContext()
  const [list, setList] = useState<AgencyClient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchAgencyClients(token)
      .then(setList)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  return { list, loading, error }
}
