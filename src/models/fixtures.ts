import type { User, Agency, Property, Favorite, Purchase, AgencyClient } from './types'

export const users: User[] = [
  { userId: 1, username: 'manuel', email: 'manuel@argentina.gob', password: '1234', profileType: 'buyer' },
  { userId: 2, username: 'claudia', email: 'claudia@mail.com', password: 'abcd', profileType: 'seller' },
  { userId: 3, username: 'karina', email: 'karina@argentina.gob', password: 'efgh', profileType: 'admin' },
]

export const agencies: Agency[] = [
  { agencyId: 1, username: 'ritondo_propiedades', email: 'ritondo@propiedades.com', password: 'ijkl', adminUserId: 2 },
]

export const properties: Property[] = [
  {
    propertyId: 1,
    propertyType: 'apartment',
    price: 230000,
    address: 'Miró 548',
    city: 'Ciudad de Buenos Aires',
    province: 'Ciudad de Buenos Aires',
    areaSq: 230,
    rooms: 3,
    description: 'semipiso hermoso cuatro ambientes al frente con cochera y baulera',
    available: true,
    agencyId: 1,
  },
  {
    propertyId: 2,
    propertyType: 'house',
    price: 200000,
    address: 'Indio Cua 380',
    city: 'Exaltación de la Cruz',
    province: 'Buenos Aires',
    areaSq: 400,
    rooms: 6,
    description: 'Oportunidad en Indio Cuá Golf Club: Casa con lote de 400 m2 en Exaltación de la Cruz',
    available: true,
    agencyId: 1,
  },
]

export const favorites: Favorite[] = [
  {
    favoriteId: 1,
    userId: 1,
    propertyId: 1,
    savedDate: '2025-04-01',
    savedPrice: 340000,
    score: 5,
    comment: 'Faltan renovaciones, buscar financiamiento',
  },
]

export const purchases: Purchase[] = [
  {
    purchaseId: 1,
    userId: 1,
    propertyId: 2,
    purchasePrice: 150000,
    purchaseDate: '2024-03-15',
  },
]

export const agencyClients: AgencyClient[] = [
  { userId: 1, username: 'manuel', email: 'manuel@argentina.gob' },
]
