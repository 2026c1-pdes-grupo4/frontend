import { users, agencies, favorites, purchases } from '../models/fixtures'
import type { User, Agency, Favorite, Purchase } from '../models/types'

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
  return authGet('/users', token)
}

export async function fetchAllAgencies(token: string): Promise<Agency[]> {
  if (USE_FIXTURES) return agencies
  return authGet('/agencies', token)
}

export async function fetchAllFavorites(token: string): Promise<Favorite[]> {
  if (USE_FIXTURES) return favorites
  return authGet('/admin/favorites', token)
}

export async function fetchAllPurchases(token: string): Promise<Purchase[]> {
  if (USE_FIXTURES) return purchases
  return authGet('/admin/purchases', token)
}
