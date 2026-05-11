import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuthContext } from './context/AuthContext'
import Header from './components/Header'
import LoginPage from './views/LoginPage'
import PropertiesPage from './views/PropertiesPage'

function AppRoutes() {
  const { token, role } = useAuthContext()

  const defaultPath = role === 'ROLE_ADMIN' ? '/admin' : '/properties'

  return (
    <>
      {token && <Header />}
      <Routes>
        <Route path="/login" element={!token ? <LoginPage /> : <Navigate to={defaultPath} />} />
        <Route path="/properties" element={token ? <PropertiesPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={token && role === 'ROLE_ADMIN' ? <div>Panel Admin</div> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? defaultPath : '/login'} />} />
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
