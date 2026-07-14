import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchAllUsers, fetchAllFavorites, fetchAllPurchases, createUser, createAgency, updateUser, deleteUser, updateAgency, deleteAgency } from '../../src/services/adminService'
import { apiFetch } from '../../src/services/http'
import type { AdminFavoriteRaw, AdminPurchaseRaw, UserInput, AgencyInput } from '../../src/models/types'

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

describe('createUser', () => {
  it('POSTs to /users with auth header and body', async () => {
    const created = { id: 1, username: 'nuevo', email: 'nuevo@cth.com', profileType: 'BUYER' }
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(created) } as Response)

    const input: UserInput = { username: 'nuevo', email: 'nuevo@cth.com', password: 'secret123', profileType: 'BUYER' }
    const result = await createUser('tok', input)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' },
        body: JSON.stringify(input),
      },
    )
    expect(result).toEqual(created)
  })
})

describe('createAgency', () => {
  it('POSTs to /agencies with auth header and body', async () => {
    const created = { id: 1, username: 'nueva_inmo', email: 'nueva@cth.com' }
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(created) } as Response)

    const input: AgencyInput = { username: 'nueva_inmo', email: 'nueva@cth.com', password: 'secret123' }
    const result = await createAgency('tok', input)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/agencies'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' },
        body: JSON.stringify(input),
      },
    )
    expect(result).toEqual(created)
  })
})

describe('updateUser', () => {
  it('PUTs to /users/:id with auth header and body', async () => {
    const updated = { id: 5, username: 'edited', email: 'edited@cth.com', profileType: 'BUYER' }
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(updated) } as Response)

    const input: UserInput = { username: 'edited', email: 'edited@cth.com', password: 'secret123', profileType: 'BUYER' }
    const result = await updateUser('tok', 5, input)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/5'),
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' },
        body: JSON.stringify(input),
      },
    )
    expect(result).toEqual(updated)
  })
})

describe('deleteUser', () => {
  it('DELETEs to /users/:id with auth header', async () => {
    vi.mocked(apiFetch).mockResolvedValue({} as Response)

    await deleteUser('tok', 5)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users/5'),
      { method: 'DELETE', headers: { Authorization: 'Bearer tok' } },
    )
  })
})

describe('updateAgency', () => {
  it('PUTs to /agencies/:id with auth header and body', async () => {
    const updated = { id: 3, username: 'edited_inmo', email: 'edited@cth.com' }
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve(updated) } as Response)

    const input: AgencyInput = { username: 'edited_inmo', email: 'edited@cth.com', password: 'secret123' }
    const result = await updateAgency('tok', 3, input)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/agencies/3'),
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' },
        body: JSON.stringify(input),
      },
    )
    expect(result).toEqual(updated)
  })
})

describe('deleteAgency', () => {
  it('DELETEs to /agencies/:id with auth header', async () => {
    vi.mocked(apiFetch).mockResolvedValue({} as Response)

    await deleteAgency('tok', 3)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/agencies/3'),
      { method: 'DELETE', headers: { Authorization: 'Bearer tok' } },
    )
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
