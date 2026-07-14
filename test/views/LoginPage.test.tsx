import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../../src/views/LoginPage'
import { useAuth } from '../../src/controllers/useAuth'

vi.mock('../../src/controllers/useAuth', () => ({ useAuth: vi.fn() }))

const navigateMock = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => navigateMock }
})

afterEach(() => {
  vi.mocked(useAuth).mockReset()
  navigateMock.mockReset()
})

function fillAndSubmit(username: string, password: string) {
  fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: username } })
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: password } })
  fireEvent.click(screen.getByRole('button', { name: /Login/ }))
}

describe('LoginPage', () => {
  it('navigates to /admin when login returns ROLE_ADMIN', async () => {
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: false, error: null, handleLogin: vi.fn().mockResolvedValue('ROLE_ADMIN'), handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    fillAndSubmit('admin123', 'admin123')

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/admin'))
  })

  it('navigates to /agency when login returns ROLE_AGENCY', async () => {
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: false, error: null, handleLogin: vi.fn().mockResolvedValue('ROLE_AGENCY'), handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    fillAndSubmit('inmo1', 'agency123')

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/agency'))
  })

  it('navigates to /properties for any other role', async () => {
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: false, error: null, handleLogin: vi.fn().mockResolvedValue('ROLE_BUYER'), handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    fillAndSubmit('buyer1', 'buyer123')

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/properties'))
  })

  it('does not navigate when login fails', async () => {
    const handleLogin = vi.fn().mockResolvedValue(null)
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: false, error: null, handleLogin, handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    fillAndSubmit('bad', 'bad')

    await waitFor(() => expect(handleLogin).toHaveBeenCalledWith('bad', 'bad'))
    expect(navigateMock).not.toHaveBeenCalled()
  })

  it('shows the error message from the controller', () => {
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: false, error: 'Invalid credentials', handleLogin: vi.fn(), handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('disables the submit button while loading', () => {
    vi.mocked(useAuth).mockReturnValue({ token: null, loading: true, error: null, handleLogin: vi.fn(), handleLogout: vi.fn() })
    render(<MemoryRouter><LoginPage /></MemoryRouter>)

    expect(screen.getByRole('button', { name: /Logging in/ })).toBeDisabled()
  })
})
