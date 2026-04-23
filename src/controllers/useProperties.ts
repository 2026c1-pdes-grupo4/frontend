import { useState, useEffect } from 'react'
import { properties as fixtureData } from '../models/fixtures'
import type { Property } from '../models/types'

export function useProperties() {
  const [list, setList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (import.meta.env.VITE_USE_FIXTURES === 'true') {
      setList(fixtureData)
      setLoading(false)
      return
    }

    fetch(`${import.meta.env.VITE_API_URL}/properties`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => setList(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { list, loading, error }
}
