import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import App from '../src/App'
import { useAuthContext } from '../src/context/AuthContext'
import { useAuth } from '../src/controllers/useAuth'

vi.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useAuthContext: vi.fn(),
}))
vi.mock('../src/controllers/useAuth', () => ({ useAuth: vi.fn() }))

afterEach(() => {
  vi.mocked(useAuthContext).mockReset()
  vi.mocked(useAuth).mockReset()
})

function setAuth(token: string | null, role: string | null) {
  vi.mocked(useAuthContext).mockReturnValue({ token, role, setToken: vi.fn() })
  vi.mocked(useAuth).mockReturnValue({ token, loading: false, error: null, handleLogin: vi.fn(), handleLogout: vi.fn() })
}

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

describe('App routing', () => {
  it('shows the login page at /login when unauthenticated', () => {
    setAuth(null, null)
    renderAt('/login')

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('redirects to /login when visiting a protected route unauthenticated', () => {
    setAuth(null, null)
    renderAt('/properties')

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('redirects an unknown path to /login when unauthenticated', () => {
    setAuth(null, null)
    renderAt('/something-else')

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
  })

  it('shows PropertiesPage for a buyer at /properties, with the header', () => {
    setAuth('tok', 'ROLE_BUYER')
    renderAt('/properties')

    expect(screen.getByTestId('properties-page')).toBeInTheDocument()
    expect(screen.getByText('Compra Tu Hogar')).toBeInTheDocument()
  })

  it('shows FavoritesPage for a buyer at /favorites', () => {
    setAuth('tok', 'ROLE_BUYER')
    renderAt('/favorites')

    // FavoritesPage's real useFavorites() fetch never resolves here (no backend),
    // so it stays in its initial loading state — that still proves routing worked.
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows AdminPage for an admin at /admin', () => {
    setAuth('tok', 'ROLE_ADMIN')
    renderAt('/admin')

    expect(screen.getByTestId('admin-tabs')).toBeInTheDocument()
  })

  it('shows AgencyDashboardPage for an agency at /agency', () => {
    setAuth('tok', 'ROLE_AGENCY')
    renderAt('/agency')

    expect(screen.getByTestId('agency-tabs')).toBeInTheDocument()
  })

  it('redirects a buyer away from /admin', () => {
    setAuth('tok', 'ROLE_BUYER')
    renderAt('/admin')

    expect(screen.queryByTestId('admin-tabs')).not.toBeInTheDocument()
    expect(screen.getByTestId('properties-page')).toBeInTheDocument()
  })

  it('redirects an authenticated user visiting /login to their default page', () => {
    setAuth('tok', 'ROLE_AGENCY')
    renderAt('/login')

    expect(screen.getByTestId('agency-tabs')).toBeInTheDocument()
  })

  it('redirects an unknown path to the default page when authenticated', () => {
    setAuth('tok', 'ROLE_ADMIN')
    renderAt('/something-else')

    expect(screen.getByTestId('admin-tabs')).toBeInTheDocument()
  })

  it('does not show the header when unauthenticated', () => {
    setAuth(null, null)
    renderAt('/login')

    // LoginPage also has its own "Compra Tu Hogar" title, so check for the
    // header itself (its Logout button) rather than that shared text.
    expect(screen.queryByText('Logout')).not.toBeInTheDocument()
  })
})
