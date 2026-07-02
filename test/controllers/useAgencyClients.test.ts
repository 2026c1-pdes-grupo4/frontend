import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAgencyClients } from '../../src/controllers/useAgencyClients'
import { useAgencyPurchases } from '../../src/controllers/useAgencyPurchases'
import type { Purchase } from '../../src/models/types'

vi.mock('../../src/controllers/useAgencyPurchases', () => ({ useAgencyPurchases: vi.fn() }))

afterEach(() => {
  vi.mocked(useAgencyPurchases).mockReset()
})

function purchase(overrides: Partial<Purchase>): Purchase {
  return {
    id: 1, agencyId: 1, propertyAddress: 'Calle 1', agencyName: 'ritondo_propiedades',
    purchasePrice: 1000, purchaseDate: '2026-01-01', buyerId: 7, buyerUsername: 'buyer1', buyerEmail: 'buyer1@test.com',
    ...overrides,
  }
}

describe('useAgencyClients', () => {
  it('maps purchases into agency clients', () => {
    vi.mocked(useAgencyPurchases).mockReturnValue({ list: [purchase({})], loading: false, error: null })

    const { result } = renderHook(() => useAgencyClients())

    expect(result.current.list).toEqual([{ agencyId: 1, userId: 7, username: 'buyer1', email: 'buyer1@test.com' }])
  })

  it('deduplicates repeated buyers into a single client', () => {
    vi.mocked(useAgencyPurchases).mockReturnValue({
      list: [purchase({ id: 1, buyerId: 7 }), purchase({ id: 2, buyerId: 7 }), purchase({ id: 3, buyerId: 8, buyerUsername: 'buyer2', buyerEmail: 'b2@test.com' })],
      loading: false,
      error: null,
    })

    const { result } = renderHook(() => useAgencyClients())

    expect(result.current.list).toHaveLength(2)
    expect(result.current.list.map((c) => c.userId)).toEqual([7, 8])
  })

  it('passes through loading and error state', () => {
    vi.mocked(useAgencyPurchases).mockReturnValue({ list: [], loading: true, error: 'Access denied.' })

    const { result } = renderHook(() => useAgencyClients())

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe('Access denied.')
  })
})
