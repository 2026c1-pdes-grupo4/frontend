export type ProfileType = 'buyer' | 'seller' | 'admin'
export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial'

export interface User {
  user_id: number
  username: string
  email: string
  password: string
  profile_type: ProfileType
}

export interface Agency {
  agency_id: number
  username: string
  email: string
  password: string
  admin_user_id: number
}

export interface Property {
  property_id: number
  property_type: PropertyType
  price: number
  address: string
  city: string
  province: string
  area_sq: number
  rooms: number
  description: string
  available: boolean
  agency_id: number
}

export interface Favorite {
  favorite_id: number
  user_id: number
  property_id: number
  saved_date: string
  saved_price: number
  score: number
  comment: string
}

export interface Purchase {
  purchase_id: number
  user_id: number
  property_id: number
  purchase_price: number
  purchase_date: string
}
