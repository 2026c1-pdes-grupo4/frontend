import type { AgencyProperty, Purchase, AgencyClient, PropertyInput } from '../models/types'
import { agencyProperties as agencyPropFixtures, purchases as purchaseFixtures, agencyClients as clientFixtures } from '../models/fixtures'

const API = import.meta.env.VITE_API_URL
const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAgencyProperties(token: string): Promise<AgencyProperty[]> {
  if (USE_FIXTURES) return agencyPropFixtures
  const res = await fetch(`${API}/agency-properties/agency/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function createProperty(token: string, data: PropertyInput): Promise<AgencyProperty> {
  if (USE_FIXTURES) {
    return {
      id: Date.now(),
      propertyId: Date.now(),
      address: data.address,
      city: data.city,
      propertyType: data.propertyType,
      listedPrice: data.price,
      listedDate: new Date().toISOString().split('T')[0],
      available: true,
      agencyId: 1,
      agencyName: 'ritondo_propiedades',
    }
  }
  const propRes = await fetch(`${API}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!propRes.ok) throw new Error(`HTTP ${propRes.status}`)
  const property = await propRes.json() as { id: number }

  const listingRes = await fetch(`${API}/agency-properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ propertyId: property.id, listedPrice: data.price }),
  })
  if (!listingRes.ok) throw new Error(`HTTP ${listingRes.status}`)
  return listingRes.json()
}

export async function updateProperty(token: string, agencyPropertyId: number, propertyId: number, data: Partial<PropertyInput>): Promise<AgencyProperty> {
  if (USE_FIXTURES) {
    const found = agencyPropFixtures.find(p => p.id === agencyPropertyId)
    return { ...found!, ...data, listedPrice: data.price ?? found!.listedPrice }
  }
  await fetch(`${API}/properties/${propertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const res = await fetch(`${API}/agency-properties/${agencyPropertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ propertyId, listedPrice: data.price }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function deleteProperty(token: string, id: number): Promise<void> {
  if (USE_FIXTURES) return
  const res = await fetch(`${API}/agency-properties/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function fetchAgencyPurchases(token: string): Promise<Purchase[]> {
  if (USE_FIXTURES) return purchaseFixtures
  const res = await fetch(`${API}/purchases/agency/me`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchAgencyClients(token: string): Promise<AgencyClient[]> {
  if (USE_FIXTURES) return clientFixtures
  const res = await fetch(`${API}/agencies/me/clients`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
