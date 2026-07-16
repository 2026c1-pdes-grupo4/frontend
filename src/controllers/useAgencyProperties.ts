import { useState, useEffect, useCallback } from 'react'
import { fetchAgencyProperties, createProperty, updateProperty, deleteProperty, listExistingProperty, findPropertyByCadastral } from '../services/agencyService'
import { useAuthContext } from '../context/AuthContext'
import type { AgencyProperty, PropertyInput } from '../models/types'

export function useAgencyProperties() {
  const { token } = useAuthContext()
  const [list, setList] = useState<AgencyProperty[]>([])
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

  const checkDuplicate = useCallback(async (cadastral: { circumscription: string; section: string; block: string; parcel: string }) => {
    if (!token) return null
    return findPropertyByCadastral(token, cadastral)
  }, [token])

  const linkExisting = useCallback(async (propertyId: number, listedPrice: number) => {
    if (!token) return
    const created = await listExistingProperty(token, propertyId, listedPrice)
    setList(prev => [...prev, created])
  }, [token])

  const edit = useCallback(async (ap: AgencyProperty, data: Partial<PropertyInput>) => {
    if (!token) return
    const updated = await updateProperty(token, ap.id, ap.propertyId, data)
    setList(prev => prev.map(p => p.id === ap.id ? updated : p))
  }, [token])

  const remove = useCallback(async (id: number) => {
    if (!token) return
    await deleteProperty(token, id)
    setList(prev => prev.filter(p => p.id !== id))
  }, [token])

  return { list, loading, error, add, edit, remove, linkExisting, checkDuplicate }
}
