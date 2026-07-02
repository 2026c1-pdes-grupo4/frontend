import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminPage from '../../src/views/AdminPage'
import { useAuthContext } from '../../src/context/AuthContext'
import {
  useAdminData,
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
} from '../../src/controllers/useAdmin'

vi.mock('../../src/context/AuthContext', () => ({ useAuthContext: vi.fn() }))
vi.mock('../../src/controllers/useAdmin', () => ({
  useAdminData: vi.fn(),
  fetchAllUsers: vi.fn(),
  fetchAllAgencies: vi.fn(),
  fetchAllFavorites: vi.fn(),
  fetchAllPurchases: vi.fn(),
  fetchTopBuyers: vi.fn(),
  fetchTopRankedProperties: vi.fn(),
  fetchTopAgenciesSales: vi.fn(),
}))

const empty = { data: [], loading: false, error: null }
const dataByFetcher = new Map<unknown, { data: unknown[]; loading: boolean; error: string | null }>()

afterEach(() => {
  vi.mocked(useAuthContext).mockReset()
  vi.mocked(useAdminData).mockReset()
  dataByFetcher.clear()
})

function setupMocks() {
  vi.mocked(useAuthContext).mockReturnValue({ token: 'tok', role: 'ROLE_ADMIN', setToken: vi.fn() })
  dataByFetcher.set(fetchAllUsers, { data: [{ id: 1, username: 'buyer1', email: 'buyer1@test.com', profileType: 'BUYER' }], loading: false, error: null })
  dataByFetcher.set(fetchAllAgencies, { data: [{ id: 1, username: 'ritondo_propiedades', email: 'ritondo@test.com' }], loading: false, error: null })
  dataByFetcher.set(fetchAllFavorites, { data: [], loading: false, error: null })
  dataByFetcher.set(fetchAllPurchases, { data: [], loading: false, error: null })
  dataByFetcher.set(fetchTopBuyers, { data: [{ userId: 1, username: 'buyer1', purchases: 3 }], loading: false, error: null })
  dataByFetcher.set(fetchTopRankedProperties, { data: [], loading: false, error: null })
  dataByFetcher.set(fetchTopAgenciesSales, { data: [], loading: false, error: null })

  vi.mocked(useAdminData).mockImplementation((fetcher, _token, active) => {
    if (!active) return empty
    return dataByFetcher.get(fetcher) ?? empty
  })
}

describe('AdminPage', () => {
  it('shows the users tab by default', () => {
    setupMocks()
    render(<AdminPage />)

    expect(screen.getByTestId('users-table')).toBeInTheDocument()
    expect(screen.getByText('buyer1')).toBeInTheDocument()
  })

  it('switches to the agencies tab', () => {
    setupMocks()
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-agencies'))

    expect(screen.getByText('ritondo_propiedades')).toBeInTheDocument()
  })

  it('shows an empty state for a tab with no data', () => {
    setupMocks()
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-favorites'))

    expect(screen.getByText('No favorites found.')).toBeInTheDocument()
  })

  it('shows the reports section with top buyers', () => {
    setupMocks()
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-reports'))

    expect(screen.getByTestId('reports-section')).toBeInTheDocument()
    expect(screen.getByTestId('top-buyer-row')).toHaveTextContent('buyer1')
  })

  it('shows a loading state', () => {
    setupMocks()
    vi.mocked(useAdminData).mockImplementation((fetcher, _token, active) =>
      active && fetcher === fetchAllUsers ? { data: [], loading: true, error: null } : empty,
    )
    render(<AdminPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows an error state', () => {
    setupMocks()
    vi.mocked(useAdminData).mockImplementation((fetcher, _token, active) =>
      active && fetcher === fetchAllUsers ? { data: [], loading: false, error: 'Access denied.' } : empty,
    )
    render(<AdminPage />)

    expect(screen.getByText('Error: Access denied.')).toBeInTheDocument()
  })
})
