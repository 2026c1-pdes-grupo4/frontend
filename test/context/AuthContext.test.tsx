import { describe, it, expect, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { AuthProvider, useAuthContext } from '../../src/context/AuthContext'

function fakeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>

afterEach(() => {
  localStorage.clear()
})

describe('useAuthContext', () => {
  it('throws when used outside an AuthProvider', () => {
    expect(() => renderHook(() => useAuthContext())).toThrow('useAuthContext must be used inside AuthProvider')
  })

  it('starts with no token when localStorage is empty', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })

    expect(result.current.token).toBeNull()
    expect(result.current.role).toBeNull()
  })

  it('restores the token from localStorage on mount', () => {
    const token = fakeToken({ roles: ['ROLE_ADMIN'] })
    localStorage.setItem('token', token)

    const { result } = renderHook(() => useAuthContext(), { wrapper })

    expect(result.current.token).toBe(token)
    expect(result.current.role).toBe('ROLE_ADMIN')
  })

  it('setToken persists to localStorage and updates the role', () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper })
    const token = fakeToken({ roles: ['ROLE_AGENCY'] })

    act(() => result.current.setToken(token))

    expect(result.current.token).toBe(token)
    expect(result.current.role).toBe('ROLE_AGENCY')
    expect(localStorage.getItem('token')).toBe(token)
  })

  it('setToken(null) clears localStorage', () => {
    localStorage.setItem('token', fakeToken({ roles: ['ROLE_BUYER'] }))
    const { result } = renderHook(() => useAuthContext(), { wrapper })

    act(() => result.current.setToken(null))

    expect(result.current.token).toBeNull()
    expect(result.current.role).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
