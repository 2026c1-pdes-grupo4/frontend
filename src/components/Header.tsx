import './Header.css'
import { useAuth } from '../controllers/useAuth'

export default function Header() {
  const { handleLogout } = useAuth()

  return (
    <header className="app-header">
      <h1 className="app-title">Compra Tu Hogar</h1>
      <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
    </header>
  )
}
