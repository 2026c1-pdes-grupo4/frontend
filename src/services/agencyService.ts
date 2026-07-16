import type { AgencyProperty, Purchase, PropertyInput, PropertySummary } from '../models/types'
import { agencyProperties as agencyPropFixtures, purchases as purchaseFixtures } from '../models/fixtures'
import { apiFetch, ApiError } from './http'
import { extractId } from '../models/jwt'

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
      province: data.province,
      propertyType: data.propertyType,
      areaSq: data.areaSq,
      rooms: data.rooms ?? 0,
      description: data.description,
      listedPrice: data.price,
      listedDate: new Date().toISOString().split('T')[0],
      available: true,
      agencyId: 1,
      agencyName: 'ritondo_propiedades',
      imageUrl: data.imageUrl,
    }
  }
  const payload: Record<string, unknown> = {
    propertyType: data.propertyType,
    address: data.address,
    city: data.city,
    province: data.province,
    areaSq: data.areaSq,
    description: data.description,
    ...(data.rooms !== undefined && { rooms: data.rooms }),
    ...(data.circumscription && { circumscription: data.circumscription }),
    ...(data.section && { section: data.section }),
    ...(data.block && { block: data.block }),
    ...(data.parcel && { parcel: data.parcel }),
  }
  const propRes = await apiFetch(`${API}/properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  })
  const property = await propRes.json() as { id: number }

  const listingPayload: Record<string, unknown> = {
    propertyId: property.id,
    listedPrice: data.price,
    ...(data.imageUrl && { imageUrl: data.imageUrl }),
  }
  const listingRes = await apiFetch(`${API}/agency-properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(listingPayload),
  })
  return listingRes.json()
}

export async function findPropertyByCadastral(
  token: string,
  cadastral: { circumscription: string; section: string; block: string; parcel: string },
): Promise<PropertySummary | null> {
  const params = new URLSearchParams(cadastral)
  try {
    const res = await apiFetch(`${API}/properties/find-by-cadastral?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export async function listExistingProperty(token: string, propertyId: number, listedPrice: number): Promise<AgencyProperty> {
  const res = await apiFetch(`${API}/agency-properties`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ propertyId, listedPrice }),
  })
  return res.json()
}

export async function updateProperty(token: string, agencyPropertyId: number, propertyId: number, data: Partial<PropertyInput>): Promise<AgencyProperty> {
  if (USE_FIXTURES) {
    const found = agencyPropFixtures.find(p => p.id === agencyPropertyId)
    return { ...found!, ...data, listedPrice: data.price ?? found!.listedPrice }
  }
  const propertyPayload: Record<string, unknown> = {
    ...(data.propertyType && { propertyType: data.propertyType }),
    ...(data.address && { address: data.address }),
    ...(data.city && { city: data.city }),
    ...(data.province && { province: data.province }),
    ...(data.areaSq !== undefined && { areaSq: data.areaSq }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.rooms !== undefined && { rooms: data.rooms }),
  }
  await apiFetch(`${API}/properties/${propertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(propertyPayload),
  })
  const listingUpdatePayload: Record<string, unknown> = {
    propertyId,
    listedPrice: data.price,
    ...(data.imageUrl && { imageUrl: data.imageUrl }),
  }
  const res = await apiFetch(`${API}/agency-properties/${agencyPropertyId}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(listingUpdatePayload),
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
