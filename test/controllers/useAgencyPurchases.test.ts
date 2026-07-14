import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAgencyPurchases } from '../../src/controllers/useAgencyPurchases'
import { fetchAgencyPurchases } from '../../src/services/agencyService'
import { useAuthContext } from '../../src/context/AuthContext'
import type { Purchase } from '../../src/models/types'

vi.mock('../../src/services/agencyService', () => ({ fetchAgencyPurchases: vi.fn() }))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

afterEach(() => {
  vi.mocked(fetchAgencyPurchases).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

const purchase: Purchase = {
  id: 1, agencyId: 1, propertyAddress: 'Calle 1', agencyName: 'ritondo_propiedades',
  purchasePrice: 1000, purchaseDate: '2026-01-01', buyerId: 7, buyerUsername: 'buyer1', buyerEmail: 'buyer1@test.com',
}

describe('useAgencyPurchases', () => {
  it('loads the agency purchases', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyPurchases).mockResolvedValue([purchase])

    const { result } = renderHook(() => useAgencyPurchases())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([purchase])
    expect(result.current.error).toBeNull()
  })

  it('sets an error message when the fetch fails', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyPurchases).mockRejectedValue(new Error('Access denied.'))

    const { result } = renderHook(() => useAgencyPurchases())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('Access denied.')
  })
})
