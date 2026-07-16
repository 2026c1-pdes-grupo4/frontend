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
  createUser,
  createAgency,
  updateUser,
  deleteUser,
  updateAgency,
  deleteAgency,
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
  createUser: vi.fn(),
  createAgency: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  updateAgency: vi.fn(),
  deleteAgency: vi.fn(),
}))

const empty = { data: [], loading: false, error: null }
const dataByFetcher = new Map<unknown, { data: unknown[]; loading: boolean; error: string | null }>()

afterEach(() => {
  vi.mocked(useAuthContext).mockReset()
  vi.mocked(useAdminData).mockReset()
  vi.mocked(createUser).mockReset()
  vi.mocked(createAgency).mockReset()
  vi.mocked(updateUser).mockReset()
  vi.mocked(deleteUser).mockReset()
  vi.mocked(updateAgency).mockReset()
  vi.mocked(deleteAgency).mockReset()
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

  it('opens the new user form and creates a user', async () => {
    setupMocks()
    vi.mocked(createUser).mockResolvedValue({ id: 99, username: 'nuevo', email: 'nuevo@cth.com', profileType: 'BUYER' })
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('btn-new-user'))
    expect(screen.getByTestId('user-form')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'nuevo' } })
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'nuevo@cth.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-user'))

    expect(createUser).toHaveBeenCalledWith('tok', {
      username: 'nuevo',
      email: 'nuevo@cth.com',
      password: 'secret123',
      profileType: 'BUYER',
    })
    expect(await screen.findByText('nuevo')).toBeInTheDocument()
    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument()
  })

  it('cancels the new user form without creating a user', () => {
    setupMocks()
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('btn-new-user'))
    fireEvent.click(screen.getByTestId('btn-cancel-user'))

    expect(screen.queryByTestId('user-form')).not.toBeInTheDocument()
    expect(createUser).not.toHaveBeenCalled()
  })

  it('opens the new agency form and creates an agency', async () => {
    setupMocks()
    vi.mocked(createAgency).mockResolvedValue({ id: 88, username: 'nueva_inmo', email: 'nueva@cth.com' })
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-agencies'))
    fireEvent.click(screen.getByTestId('btn-new-agency'))
    expect(screen.getByTestId('agency-form')).toBeInTheDocument()

    fireEvent.change(screen.getByTestId('input-username'), { target: { value: 'nueva_inmo' } })
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'nueva@cth.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-agency'))

    expect(createAgency).toHaveBeenCalledWith('tok', {
      username: 'nueva_inmo',
      email: 'nueva@cth.com',
      password: 'secret123',
    })
    expect(await screen.findByText('nueva_inmo')).toBeInTheDocument()
    expect(screen.queryByTestId('agency-form')).not.toBeInTheDocument()
  })

  it('edits a user and reflects the change in the table', async () => {
    setupMocks()
    vi.mocked(updateUser).mockResolvedValue({ id: 1, username: 'buyer1', email: 'updated@test.com', profileType: 'BUYER' })
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('btn-edit-user'))
    expect(screen.getByTestId('user-form')).toBeInTheDocument()
    expect(screen.getByTestId('input-username')).toHaveValue('buyer1')

    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'updated@test.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-user'))

    expect(updateUser).toHaveBeenCalledWith('tok', 1, {
      username: 'buyer1',
      email: 'updated@test.com',
      password: 'secret123',
      profileType: 'BUYER',
    })
    expect(await screen.findByText('updated@test.com')).toBeInTheDocument()
  })

  it('deletes a user and removes it from the table', async () => {
    setupMocks()
    vi.mocked(deleteUser).mockResolvedValue(undefined)
    render(<AdminPage />)

    expect(screen.getByText('buyer1')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('btn-delete-user'))

    expect(deleteUser).toHaveBeenCalledWith('tok', 1)
    await new Promise(r => setTimeout(r, 0))
    expect(screen.queryByText('buyer1')).not.toBeInTheDocument()
  })

  it('edits an agency and reflects the change in the table', async () => {
    setupMocks()
    vi.mocked(updateAgency).mockResolvedValue({ id: 1, username: 'ritondo_propiedades', email: 'updated@test.com' })
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-agencies'))
    fireEvent.click(screen.getByTestId('btn-edit-agency'))
    expect(screen.getByTestId('agency-form')).toBeInTheDocument()
    expect(screen.getByTestId('input-username')).toHaveValue('ritondo_propiedades')

    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'updated@test.com' } })
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByTestId('btn-submit-agency'))

    expect(updateAgency).toHaveBeenCalledWith('tok', 1, {
      username: 'ritondo_propiedades',
      email: 'updated@test.com',
      password: 'secret123',
    })
    expect(await screen.findByText('updated@test.com')).toBeInTheDocument()
  })

  it('deletes an agency and removes it from the table', async () => {
    setupMocks()
    vi.mocked(deleteAgency).mockResolvedValue(undefined)
    render(<AdminPage />)

    fireEvent.click(screen.getByTestId('tab-agencies'))
    expect(screen.getByText('ritondo_propiedades')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('btn-delete-agency'))

    expect(deleteAgency).toHaveBeenCalledWith('tok', 1)
    await new Promise(r => setTimeout(r, 0))
    expect(screen.queryByText('ritondo_propiedades')).not.toBeInTheDocument()
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
