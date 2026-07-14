import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAuth } from '../../src/controllers/useAuth'
import { login } from '../../src/services/authService'
import { useAuthContext } from '../../src/context/AuthContext'

vi.mock('../../src/services/authService', () => ({ login: vi.fn() }))
vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))

function fakeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

afterEach(() => {
  vi.mocked(login).mockReset()
  vi.mocked(useAuthContext).mockReset()
})

describe('useAuth', () => {
  it('logs in, stores the token and returns the role', async () => {
    const setToken = vi.fn()
    vi.mocked(useAuthContext).mockReturnValue({ token: null, role: null, setToken })
    const token = fakeToken({ roles: ['ROLE_BUYER'] })
    vi.mocked(login).mockResolvedValue({ token })

    const { result } = renderHook(() => useAuth())

    let role: string | null = null
    await act(async () => {
      role = await result.current.handleLogin('buyer1', 'buyer123')
    })

    expect(login).toHaveBeenCalledWith({ username: 'buyer1', password: 'buyer123' })
    expect(setToken).toHaveBeenCalledWith(token)
    expect(role).toBe('ROLE_BUYER')
    expect(result.current.error).toBeNull()
  })

  it('sets an error and returns null on invalid credentials', async () => {
    const setToken = vi.fn()
    vi.mocked(useAuthContext).mockReturnValue({ token: null, role: null, setToken })
    vi.mocked(login).mockRejectedValue(new Error('Unexpected error (401).'))

    const { result } = renderHook(() => useAuth())

    let role: string | null = 'unset'
    await act(async () => {
      role = await result.current.handleLogin('bad', 'bad')
    })

    expect(setToken).not.toHaveBeenCalled()
    expect(role).toBeNull()
    expect(result.current.error).toBe('Invalid credentials')
  })

  it('logs out by clearing the token', () => {
    const setToken = vi.fn()
    vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_BUYER', setToken })

    const { result } = renderHook(() => useAuth())
    act(() => result.current.handleLogout())

    expect(setToken).toHaveBeenCalledWith(null)
  })
})
