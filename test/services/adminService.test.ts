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

  it('appends to the fixture users list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { createUser: createWithFixtures } = await import('../../src/services/adminService')
    const { users } = await import('../../src/models/fixtures')
    const initialCount = users.length

    const input: UserInput = { username: 'nuevo_fixture', email: 'nuevo_fixture@cth.com', password: 'secret123', profileType: 'BUYER' }
    const result = await createWithFixtures('tok', input)

    expect(result).toMatchObject({ username: 'nuevo_fixture', email: 'nuevo_fixture@cth.com', profileType: 'BUYER' })
    expect(users.length).toBe(initialCount + 1)
    expect(users).toContainEqual(result)
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

  it('appends to the fixture agencies list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { createAgency: createWithFixtures } = await import('../../src/services/adminService')
    const { agencies } = await import('../../src/models/fixtures')
    const initialCount = agencies.length

    const input: AgencyInput = { username: 'nueva_inmo_fixture', email: 'nueva_inmo_fixture@cth.com', password: 'secret123' }
    const result = await createWithFixtures('tok', input)

    expect(result).toMatchObject({ username: 'nueva_inmo_fixture', email: 'nueva_inmo_fixture@cth.com' })
    expect(agencies.length).toBe(initialCount + 1)
    expect(agencies).toContainEqual(result)
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

  it('replaces the matching entry in the fixture users list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { updateUser: updateWithFixtures } = await import('../../src/services/adminService')
    const { users } = await import('../../src/models/fixtures')
    const existingId = users[0].id

    const input: UserInput = { username: 'edited_fixture', email: 'edited_fixture@cth.com', password: 'secret123', profileType: 'ADMIN' }
    const result = await updateWithFixtures('tok', existingId, input)

    expect(result).toEqual({ id: existingId, username: 'edited_fixture', email: 'edited_fixture@cth.com', profileType: 'ADMIN' })
    expect(users.find(u => u.id === existingId)).toEqual(result)
  })

  it('does nothing when the id does not exist in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { updateUser: updateWithFixtures } = await import('../../src/services/adminService')
    const { users } = await import('../../src/models/fixtures')
    const initialCount = users.length

    const input: UserInput = { username: 'ghost', email: 'ghost@cth.com', password: 'secret123', profileType: 'BUYER' }
    await updateWithFixtures('tok', -1, input)

    expect(users.length).toBe(initialCount)
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

  it('removes the matching entry from the fixture users list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { deleteUser: deleteWithFixtures } = await import('../../src/services/adminService')
    const { users } = await import('../../src/models/fixtures')
    const existingId = users[0].id
    const initialCount = users.length

    await deleteWithFixtures('tok', existingId)

    expect(users.length).toBe(initialCount - 1)
    expect(users.find(u => u.id === existingId)).toBeUndefined()
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

  it('replaces the matching entry in the fixture agencies list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { updateAgency: updateWithFixtures } = await import('../../src/services/adminService')
    const { agencies } = await import('../../src/models/fixtures')
    const existingId = agencies[0].id

    const input: AgencyInput = { username: 'edited_inmo_fixture', email: 'edited_inmo_fixture@cth.com', password: 'secret123' }
    const result = await updateWithFixtures('tok', existingId, input)

    expect(result).toEqual({ id: existingId, username: 'edited_inmo_fixture', email: 'edited_inmo_fixture@cth.com' })
    expect(agencies.find(a => a.id === existingId)).toEqual(result)
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

  it('removes the matching entry from the fixture agencies list in fixtures mode', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { deleteAgency: deleteWithFixtures } = await import('../../src/services/adminService')
    const { agencies } = await import('../../src/models/fixtures')
    const existingId = agencies[0].id
    const initialCount = agencies.length

    await deleteWithFixtures('tok', existingId)

    expect(agencies.length).toBe(initialCount - 1)
    expect(agencies.find(a => a.id === existingId)).toBeUndefined()
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
