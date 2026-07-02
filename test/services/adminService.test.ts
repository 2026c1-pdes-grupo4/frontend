import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchAllUsers, fetchAllFavorites, fetchAllPurchases } from '../../src/services/adminService'
import { apiFetch } from '../../src/services/http'
import type { AdminFavoriteRaw, AdminPurchaseRaw } from '../../src/models/types'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(apiFetch).mockReset()
})

describe('fetchAllUsers (API mode)', () => {
  it('calls the /admin/users endpoint with auth header', async () => {
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([{ id: 1 }]) } as Response)

    const result = await fetchAllUsers('tok')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users'),
      { headers: { Authorization: 'Bearer tok' } },
    )
    expect(result).toEqual([{ id: 1 }])
  })
})

describe('fetchAllFavorites', () => {
  it('flattens the nested agencyProperty/property/agency shape into a flat Favorite', async () => {
    const raw: AdminFavoriteRaw[] = [{
      favoriteId: 10,
      agencyProperty: {
        agencyPropertyId: 20,
        property: { address: 'Calle 1', city: 'Quilmes' },
        agency: { username: 'ritondo_propiedades' },
      },
      savedDate: '2026-01-01',
      savedPrice: 1000,
      score: 5,
      comment: 'great',
    }]
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(raw) } as Response)

    const result = await fetchAllFavorites('tok')

    expect(result).toEqual([{
      id: 10,
      agencyPropertyId: 20,
      propertyAddress: 'Calle 1',
      city: 'Quilmes',
      agencyName: 'ritondo_propiedades',
      score: 5,
      comment: 'great',
      savedPrice: 1000,
      savedDate: '2026-01-01',
    }])
  })
})

describe('fetchAllPurchases', () => {
  it('flattens the nested agencyProperty/agency/user shape into a flat Purchase', async () => {
    const raw: AdminPurchaseRaw[] = [{
      purchaseId: 30,
      agencyProperty: {
        property: { address: 'Calle 2' },
        agency: { agencyId: 1, username: 'ritondo_propiedades' },
      },
      purchasePrice: 5000,
      purchaseDate: '2026-02-01',
      user: { userId: 7, username: 'buyer1', email: 'buyer1@test.com' },
    }]
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(raw) } as Response)

    const result = await fetchAllPurchases('tok')

    expect(result).toEqual([{
      id: 30,
      agencyId: 1,
      propertyAddress: 'Calle 2',
      agencyName: 'ritondo_propiedades',
      purchasePrice: 5000,
      purchaseDate: '2026-02-01',
      buyerId: 7,
      buyerUsername: 'buyer1',
      buyerEmail: 'buyer1@test.com',
    }])
  })
})
