import type { AgencyProperty, Purchase, AgencyClient, PropertyInput } from '../models/types'
import { agencyProperties as agencyPropFixtures, purchases as purchaseFixtures, agencyClients as clientFixtures } from '../models/fixtures'
import { apiFetch } from './http'
import { extractId } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL
const USE_FIXTURES = import.meta.env.VITE_USE_FIXTURES === 'true'

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function fetchAgencyProperties(token: string): Promise<AgencyProperty[]> {
  if (USE_FIXTURES) {
    const agencyId = extractId(token)
    return agencyPropFixtures.filter(p => p.agencyId === agencyId)
  }
  const res = await apiFetch(`${API}/agency-properties/agency/me`, { headers: authHeaders(token) })
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
  const propRes = await apiFetch(`${API}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const property = await propRes.json() as { id: number }

  const listingRes = await apiFetch(`${API}/agency-properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ propertyId: property.id, listedPrice: data.price }),
  })
  return listingRes.json()
}

export async function updateProperty(token: string, agencyPropertyId: number, propertyId: number, data: Partial<PropertyInput>): Promise<AgencyProperty> {
  if (USE_FIXTURES) {
    const found = agencyPropFixtures.find(p => p.id === agencyPropertyId)
    return { ...found!, ...data, listedPrice: data.price ?? found!.listedPrice }
  }
  await apiFetch(`${API}/properties/${propertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  const res = await apiFetch(`${API}/agency-properties/${agencyPropertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ propertyId, listedPrice: data.price }),
  })
  return res.json()
}

export async function deleteProperty(token: string, id: number): Promise<void> {
  if (USE_FIXTURES) return
  await apiFetch(`${API}/agency-properties/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
}

export async function fetchAgencyPurchases(token: string): Promise<Purchase[]> {
  if (USE_FIXTURES) {
    const agencyId = extractId(token)
    return purchaseFixtures.filter(p => p.agencyId === agencyId)
  }
  const res = await apiFetch(`${API}/purchases/agency/me`, { headers: authHeaders(token) })
  return res.json()
}

export async function fetchAgencyClients(token: string): Promise<AgencyClient[]> {
  if (USE_FIXTURES) {
    const agencyId = extractId(token)
    return clientFixtures.filter(c => c.agencyId === agencyId)
  }
  const res = await apiFetch(`${API}/agencies/me/clients`, { headers: authHeaders(token) })
  return res.json()
}
