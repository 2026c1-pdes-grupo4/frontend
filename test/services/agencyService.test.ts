import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  fetchAgencyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  fetchAgencyPurchases,
} from '../../src/services/agencyService'
import { apiFetch } from '../../src/services/http'
import { agencyProperties as agencyPropFixtures } from '../../src/models/fixtures'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

function fakeToken(id: number): string {
  const header = btoa(JSON.stringify({ alg: 'none' }))
  const body = btoa(JSON.stringify({ id, roles: ['ROLE_AGENCY'] }))
  return `${header}.${body}.signature`
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(apiFetch).mockReset()
})

describe('fetchAgencyProperties (fixtures mode)', () => {
  it('filters fixture listings by the agency id embedded in the token', async () => {
    // USE_FIXTURES is a module-level constant evaluated at import time,
    // so the module must be re-imported after stubbing the env.
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    vi.resetModules()
    const { fetchAgencyProperties: fetchWithFixtures } = await import('../../src/services/agencyService')
    const token = fakeToken(1)

    const result = await fetchWithFixtures(token)

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.agencyId === 1)).toBe(true)
    expect(result).toEqual(agencyPropFixtures.filter((p) => p.agencyId === 1))
  })
})

describe('fetchAgencyProperties (API mode)', () => {
  it('calls the agency/me endpoint with auth header', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([]) } as Response)

    await fetchAgencyProperties('tok')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/agency-properties/agency/me'),
      { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' } },
    )
  })
})

describe('createProperty', () => {
  it('creates the property then the agency listing', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 100 }) } as Response)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 200, propertyId: 100 }) } as Response)

    const data = {
      propertyType: 'HOUSE', price: 1000, address: 'Calle 1', city: 'Quilmes',
      province: 'BA', areaSq: 50, rooms: 3, description: 'desc',
    }
    const result = await createProperty('tok', data)

    expect(apiFetch).toHaveBeenNthCalledWith(1, expect.stringContaining('/properties'), expect.objectContaining({ method: 'POST' }))
    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/agency-properties'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ propertyId: 100, listedPrice: 1000 }) }),
    )
    expect(result).toEqual({ id: 200, propertyId: 100 })
  })
})

describe('updateProperty', () => {
  it('updates the property then the agency listing with the new price', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch)
      .mockResolvedValueOnce({ json: () => Promise.resolve({}) } as Response)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ id: 20, propertyId: 10, listedPrice: 2000 }) } as Response)

    const result = await updateProperty('tok', 20, 10, { price: 2000 })

    expect(apiFetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/properties/10'),
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({}) }),
    )
    expect(apiFetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/agency-properties/20'),
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ propertyId: 10, listedPrice: 2000 }) }),
    )
    expect(result).toEqual({ id: 20, propertyId: 10, listedPrice: 2000 })
  })
})

describe('deleteProperty', () => {
  it('sends a DELETE for the given agency-property id', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({}) } as Response)

    await deleteProperty('tok', 5)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/agency-properties/5'),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})

describe('fetchAgencyPurchases (API mode)', () => {
  it('calls the purchases/agency/me endpoint', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([]) } as Response)

    await fetchAgencyPurchases('tok')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/purchases/agency/me'),
      { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer tok' } },
    )
  })
})
