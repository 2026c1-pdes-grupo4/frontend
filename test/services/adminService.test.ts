import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  createUser,
  updateUser,
  deleteUser,
  createAgency,
  updateAgency,
  deleteAgency,
} from '../../src/services/adminService'

const TOKEN = 'test-token'

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('createUser', () => {
  beforeEach(() => mockFetch(200, { id: 1, username: 'bob', email: 'bob@test.com', profileType: 'BUYER' }))

  it('calls POST /users with correct headers and body', async () => {
    const result = await createUser(TOKEN, { username: 'bob', email: 'bob@test.com', password: 'pass', profileType: 'BUYER' })
    expect(result.username).toBe('bob')
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/users')
    expect(call[1].method).toBe('POST')
    expect(call[1].headers['Authorization']).toBe(`Bearer ${TOKEN}`)
    const body = JSON.parse(call[1].body)
    expect(body.username).toBe('bob')
    expect(body.profileType).toBe('BUYER')
  })
})

describe('updateUser', () => {
  beforeEach(() => mockFetch(200, { id: 5, username: 'alice', email: 'alice@test.com', profileType: 'ADMIN' }))

  it('calls PUT /users/:id', async () => {
    const result = await updateUser(TOKEN, 5, { username: 'alice', email: 'alice@test.com', password: 'pass', profileType: 'ADMIN' })
    expect(result.id).toBe(5)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/users/5')
    expect(call[1].method).toBe('PUT')
  })
})

describe('deleteUser', () => {
  beforeEach(() => mockFetch(204, null))

  it('calls DELETE /users/:id', async () => {
    await deleteUser(TOKEN, 3)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/users/3')
    expect(call[1].method).toBe('DELETE')
    expect(call[1].headers['Authorization']).toBe(`Bearer ${TOKEN}`)
  })
})

describe('createAgency', () => {
  beforeEach(() => mockFetch(200, { id: 10, username: 'inmo3', email: 'inmo3@test.com' }))

  it('calls POST /agencies with correct body', async () => {
    const result = await createAgency(TOKEN, { username: 'inmo3', email: 'inmo3@test.com', password: 'pass' })
    expect(result.username).toBe('inmo3')
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/agencies')
    expect(call[1].method).toBe('POST')
    const body = JSON.parse(call[1].body)
    expect(body.email).toBe('inmo3@test.com')
  })
})

describe('updateAgency', () => {
  beforeEach(() => mockFetch(200, { id: 10, username: 'inmo3-updated', email: 'inmo3@test.com' }))

  it('calls PUT /agencies/:id', async () => {
    const result = await updateAgency(TOKEN, 10, { username: 'inmo3-updated', email: 'inmo3@test.com', password: 'pass' })
    expect(result.username).toBe('inmo3-updated')
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/agencies/10')
    expect(call[1].method).toBe('PUT')
  })
})

describe('deleteAgency', () => {
  beforeEach(() => mockFetch(204, null))

  it('calls DELETE /agencies/:id', async () => {
    await deleteAgency(TOKEN, 7)
    const call = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[0]).toContain('/agencies/7')
    expect(call[1].method).toBe('DELETE')
  })
})
