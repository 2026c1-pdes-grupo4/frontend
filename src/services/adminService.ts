import { users, agencies, favorites, purchases, topBuyers, topRankedProperties, topAgenciesSales } from '../models/fixtures'
import type { User, Agency, Favorite, Purchase, AdminFavoriteRaw, AdminPurchaseRaw, TopBuyer, TopRankedProperty, TopAgencySales } from '../models/types'
import { apiFetch } from './http'

const BASE = import.meta.env.VITE_API_URL
const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true'

async function authGet<T>(path: string, token: string): Promise<T> {
  const res = await apiFetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
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

export async function fetchTopBuyers(token: string): Promise<TopBuyer[]> {
  if (USE_FIXTURES) return topBuyers
  return authGet('/admin/reports/top-buyers', token)
}

export async function fetchTopRankedProperties(token: string): Promise<TopRankedProperty[]> {
  if (USE_FIXTURES) return topRankedProperties
  return authGet('/admin/reports/top-ranked-properties', token)
}

export async function fetchTopAgenciesSales(token: string): Promise<TopAgencySales[]> {
  if (USE_FIXTURES) return topAgenciesSales
  return authGet('/admin/reports/top-agencies-sales', token)
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
