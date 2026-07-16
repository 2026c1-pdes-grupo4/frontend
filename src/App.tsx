import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuthContext } from './context/AuthContext'
import { useAuth } from './controllers/useAuth'
import Header from './components/Header'
import LoginPage from './views/LoginPage'
import PropertiesPage from './views/PropertiesPage'
import FavoritesPage from './views/FavoritesPage'
import PurchasesPage from './views/PurchasesPage'
import AgencyDashboardPage from './views/AgencyDashboardPage'
import AdminPage from './views/AdminPage'

function AppRoutes() {
  const { token, role } = useAuthContext()
  const { handleLogout } = useAuth()

  const defaultPath = role === 'ROLE_ADMIN' ? '/admin' : role === 'ROLE_AGENCY' ? '/agency' : '/properties'

  return (
    <>
      {token && <Header role={role} onLogout={handleLogout} />}
      <Routes>
        <Route path="/login"      element={!token ? <LoginPage /> : <Navigate to={defaultPath} />} />
        <Route path="/properties" element={token && role === 'ROLE_BUYER' ? <PropertiesPage /> : <Navigate to={token ? defaultPath : '/login'} />} />
        <Route path="/favorites"  element={token && role === 'ROLE_BUYER' ? <FavoritesPage />  : <Navigate to={token ? defaultPath : '/login'} />} />
        <Route path="/purchases"  element={token && role === 'ROLE_BUYER' ? <PurchasesPage />  : <Navigate to={token ? defaultPath : '/login'} />} />
        <Route path="/admin"      element={token && role === 'ROLE_ADMIN'  ? <AdminPage />       : <Navigate to="/login" />} />
        <Route path="/agency"     element={token && role === 'ROLE_AGENCY' ? <AgencyDashboardPage /> : <Navigate to="/login" />} />
        <Route path="*"           element={<Navigate to={token ? defaultPath : '/login'} />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
