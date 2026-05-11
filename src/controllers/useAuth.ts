import { useState } from 'react'
import { login } from '../services/authService'
import { useAuthContext } from '../context/AuthContext'

export function useAuth() {
  const { token, setToken } = useAuthContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await login({ username, password })
      setToken(res.token)
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => setToken(null)

  return { token, loading, error, handleLogin, handleLogout }
}
