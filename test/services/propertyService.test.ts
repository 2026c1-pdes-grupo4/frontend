import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchProperties } from '../../src/services/propertyService'
import { apiFetch } from '../../src/services/http'
import { properties as fixtureData } from '../../src/models/fixtures'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(apiFetch).mockReset()
})

describe('fetchProperties (fixtures mode)', () => {
  it('filters by city case-insensitively', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')
    const target = fixtureData[0]

    const result = await fetchProperties({ city: target.city.toUpperCase() })

    expect(result.every((p) => p.city === target.city)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('filters by price range', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'true')

    const result = await fetchProperties({ minPrice: 0, maxPrice: 0 })

    expect(result).toEqual([])
  })
})

describe('fetchProperties (API mode)', () => {
  it('builds query params from the filter and calls apiFetch', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([]) } as Response)

    await fetchProperties({ city: 'Quilmes', minPrice: 1000, maxRooms: undefined, minRooms: 2 })

    const [url] = vi.mocked(apiFetch).mock.calls[0]
    expect(url).toContain('/properties/search?')
    expect(url).toContain('city=Quilmes')
    expect(url).toContain('priceMin=1000')
    expect(url).toContain('rooms=2')
  })

  it('adds an Authorization header when a token is provided', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([]) } as Response)

    await fetchProperties({}, 'my-token')

    const [, init] = vi.mocked(apiFetch).mock.calls[0]
    expect((init as RequestInit).headers).toEqual({ Authorization: 'Bearer my-token' })
  })
})
