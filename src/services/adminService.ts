import { users, agencies, favorites, purchases } from '../models/fixtures'
import type { User, Agency, Favorite, Purchase, AdminFavoriteRaw, AdminPurchaseRaw } from '../models/types'

const BASE = import.meta.env.VITE_API_URL
const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true'

async function authGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchAllUsers(token: string): Promise<User[]> {
  if (USE_FIXTURES) return users
  return authGet('/admin/users', token)
}

export async function fetchAllAgencies(token: string): Promise<Agency[]> {
  if (USE_FIXTURES) return agencies
  return authGet('/admin/agencies', token)
}

export async function fetchAllFavorites(token: string): Promise<Favorite[]> {
  if (USE_FIXTURES) return favorites
  const raw = await authGet<AdminFavoriteRaw[]>('/admin/favorites', token)
  return raw.map((f) => ({
    id: f.favoriteId,
    agencyPropertyId: f.agencyProperty.agencyPropertyId,
    propertyAddress: f.agencyProperty.property.address,
    city: f.agencyProperty.property.city,
    agencyName: f.agencyProperty.agency.username,
    score: f.score,
    comment: f.comment,
    savedPrice: f.savedPrice,
    savedDate: String(f.savedDate),
  }))
}

export async function fetchAllPurchases(token: string): Promise<Purchase[]> {
  if (USE_FIXTURES) return purchases
  const raw = await authGet<AdminPurchaseRaw[]>('/admin/purchases', token)
  return raw.map((p) => ({
    id: p.purchaseId,
    propertyAddress: p.agencyProperty.property.address,
    agencyName: p.agencyProperty.agency.username,
    purchasePrice: p.purchasePrice,
    purchaseDate: String(p.purchaseDate),
  }))
}
