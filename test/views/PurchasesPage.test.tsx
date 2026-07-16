import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import PurchasesPage from '../../src/views/PurchasesPage'
import { usePurchases } from '../../src/controllers/usePurchases'
import type { Purchase } from '../../src/models/types'

vi.mock('../../src/controllers/usePurchases', () => ({ usePurchases: vi.fn() }))

const purchase: Purchase = {
  id: 1,
  agencyId: 2,
  propertyAddress: 'Av. Bustillo Km 4.5',
  agencyName: 'ritondo_propiedades',
  purchasePrice: 480000,
  purchaseDate: '2026-07-16',
  buyerId: 3,
  buyerUsername: 'john',
  buyerEmail: 'john@example.com',
}

afterEach(() => {
  vi.mocked(usePurchases).mockReset()
})

function setupMocks(overrides: Partial<ReturnType<typeof usePurchases>> = {}) {
  vi.mocked(usePurchases).mockReturnValue({
    list: [purchase], loading: false, error: null, buyProperty: vi.fn(),
    ...overrides,
  })
}

describe('PurchasesPage', () => {
  it('shows a loading message', () => {
    setupMocks({ loading: true, list: [] })
    render(<PurchasesPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows an error message', () => {
    setupMocks({ error: 'Server error - please try again later.', list: [] })
    render(<PurchasesPage />)
    expect(screen.getByText('Server error - please try again later.')).toBeInTheDocument()
  })

  it('shows an empty state when there are no purchases', () => {
    setupMocks({ list: [] })
    render(<PurchasesPage />)
    expect(screen.getByText('No purchases yet.')).toBeInTheDocument()
  })

  it('renders the purchases list with all details', () => {
    setupMocks()
    render(<PurchasesPage />)

    expect(screen.getByText('My Purchases')).toBeInTheDocument()
    expect(screen.getByText('Av. Bustillo Km 4.5')).toBeInTheDocument()
    expect(screen.getByText('ritondo_propiedades')).toBeInTheDocument()
    expect(screen.getByText('$480,000')).toBeInTheDocument()
    expect(screen.getByText('Date: 2026-07-16')).toBeInTheDocument()
    expect(screen.getByText('Purchased')).toBeInTheDocument()
  })
})
