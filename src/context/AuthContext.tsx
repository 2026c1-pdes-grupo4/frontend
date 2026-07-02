import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { extractRole } from '../models/jwt'

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

// eslint-disable-next-line react-refresh/only-export-components -- shared with AuthProvider in this file
export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
