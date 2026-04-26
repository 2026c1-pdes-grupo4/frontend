import { properties as fixtureProperties, agencyProperties } from '../models/fixtures'
import type { PropertyListing } from '../models/types'

export async function fetchListings(): Promise<PropertyListing[]> {
  if (import.meta.env.VITE_USE_FIXTURES === 'true') {
    return agencyProperties.map((ap) => ({
      agencyPropertyId: ap.agencyPropertyId,
      listedPrice: ap.listedPrice,
      listedDate: ap.listedDate,
      pictures: ap.pictures,
      property: fixtureProperties.find((p) => p.propertyId === ap.propertyId)!,
    }))
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/properties`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
