import type { Property, Purchase, AgencyClient } from '../models/types'
import { properties as propFixtures, purchases as purchaseFixtures, agencyClients as clientFixtures } from '../models/fixtures'

type PropertyInput = Omit<Property, 'propertyId' | 'available' | 'agencyId'>

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAgencyProperties(token: string): Promise<Property[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return propFixtures.filter(p => p.agencyId === 1)
  const res = await fetch(`${import.meta.env.VITE_API_URL}/agency-properties/agency/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createProperty(token: string, data: PropertyInput): Promise<Property> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return { ...data, propertyId: Date.now(), available: true, agencyId: 1 }
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function updateProperty(token: string, id: number, data: Partial<PropertyInput>): Promise<Property> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return { propertyId: id, available: true, agencyId: 1, propertyType: 'apartment', price: 0, address: '', city: '', province: '', areaSq: 0, rooms: 0, description: '', ...data }
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteProperty(token: string, id: number): Promise<void> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return
  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchAgencyPurchases(token: string): Promise<Purchase[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return purchaseFixtures
  const res = await fetch(`${import.meta.env.VITE_API_URL}/purchases/agency/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchAgencyClients(token: string): Promise<AgencyClient[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') return clientFixtures
  const res = await fetch(`${import.meta.env.VITE_API_URL}/agencies/me/clients`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
