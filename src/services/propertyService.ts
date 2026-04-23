import { properties as fixtureData } from '../models/fixtures'
import type { Property } from '../models/types'

export async function fetchProperties(): Promise<Property[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return fixtureData
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
