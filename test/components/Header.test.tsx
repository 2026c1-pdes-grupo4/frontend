import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../../src/components/Header'

function renderHeader(role: string | null, onLogout = vi.fn()) {
  return render(
    <MemoryRouter>
      <Header role={role} onLogout={onLogout} />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('shows buyer links for ROLE_BUYER', () => {
    renderHeader('ROLE_BUYER')

    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
    expect(screen.queryByText('Agency')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('shows the agency link for ROLE_AGENCY', () => {
    renderHeader('ROLE_AGENCY')

    expect(screen.getByText('Agency')).toBeInTheDocument()
    expect(screen.queryByText('Search')).not.toBeInTheDocument()
  })

  it('shows the admin link for ROLE_ADMIN', () => {
    renderHeader('ROLE_ADMIN')

    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('shows no nav links for an unknown role', () => {
    renderHeader(null)

    expect(screen.queryByText('Search')).not.toBeInTheDocument()
    expect(screen.queryByText('Agency')).not.toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('calls onLogout when the logout button is clicked', () => {
    const onLogout = vi.fn()
    renderHeader('ROLE_BUYER', onLogout)

    fireEvent.click(screen.getByText('Logout'))

    expect(onLogout).toHaveBeenCalled()
  })
})
