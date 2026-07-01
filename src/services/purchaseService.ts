import { purchases as fixtureData } from '../models/fixtures'
import type { Purchase } from '../models/types'
import { apiFetch } from './http'

const API = import.meta.env.VITE_API_URL

export async function createPurchase(token: string, agencyPropertyId: number): Promise<Purchase> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return {
      id: Date.now(),
      agencyId: 0,
      propertyAddress: '',
      agencyName: '',
      purchasePrice: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
    }
  }

  const res = await apiFetch(`${API}/purchases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ agencyPropertyId }),
  })
  return res.json()
}

export async function fetchMyPurchases(token: string): Promise<Purchase[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return fixtureData

  const res = await apiFetch(`${API}/purchases/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
