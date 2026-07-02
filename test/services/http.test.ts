import { describe, it, expect, vi, afterEach } from 'vitest'
import { apiFetch } from '../../src/services/http'

function mockFetchOnce(status: number, ok: boolean) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, status }))
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiFetch', () => {
  it('returns the response when the request succeeds', async () => {
    mockFetchOnce(200, true)
    const res = await apiFetch('http://api.test/x')
    expect(res.ok).toBe(true)
  })

  it('maps 500 to a server error message', async () => {
    mockFetchOnce(500, false)
    await expect(apiFetch('http://api.test/x')).rejects.toThrow('Server error - please try again later.')
  })

  it('maps 404 to a not-found message', async () => {
    mockFetchOnce(404, false)
    await expect(apiFetch('http://api.test/x')).rejects.toThrow('Resource not found.')
  })

  it('maps 403 to an access-denied message', async () => {
    mockFetchOnce(403, false)
    await expect(apiFetch('http://api.test/x')).rejects.toThrow('Access denied.')
  })

  it('maps 401 to a session-expired message', async () => {
    mockFetchOnce(401, false)
    await expect(apiFetch('http://api.test/x')).rejects.toThrow('Session expired - please log in again.')
  })

  it('maps other error statuses to a generic message', async () => {
    mockFetchOnce(418, false)
    await expect(apiFetch('http://api.test/x')).rejects.toThrow('Unexpected error (418).')
  })
})
