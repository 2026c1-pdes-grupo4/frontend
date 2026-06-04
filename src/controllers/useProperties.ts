import { useState, useEffect } from 'react'
import { fetchProperties } from '../services/propertyService'
import { useAuthContext } from '../context/AuthContext'
import type { Property, PropertyFilter } from '../models/types'

export function useProperties(filter: PropertyFilter = {}) {
  const { token } = useAuthContext()
  const [list, setList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchProperties(filter, token)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filter), token])

  return { list, loading, error }
}
