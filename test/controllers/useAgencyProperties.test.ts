import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useAgencyProperties } from '../../src/controllers/useAgencyProperties'
import { fetchAgencyProperties, createProperty, updateProperty, deleteProperty } from '../../src/services/agencyService'
import { useAuthContext } from '../../src/context/AuthContext'
import type { AgencyProperty } from '../../src/models/types'

vi.mock('../../src/services/agencyService', () => ({
  fetchAgencyProperties: vi.fn(),
  createProperty: vi.fn(),
  updateProperty: vi.fn(),
  deleteProperty: vi.fn(),
}))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

const listing: AgencyProperty = {
  id: 1, propertyId: 10, address: 'Calle 1', city: 'Quilmes', propertyType: 'HOUSE',
  listedPrice: 1000, listedDate: '2026-01-01', available: true, agencyId: 1, agencyName: 'ritondo_propiedades',
}

afterEach(() => {
  vi.mocked(fetchAgencyProperties).mockReset()
  vi.mocked(createProperty).mockReset()
  vi.mocked(updateProperty).mockReset()
  vi.mocked(deleteProperty).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

describe('useAgencyProperties', () => {
  it('loads the agency listings', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyProperties).mockResolvedValue([listing])

    const { result } = renderHook(() => useAgencyProperties())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([listing])
  })

  it('adds a newly created listing', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyProperties).mockResolvedValue([])
    vi.mocked(createProperty).mockResolvedValue(listing)

    const { result } = renderHook(() => useAgencyProperties())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.add({
        propertyType: 'HOUSE', price: 1000, address: 'Calle 1', city: 'Quilmes',
        province: 'BA', areaSq: 50, rooms: 3, description: 'desc',
      })
    })

    expect(result.current.list).toEqual([listing])
  })

  it('replaces an edited listing in place', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyProperties).mockResolvedValue([listing])
    const updated = { ...listing, listedPrice: 2000 }
    vi.mocked(updateProperty).mockResolvedValue(updated)

    const { result } = renderHook(() => useAgencyProperties())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.edit(listing, { price: 2000 })
    })

    expect(result.current.list).toEqual([updated])
  })

  it('removes a deleted listing from the list', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_AGENCY', setToken: vi.fn() })
    vi.mocked(fetchAgencyProperties).mockResolvedValue([listing])
    vi.mocked(deleteProperty).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAgencyProperties())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.remove(listing.id)
    })

    expect(result.current.list).toEqual([])
  })
})
