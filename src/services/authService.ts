import type { LoginRequest, LoginResponse } from '../models/types'

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
