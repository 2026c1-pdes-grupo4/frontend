import { describe, it, expect, vi, afterEach } from 'vitest'
import { createPurchase, fetchMyPurchases } from '../../src/services/purchaseService'
import { apiFetch } from '../../src/services/http'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(apiFetch).mockReset()
})

describe('createPurchase', () => {
  it('posts the agencyPropertyId and returns the created purchase', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({ id: 1 }) } as Response)

    const result = await createPurchase('tok', 7)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/purchases'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ agencyPropertyId: 7 }) }),
    )
    expect(result).toEqual({ id: 1 })
  })
})

describe('fetchMyPurchases', () => {
  it('fetches the current user purchases', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([{ id: 1 }]) } as Response)

    const result = await fetchMyPurchases('tok')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/purchases/me'),
      { headers: { Authorization: 'Bearer tok' } },
    )
    expect(result).toEqual([{ id: 1 }])
  })
})
