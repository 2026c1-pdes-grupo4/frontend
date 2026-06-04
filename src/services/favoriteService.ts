import { favorites as fixtureData } from '../models/fixtures'
import type { Favorite } from '../models/types'

export async function fetchFavorites(token: string): Promise<Favorite[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return fixtureData
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function saveFavorite(
  token: string,
  propertyId: number,
  score: number,
  comment: string,
): Promise<Favorite> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return {
      id: Date.now(),
      agencyPropertyId: propertyId,
      propertyAddress: '',
      city: '',
      agencyName: '',
      savedDate: new Date().toISOString().split('T')[0],
      savedPrice: 0,
      score,
      comment,
    }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ agencyPropertyId: propertyId, score, comment }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateFavorite(
  token: string,
  favoriteId: number,
  score: number,
  comment: string,
): Promise<Favorite> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return { id: favoriteId, agencyPropertyId: 0, propertyAddress: '', city: '', agencyName: '', savedDate: '', savedPrice: 0, score, comment }
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${favoriteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ score, comment }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteFavorite(token: string, favoriteId: number): Promise<void> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return

  const res = await fetch(`${import.meta.env.VITE_API_URL}/favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
