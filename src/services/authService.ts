import type { LoginRequest, LoginResponse } from '../models/types'
import { apiFetch } from './http'

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const res = await apiFetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  return res.json()
}
