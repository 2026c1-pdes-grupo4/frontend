import type { User, Agency, Property, AgencyProperty, Favorite, Purchase, AgencyClient, TopBuyer } from './types'

export const users: User[] = [
  { id: 1, username: 'manuel', email: 'manuel@argentina.gob', profileType: 'BUYER' },
  { id: 2, username: 'claudia', email: 'claudia@mail.com', profileType: 'BUYER' },
  { id: 3, username: 'karina', email: 'karina@argentina.gob', profileType: 'ADMIN' },
]

export const agencies: Agency[] = [
  { id: 1, username: 'ritondo_propiedades', email: 'ritondo@propiedades.com' },
]

export const properties: Property[] = [
  {
    id: 1,
    propertyType: 'APARTMENT',
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
    id: 2,
    propertyType: 'HOUSE',
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

export const agencyProperties: AgencyProperty[] = [
  {
    id: 1,
    propertyId: 1,
    address: 'Miró 548',
    city: 'Ciudad de Buenos Aires',
    propertyType: 'APARTMENT',
    listedPrice: 230000,
    listedDate: '2025-01-01',
    available: true,
    agencyId: 1,
    agencyName: 'ritondo_propiedades',
  },
  {
    id: 2,
    propertyId: 2,
    address: 'Indio Cua 380',
    city: 'Exaltación de la Cruz',
    propertyType: 'HOUSE',
    listedPrice: 200000,
    listedDate: '2025-01-15',
    available: false,
    agencyId: 1,
    agencyName: 'ritondo_propiedades',
  },
]

export const favorites: Favorite[] = [
  {
    id: 1,
    agencyPropertyId: 1,
    propertyAddress: 'Miró 548',
    city: 'Ciudad de Buenos Aires',
    agencyName: 'ritondo_propiedades',
    score: 5,
    comment: 'Faltan renovaciones, buscar financiamiento',
    savedPrice: 340000,
    savedDate: '2025-04-01',
  },
]

export const purchases: Purchase[] = [
  {
    id: 1,
    propertyAddress: 'Indio Cua 380',
    agencyName: 'ritondo_propiedades',
    purchasePrice: 150000,
    purchaseDate: '2024-03-15',
  },
]

export const agencyClients: AgencyClient[] = [
  { userId: 1, username: 'manuel', email: 'manuel@argentina.gob' },
]

export const topBuyers: TopBuyer[] = [
  { userId: 1, username: 'manuel', purchases: 3 },
  { userId: 2, username: 'claudia', purchases: 1 },
]
