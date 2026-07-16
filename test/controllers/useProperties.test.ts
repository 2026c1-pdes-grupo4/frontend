import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProperties } from '../../src/controllers/useProperties'
import { fetchProperties } from '../../src/services/propertyService'
import { useAuthContext } from '../../src/context/AuthContext'

vi.mock('../../src/services/propertyService', () => ({ fetchProperties: vi.fn() }))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

afterEach(() => {
  vi.mocked(fetchProperties).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

describe('useProperties', () => {
  it('fetches properties with the given filter and token, then stops loading', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_BUYER', setToken: vi.fn() })
    vi.mocked(fetchProperties).mockResolvedValue({ content: [{ id: 1 } as never], page: 1, size: 10, totalElements: 1, totalPages: 1 })

    const { result } = renderHook(() => useProperties({ city: 'Quilmes' }))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(fetchProperties).toHaveBeenCalledWith({ city: 'Quilmes' }, 'tok', 1, 10)
    expect(result.current.list).toEqual([{ id: 1 }])
    expect(result.current.totalPages).toBe(1)
    expect(result.current.error).toBeNull()
  })

  it('sets an error message when the fetch fails', async () => {
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_BUYER', setToken: vi.fn() })
    vi.mocked(fetchProperties).mockRejectedValue(new Error('Server error - please try again later.'))

    const { result } = renderHook(() => useProperties())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Server error - please try again later.')
  })
})
