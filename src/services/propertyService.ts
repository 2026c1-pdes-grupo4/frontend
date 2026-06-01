import { properties as fixtureData } from '../models/fixtures'
import type { Property, PropertyFilter } from '../models/types'

export async function fetchProperties(filter: PropertyFilter = {}): Promise<Property[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return applyFilter(fixtureData, filter)
  }

  const params = buildParams(filter)
  const query = params.toString() ? `?${params}` : ''
  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties${query}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function buildParams(filter: PropertyFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (filter.city) p.set('city', filter.city)
  if (filter.province) p.set('province', filter.province)
  if (filter.propertyType) p.set('propertyType', filter.propertyType)
  if (filter.minPrice != null) p.set('minPrice', String(filter.minPrice))
  if (filter.maxPrice != null) p.set('maxPrice', String(filter.maxPrice))
  if (filter.minRooms != null) p.set('minRooms', String(filter.minRooms))
  return p
}

function applyFilter(list: Property[], filter: PropertyFilter): Property[] {
  return list.filter((p) => {
    if (filter.city && !p.city.toLowerCase().includes(filter.city.toLowerCase())) return false
    if (filter.province && !p.province.toLowerCase().includes(filter.province.toLowerCase())) return false
    if (filter.propertyType && p.propertyType !== filter.propertyType) return false
    if (filter.minPrice != null && p.price < filter.minPrice) return false
    if (filter.maxPrice != null && p.price > filter.maxPrice) return false
    if (filter.minRooms != null && p.rooms < filter.minRooms) return false
    return true
  })
}
