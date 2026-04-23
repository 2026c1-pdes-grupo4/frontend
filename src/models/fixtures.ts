import type { User, Agency, Property, Favorite, Purchase } from './types'

export const users: User[] = [
  { user_id: 1, username: 'manuel', email: 'manuel@argentina.gob', password: '1234', profile_type: 'buyer' },
  { user_id: 2, username: 'claudia', email: 'claudia@mail.com', password: 'abcd', profile_type: 'seller' },
  { user_id: 3, username: 'karina', email: 'karina@argentina.gob', password: 'efgh', profile_type: 'admin' },
]

export const agencies: Agency[] = [
  { agency_id: 1, username: 'ritondo_propiedades', email: 'ritondo@propiedades.com', password: 'ijkl', admin_user_id: 2 },
]

export const properties: Property[] = [
  {
    property_id: 1,
    property_type: 'apartment',
    price: 230000,
    address: 'Miró 548',
    city: 'Ciudad de Buenos Aires',
    province: 'Ciudad de Buenos Aires',
    area_sq: 230,
    rooms: 3,
    description: 'semipiso hermoso cuatro ambientes al frente con cochera y baulera',
    available: true,
    agency_id: 1,
  },
  {
    property_id: 2,
    property_type: 'house',
    price: 200000,
    address: 'Indio Cua 380',
    city: 'Exaltación de la Cruz',
    province: 'Buenos Aires',
    area_sq: 400,
    rooms: 6,
    description: 'Oportunidad en Indio Cuá Golf Club: Casa con lote de 400 m2 en Exaltación de la Cruz',
    available: true,
    agency_id: 1,
  },
]

export const favorites: Favorite[] = [
  {
    favorite_id: 1,
    user_id: 1,
    property_id: 1,
    saved_date: '2025-04-01',
    saved_price: 340000,
    score: 5,
    comment: 'Faltan renovaciones, buscar financiamiento',
  },
]

export const purchases: Purchase[] = [
  {
    purchase_id: 1,
    user_id: 1,
    property_id: 2,
    purchase_price: 150000,
    purchase_date: '2024-03-15',
  },
]
