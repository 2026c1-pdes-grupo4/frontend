import { useState, useEffect, useCallback } from 'react'
import { fetchAgencyProperties, createProperty, updateProperty, deleteProperty } from '../services/agencyService'
import { useAuthContext } from '../context/AuthContext'
import type { Property } from '../models/types'

type PropertyInput = Omit<Property, 'propertyId' | 'available' | 'agencyId'>

export function useAgencyProperties() {
  const { token } = useAuthContext()
  const [list, setList] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchAgencyProperties(token)
      .then(setList)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const add = useCallback(async (data: PropertyInput) => {
    if (!token) return
    const created = await createProperty(token, data)
    setList(prev => [...prev, created])
  }, [token])

  const edit = useCallback(async (id: number, data: Partial<PropertyInput>) => {
    if (!token) return
    const updated = await updateProperty(token, id, data)
    setList(prev => prev.map(p => p.propertyId === id ? { ...p, ...updated } : p))
  }, [token])

  const remove = useCallback(async (id: number) => {
    if (!token) return
    await deleteProperty(token, id)
    setList(prev => prev.filter(p => p.propertyId !== id))
  }, [token])

  return { list, loading, error, add, edit, remove }
}
