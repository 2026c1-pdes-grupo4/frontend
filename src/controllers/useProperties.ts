import { useState, useEffect } from 'react'
import { fetchListings } from '../services/propertyService'
import type { PropertyListing } from '../models/types'

export function useProperties() {
  const [list, setList] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { list, loading, error }
}
