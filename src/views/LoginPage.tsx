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
    await handleLogin(username, password)
    navigate('/properties')
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1 className="login-title">Compra Tu Hogar</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
