import { users, agencies, favorites, purchases, topBuyers, topRankedProperties, topAgenciesSales } from '../models/fixtures'
import type { User, Agency, Favorite, Purchase, AdminFavoriteRaw, AdminPurchaseRaw, TopBuyer, TopRankedProperty, TopAgencySales, UserInput, AgencyInput } from '../models/types'
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

export async function createUser(token: string, data: UserInput): Promise<User> {
  if (USE_FIXTURES) {
    const created: User = { id: Date.now(), username: data.username, email: data.email, profileType: data.profileType }
    users.push(created)
    return created
  }
  const res = await apiFetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateUser(token: string, id: number, data: UserInput): Promise<User> {
  if (USE_FIXTURES) {
    const updated: User = { id, username: data.username, email: data.email, profileType: data.profileType }
    const idx = users.findIndex(u => u.id === id)
    if (idx !== -1) users[idx] = updated
    return updated
  }
  const res = await apiFetch(`${BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteUser(token: string, id: number): Promise<void> {
  if (USE_FIXTURES) {
    const idx = users.findIndex(u => u.id === id)
    if (idx !== -1) users.splice(idx, 1)
    return
  }
  await apiFetch(`${BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function fetchAllAgencies(token: string): Promise<Agency[]> {
  if (USE_FIXTURES) return agencies
  return authGet('/admin/agencies', token)
}

export async function createAgency(token: string, data: AgencyInput): Promise<Agency> {
  if (USE_FIXTURES) {
    const created: Agency = { id: Date.now(), username: data.username, email: data.email }
    agencies.push(created)
    return created
  }
  const res = await apiFetch(`${BASE}/agencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateAgency(token: string, id: number, data: AgencyInput): Promise<Agency> {
  if (USE_FIXTURES) {
    const updated: Agency = { id, username: data.username, email: data.email }
    const idx = agencies.findIndex(a => a.id === id)
    if (idx !== -1) agencies[idx] = updated
    return updated
  }
  const res = await apiFetch(`${BASE}/agencies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteAgency(token: string, id: number): Promise<void> {
  if (USE_FIXTURES) {
    const idx = agencies.findIndex(a => a.id === id)
    if (idx !== -1) agencies.splice(idx, 1)
    return
  }
  await apiFetch(`${BASE}/agencies/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
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
    agencyId: p.agencyProperty.agency.agencyId,
    propertyAddress: p.agencyProperty.property.address,
    agencyName: p.agencyProperty.agency.username,
    purchasePrice: p.purchasePrice,
    purchaseDate: String(p.purchaseDate),
    buyerId: p.user.userId,
    buyerUsername: p.user.username,
    buyerEmail: p.user.email,
  }))
}
