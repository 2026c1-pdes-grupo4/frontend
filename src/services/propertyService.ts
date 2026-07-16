import { properties as fixtureData } from '../models/fixtures'
import type { AgencyProperty, PagedResult, PropertyFilter } from '../models/types'
import { apiFetch } from './http'

export async function fetchProperties(filter: PropertyFilter = {}, token?: string | null, page = 1, pageSize = 10): Promise<PagedResult<AgencyProperty>> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    const filtered = applyFilter(fixtureData, filter)
    const start = (page - 1) * pageSize
    return {
      content: filtered.slice(start, start + pageSize),
      page,
      size: pageSize,
      totalElements: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    }
  }

  const params = buildParams(filter)
  params.set('page', String(page - 1))
  params.set('size', String(pageSize))
  const headers: Record<string, string> = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await apiFetch(`${import.meta.env.VITE_API_URL}/properties/search?${params}`, { headers })
  return res.json()
}

function buildParams(filter: PropertyFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (filter.city) p.set('city', filter.city)
  if (filter.province) p.set('province', filter.province)
  if (filter.propertyType) p.set('propertyType', filter.propertyType)
  if (filter.minPrice != null) p.set('priceMin', String(filter.minPrice))
  if (filter.maxPrice != null) p.set('priceMax', String(filter.maxPrice))
  if (filter.minRooms != null) p.set('roomsMin', String(filter.minRooms))
  if (filter.maxRooms != null) p.set('roomsMax', String(filter.maxRooms))
  return p
}

function applyFilter(list: AgencyProperty[], filter: PropertyFilter): AgencyProperty[] {
  return list.filter((p) => {
    if (filter.city && !p.city.toLowerCase().includes(filter.city.toLowerCase())) return false
    if (filter.province && !p.province.toLowerCase().includes(filter.province.toLowerCase())) return false
    if (filter.propertyType && p.propertyType !== filter.propertyType) return false
    if (filter.minPrice != null && p.listedPrice < filter.minPrice) return false
    if (filter.maxPrice != null && p.listedPrice > filter.maxPrice) return false
    if (filter.minRooms != null && (p.rooms ?? 0) < filter.minRooms) return false
    if (filter.maxRooms != null && (p.rooms ?? 0) > filter.maxRooms) return false
    return true
  })
}
