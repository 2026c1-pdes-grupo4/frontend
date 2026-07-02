import { describe, it, expect } from 'vitest'
import { extractRole, extractId } from '../../src/models/jwt'

function fakeToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'none' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('extractRole', () => {
  it('returns null for a null token', () => {
    expect(extractRole(null)).toBeNull()
  })

  it('returns null for a malformed token', () => {
    expect(extractRole('not-a-jwt')).toBeNull()
  })

  it('returns the first role from a valid token', () => {
    const token = fakeToken({ roles: ['ROLE_BUYER', 'ROLE_ADMIN'] })
    expect(extractRole(token)).toBe('ROLE_BUYER')
  })

  it('returns null when the roles claim is missing', () => {
    const token = fakeToken({ id: 1 })
    expect(extractRole(token)).toBeNull()
  })
})

describe('extractId', () => {
  it('returns null for a null token', () => {
    expect(extractId(null)).toBeNull()
  })

  it('returns the id from a valid token', () => {
    const token = fakeToken({ id: 42, roles: ['ROLE_AGENCY'] })
    expect(extractId(token)).toBe(42)
  })

  it('returns null when the id claim is missing', () => {
    const token = fakeToken({ roles: ['ROLE_BUYER'] })
    expect(extractId(token)).toBeNull()
  })

  it('returns null when the id claim is not a number', () => {
    const token = fakeToken({ id: 'not-a-number' })
    expect(extractId(token)).toBeNull()
  })
})
