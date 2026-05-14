import { useState, useEffect } from 'react'
import { fetchFavorites, saveFavorite, updateFavorite, deleteFavorite } from '../services/favoriteService'
import { useAuthContext } from '../context/AuthContext'
import type { Favorite } from '../models/types'

export function useFavorites() {
  const { token } = useAuthContext()
  const [list, setList] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    fetchFavorites(token)
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const addFavorite = async (propertyId: number, score: number, comment: string) => {
    if (!token) return
    const saved = await saveFavorite(token, propertyId, score, comment)
    setList((prev) => [...prev, saved])
  }

  const isFavorite = (propertyId: number) => list.some((f) => f.propertyId === propertyId)

  const editFavorite = async (favoriteId: number, score: number, comment: string) => {
    if (!token) return
    const updated = await updateFavorite(token, favoriteId, score, comment)
    setList((prev) => prev.map((f) => (f.favoriteId === favoriteId ? { ...f, ...updated } : f)))
  }

  const removeFavorite = async (favoriteId: number) => {
    if (!token) return
    await deleteFavorite(token, favoriteId)
    setList((prev) => prev.filter((f) => f.favoriteId !== favoriteId))
  }

  return { list, loading, error, addFavorite, isFavorite, editFavorite, removeFavorite }
}
