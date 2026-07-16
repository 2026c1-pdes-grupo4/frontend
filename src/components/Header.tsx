import { NavLink } from 'react-router-dom'
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
            <NavLink to="/properties">Search</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
            <NavLink to="/purchases">My Purchases</NavLink>
          </>
        )}
        {role === 'ROLE_AGENCY' && (
          <NavLink to="/agency">Agency</NavLink>
        )}
        {role === 'ROLE_ADMIN' && (
          <NavLink to="/admin">Admin</NavLink>
        )}
      </nav>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </header>
  )
}
