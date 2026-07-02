import { describe, it, expect, vi } from 'vitest'
import { login } from '../../src/services/authService'
import { apiFetch } from '../../src/services/http'

vi.mock('../../src/services/http', () => ({ apiFetch: vi.fn() }))

describe('login', () => {
  it('posts credentials to /auth/login and returns the parsed token', async () => {
    vi.mocked(apiFetch).mockResolvedValue({ json: () => Promise.resolve({ token: 'abc.def.ghi' }) } as Response)

    const result = await login({ username: 'buyer1', password: 'buyer123' })

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'buyer1', password: 'buyer123' }),
      }),
    )
    expect(result).toEqual({ token: 'abc.def.ghi' })
  })

  it('propagates errors from apiFetch', async () => {
    vi.mocked(apiFetch).mockRejectedValue(new Error('Unexpected error (401).'))

    await expect(login({ username: 'bad', password: 'bad' })).rejects.toThrow('Unexpected error (401).')
  })
})
