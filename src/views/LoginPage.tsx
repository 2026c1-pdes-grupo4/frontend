import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../controllers/useAuth'
import './LoginPage.css'

export default function LoginPage() {
  const { handleLogin, loading, error } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const role = await handleLogin(username, password)
    if (!role) return
    if (role === 'ROLE_ADMIN') navigate('/admin')
    else if (role === 'ROLE_AGENCY') navigate('/agency')
    else navigate('/properties')
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
          <h1 className="login-title">Compra Tu Hogar</h1>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit" disabled={loading} aria-busy={loading}>
            {loading && <span className="login-spinner" aria-hidden="true" />}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
