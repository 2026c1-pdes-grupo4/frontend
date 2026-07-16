import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { createPurchase, fetchMyPurchases } from '../../src/services/purchaseService'

const TOKEN = 'test-token'

const PURCHASE_FIXTURE = {
  id: 1,
  agencyId: 2,
  propertyAddress: 'Av. Corrientes 1234',
  agencyName: 'inmo1',
  purchasePrice: 150000,
  purchaseDate: '2026-05-10',
  buyerId: 3,
  buyerUsername: 'buyer1',
  buyerEmail: 'buyer1@test.com',
}

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('createPurchase', () => {
  beforeEach(() => mockFetch(200, PURCHASE_FIXTURE))

  it('calls POST /purchases with agencyPropertyId in body', async () => {
    const result = await createPurchase(TOKEN, 42)
    expect(result.id).toBe(1)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/purchases')
    expect(call[1].method).toBe('POST')
    expect(call[1].headers['Authorization']).toBe(`Bearer ${TOKEN}`)
    const body = JSON.parse(call[1].body)
    expect(body.agencyPropertyId).toBe(42)
  })
})

describe('fetchMyPurchases', () => {
  beforeEach(() => mockFetch(200, [PURCHASE_FIXTURE]))

  it('calls GET /purchases/me with auth header', async () => {
    const result = await fetchMyPurchases(TOKEN)
    expect(result).toHaveLength(1)
    expect(result[0].propertyAddress).toBe('Av. Corrientes 1234')
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/purchases/me')
    expect(call[1].headers['Authorization']).toBe(`Bearer ${TOKEN}`)
  })
})
