export type ProfileType = 'buyer' | 'seller' | 'admin'
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial'

export interface User {
  userId: number
  username: string
  email: string
  password: string
  profileType: ProfileType
}

export interface Agency {
  agencyId: number
  username: string
  email: string
  password: string
  adminUserId: number
}

export interface Property {
  propertyId: number
  propertyType: PropertyType
  price: number
  address: string
  city: string
  province: string
  areaSq: number
  rooms: number
  description: string
  available: boolean
  agencyId: number
}

export interface Favorite {
  favoriteId: number
  userId: number
  propertyId: number
  savedDate: string
  savedPrice: number
  score: number
  comment: string
}

export interface Purchase {
  purchaseId: number
  userId: number
  propertyId: number
  purchasePrice: number
  purchaseDate: string
}
