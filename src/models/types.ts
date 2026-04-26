export type ProfileType = 'buyer' | 'admin'
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

export interface Cadastre {
  circunscripcion: string
  seccion: string
  manzana: string
  parcela: string
}

export interface Property {
  propertyId: number
  propertyType: PropertyType
  address: string
  city: string
  province: string
  areaSq: number
  rooms: number
  description: string
  available: boolean
  cadastre: Cadastre
}

export interface Picture {
  pictureId: number
  agencyPropertyId: number
  url: string
}

export interface AgencyProperty {
  agencyPropertyId: number
  agencyId: number
  propertyId: number
  listedDate: string
  listedPrice: number
  pictures: Picture[]
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

export interface PropertyListing {
  agencyPropertyId: number
  listedPrice: number
  listedDate: string
  pictures: Picture[]
  property: Property
}

export interface Purchase {
  purchaseId: number
  userId: number
  agencyPropertyId: number
  purchasePrice: number
  purchaseDate: string
}
