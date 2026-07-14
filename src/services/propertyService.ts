import { properties as fixtureData } from '../models/fixtures'
import type { AgencyProperty, PropertyFilter } from '../models/types'
import { apiFetch } from './http'

export async function fetchProperties(filter: PropertyFilter = {}, token?: string | null): Promise<AgencyProperty[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return applyFilter(fixtureData, filter)
  }

  const params = buildParams(filter)
  const query = params.toString() ? `?${params}` : ''
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await apiFetch(`${import.meta.env.VITE_API_URL}/properties/search${query}`, { headers })
  return res.json()
}

function buildParams(filter: PropertyFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (filter.city) p.set('city', filter.city)
  if (filter.province) p.set('province', filter.province)
  if (filter.propertyType) p.set('propertyType', filter.propertyType)
  if (filter.minPrice != null) p.set('priceMin', String(filter.minPrice))
  if (filter.maxPrice != null) p.set('priceMax', String(filter.maxPrice))
  if (filter.minRooms != null) p.set('rooms', String(filter.minRooms))
  return p
}

function applyFilter(list: AgencyProperty[], filter: PropertyFilter): AgencyProperty[] {
  return list.filter((p) => {
    if (filter.city && !p.city.toLowerCase().includes(filter.city.toLowerCase())) return false
    if (filter.province && !p.province.toLowerCase().includes(filter.province.toLowerCase())) return false
    if (filter.propertyType && p.propertyType !== filter.propertyType) return false
    if (filter.minPrice != null && p.listedPrice < filter.minPrice) return false
    if (filter.maxPrice != null && p.listedPrice > filter.maxPrice) return false
    if (filter.minRooms != null && p.rooms < filter.minRooms) return false
    return true
  })
}
