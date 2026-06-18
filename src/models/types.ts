export interface User {
  id: number
  username: string
  email: string
  profileType: string
}

export interface Agency {
  id: number
  username: string
  email: string
}

export type PropertyType = 'house' | 'apartment'

export interface Property {
  id: number
  agencyPropertyId?: number
  propertyType: string
  price: number
  address: string
  city: string
  province: string
  areaSq: number
  rooms: number
  description: string
  available: boolean
  listedPrice?: number
  agencyId?: number
  agencyName?: string
}

export interface AgencyProperty {
  id: number
  propertyId: number
  address: string
  city: string
  propertyType: string
  listedPrice: number
  listedDate: string
  available: boolean
  agencyId: number
  agencyName: string
}

export interface Favorite {
  id: number
  agencyPropertyId: number
  propertyAddress: string
  city: string
  agencyName: string
  score: number
  comment: string
  savedPrice: number
  savedDate: string
}

export interface Purchase {
  id: number
  propertyAddress: string
  agencyName: string
  purchasePrice: number
  purchaseDate: string
}

export interface AgencyClient {
  userId: number
  username: string
  email: string
}

export interface PropertyFilter {
  city?: string
  province?: string
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  minRooms?: number
}

export interface PropertyInput {
  propertyType: string
  price: number
  address: string
  city: string
  province: string
  areaSq: number
  rooms: number
  description: string
}

export type AdminFavoriteRaw = {
  favoriteId: number
  agencyProperty: { agencyPropertyId: number; property: { address: string; city: string }; agency: { username: string } }
  savedDate: string
  savedPrice: number
  score: number
  comment: string
}

export type AdminPurchaseRaw = {
  purchaseId: number
  agencyProperty: { property: { address: string }; agency: { username: string } }
  purchasePrice: number
  purchaseDate: string
}

export interface TopBuyer {
  userId: number
  username: string
  purchases: number
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}
