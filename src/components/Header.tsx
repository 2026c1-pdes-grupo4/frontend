import { Link } from 'react-router-dom'
import { useAuth } from '../controllers/useAuth'
import { useAuthContext } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const { handleLogout } = useAuth()
  const { role } = useAuthContext()

  return (
    <header className="app-header">
      <h1 className="app-title">Compra Tu Hogar</h1>
      <nav className="app-nav">
        {role === 'ROLE_BUYER' && (
          <>
            <Link to="/properties">Búsqueda</Link>
            <Link to="/favorites">Favoritos</Link>
          </>
        )}
        {role === 'ROLE_AGENCY' && (
          <Link to="/agency">Agencia</Link>
        )}
        {role === 'ROLE_ADMIN' && (
          <Link to="/admin">Admin</Link>
        )}
      </nav>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  )
}
