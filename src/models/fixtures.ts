import type { User, Agency, Property, AgencyProperty, Favorite, Purchase } from './types'

export const users: User[] = [
  { userId: 1, username: 'manuel', email: 'manuel@argentina.gob', password: '1234', profileType: 'buyer' },
  { userId: 2, username: 'karina', email: 'karina@argentina.gob', password: 'efgh', profileType: 'admin' },
]

export const agencies: Agency[] = [
  { agencyId: 1, username: 'ritondo_propiedades', email: 'ritondo@propiedades.com', password: 'ijkl', adminUserId: 2 },
]

export const properties: Property[] = [
  {
    propertyId: 1,
    propertyType: 'apartment',
    address: 'Miró 548',
    city: 'Ciudad de Buenos Aires',
    province: 'Ciudad de Buenos Aires',
    areaSq: 230,
    rooms: 3,
    description: 'semipiso hermoso cuatro ambientes al frente con cochera y baulera',
    available: true,
    cadastre: {
      circunscripcion: '1',
      seccion: 'A',
      manzana: '12',
      parcela: '5'
    },
  },
  {
    propertyId: 2,
    propertyType: 'house',
    address: 'Indio Cua 380',
    city: 'Exaltación de la Cruz',
    province: 'Buenos Aires',
    areaSq: 400,
    rooms: 6,
    description: 'Oportunidad en Indio Cuá Golf Club: Casa con lote de 400 m2 en Exaltación de la Cruz',
    available: true,
    cadastre: {
      circunscripcion: '2',
      seccion: 'B',
      manzana: '34',
      parcela: '7'
    },
  },
]

export const agencyProperties: AgencyProperty[] = [
  {
    agencyPropertyId: 1, agencyId: 1, propertyId: 1, listedDate: '2025-01-10', listedPrice: 230000,
    pictures: [
      { pictureId: 1, agencyPropertyId: 1, url: 'pic-1' },
      { pictureId: 2, agencyPropertyId: 1, url: 'pic-2' },
    ],
  },
  {
    agencyPropertyId: 2, agencyId: 1, propertyId: 2, listedDate: '2025-02-15', listedPrice: 200000,
    pictures: [
      { pictureId: 3, agencyPropertyId: 2, url: 'pic-3' },
    ],
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
    agencyPropertyId: 2,
    purchasePrice: 150000,
    purchaseDate: '2024-03-15',
  },
]
