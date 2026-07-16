import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

interface HeaderProps {
  role: string | null
  onLogout: () => void
}

export default function Header({ role, onLogout }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header ref={headerRef} className="app-header">
        <h1 className="app-title">Compra Tu Hogar</h1>
        <nav className="app-nav">
          {role === 'ROLE_BUYER' && (
            <>
              <NavLink to="/properties" className={({ isActive }) => isActive ? 'active' : ''}>Search</NavLink>
              <NavLink to="/favorites"  className={({ isActive }) => isActive ? 'active' : ''}>Favorites</NavLink>
              <NavLink to="/purchases"  className={({ isActive }) => isActive ? 'active' : ''}>My Purchases</NavLink>
            </>
          )}
          {role === 'ROLE_AGENCY' && (
            <NavLink to="/agency" className={({ isActive }) => isActive ? 'active' : ''}>Agency</NavLink>
          )}
          {role === 'ROLE_ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''}>Admin</NavLink>
          )}
        </nav>
        <button className="logout-btn" onClick={onLogout} aria-label="Logout">Logout</button>
      </header>
      <div className="header-offset" aria-hidden="true" />
    </>
  )
}
