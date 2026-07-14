import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useFavorites } from '../../src/controllers/useFavorites'
import { fetchFavorites, saveFavorite, updateFavorite, deleteFavorite } from '../../src/services/favoriteService'
import { useAuthContext } from '../../src/context/AuthContext'
import type { Favorite } from '../../src/models/types'

vi.mock('../../src/services/favoriteService', () => ({
  fetchFavorites: vi.fn(),
  saveFavorite: vi.fn(),
  updateFavorite: vi.fn(),
  deleteFavorite: vi.fn(),
}))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

const favorite: Favorite = {
  id: 1, agencyPropertyId: 5, propertyAddress: 'Calle 1', city: 'Quilmes',
  agencyName: 'ritondo_propiedades', score: 4, comment: 'nice', savedPrice: 1000, savedDate: '2026-01-01',
}

afterEach(() => {
  vi.mocked(fetchFavorites).mockReset()
  vi.mocked(saveFavorite).mockReset()
  vi.mocked(updateFavorite).mockReset()
  vi.mocked(deleteFavorite).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

function withToken(token: string | null = 'tok') {
  vi.mocked(useAuthContext).mockReturnValue({ token, role: 'ROLE_BUYER', setToken: vi.fn() })
}

describe('useFavorites', () => {
  it('loads favorites for the current user', async () => {
    withToken()
    vi.mocked(fetchFavorites).mockResolvedValue([favorite])

    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.list).toEqual([favorite])
    expect(result.current.isFavorite(5)).toBe(true)
    expect(result.current.isFavorite(999)).toBe(false)
  })

  it('adds a new favorite to the list', async () => {
    withToken()
    vi.mocked(fetchFavorites).mockResolvedValue([])
    vi.mocked(saveFavorite).mockResolvedValue(favorite)

    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.addFavorite(5, 4, 'nice')
    })

    expect(saveFavorite).toHaveBeenCalledWith('tok', 5, 4, 'nice')
    expect(result.current.list).toEqual([favorite])
  })

  it('edits an existing favorite in place', async () => {
    withToken()
    vi.mocked(fetchFavorites).mockResolvedValue([favorite])
    vi.mocked(updateFavorite).mockResolvedValue({ ...favorite, score: 2, comment: 'meh' })

    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.editFavorite(1, 2, 'meh')
    })

    expect(result.current.list[0]).toMatchObject({ score: 2, comment: 'meh' })
  })

  it('removes a favorite from the list', async () => {
    withToken()
    vi.mocked(fetchFavorites).mockResolvedValue([favorite])
    vi.mocked(deleteFavorite).mockResolvedValue(undefined)

    const { result } = renderHook(() => useFavorites())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.removeFavorite(1)
    })

    expect(result.current.list).toEqual([])
  })

  it('does not call the service when there is no token', async () => {
    withToken(null)

    const { result } = renderHook(() => useFavorites())
    await act(async () => {
      await result.current.addFavorite(5, 4, 'nice')
    })

    expect(fetchFavorites).not.toHaveBeenCalled()
    expect(saveFavorite).not.toHaveBeenCalled()
  })
})
