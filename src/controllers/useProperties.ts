import { useState, useEffect } from 'react'
import { fetchProperties } from '../services/propertyService'
import type { Property } from '../models/types'

export function useProperties() {
  const [list, setList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { list, loading, error }
}
