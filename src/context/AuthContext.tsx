import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

function parsePayload(token: string | null): Record<string, unknown> | null {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

function extractRole(token: string | null): string | null {
  return (parsePayload(token)?.roles as string[])?.[0] ?? null
}

export function extractId(token: string | null): number | null {
  const id = parsePayload(token)?.id
  return typeof id === 'number' ? id : null
}

interface AuthContextType {
  token: string | null
  role: string | null
  setToken: (token: string | null) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const handleSetToken = (t: string | null) => {
    setToken(t)
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ token, role: extractRole(token), setToken: handleSetToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
