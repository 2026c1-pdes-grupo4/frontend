import { Link } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  role: string | null
  onLogout: () => void
}

export default function Header({ role, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-title">Compra Tu Hogar</h1>
      <nav className="app-nav">
        {role === 'ROLE_BUYER' && (
          <>
            <Link to="/properties">Search</Link>
            <Link to="/favorites">Favorites</Link>
          </>
        )}
        {role === 'ROLE_AGENCY' && (
          <Link to="/agency">Agency</Link>
        )}
        {role === 'ROLE_ADMIN' && (
          <Link to="/admin">Admin</Link>
        )}
      </nav>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </header>
  )
}
