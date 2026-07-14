import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchFavorites, saveFavorite, updateFavorite, deleteFavorite } from '../../src/services/favoriteService'
import { apiFetch } from '../../src/services/http'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.mocked(apiFetch).mockReset()
})

describe('fetchFavorites', () => {
  it('fetches the current user favorites with auth header', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve([{ id: 1 }]) } as Response)

    const result = await fetchFavorites('tok')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favorites/me'),
      { headers: { Authorization: 'Bearer tok' } },
    )
    expect(result).toEqual([{ id: 1 }])
  })
})

describe('saveFavorite', () => {
  it('posts a new favorite with score and comment', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({ id: 9 }) } as Response)

    await saveFavorite('tok', 5, 4, 'nice place')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favorites'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ agencyPropertyId: 5, score: 4, comment: 'nice place' }),
      }),
    )
  })
})

describe('updateFavorite', () => {
  it('sends a PUT with the updated score and comment', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({ id: 9 }) } as Response)

    await updateFavorite('tok', 9, 3, 'meh')

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favorites/9'),
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ score: 3, comment: 'meh' }) }),
    )
  })
})

describe('deleteFavorite', () => {
  it('sends a DELETE for the given favorite id', async () => {
    vi.stubEnv('VITE_USE_FIXTURES', 'false')
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({}) } as Response)

    await deleteFavorite('tok', 9)

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/favorites/9'),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })
})
