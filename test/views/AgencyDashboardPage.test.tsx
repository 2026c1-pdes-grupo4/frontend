import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgencyDashboardPage from '../../src/views/AgencyDashboardPage'
import { useAgencyProperties } from '../../src/controllers/useAgencyProperties'
import { useAgencyPurchases } from '../../src/controllers/useAgencyPurchases'
import { useAgencyClients } from '../../src/controllers/useAgencyClients'
import type { AgencyProperty, Purchase, AgencyClient } from '../../src/models/types'

vi.mock('../../src/controllers/useAgencyProperties', () => ({ useAgencyProperties: vi.fn() }))
vi.mock('../../src/controllers/useAgencyPurchases', () => ({ useAgencyPurchases: vi.fn() }))
vi.mock('../../src/controllers/useAgencyClients', () => ({ useAgencyClients: vi.fn() }))

const listing: AgencyProperty = {
  id: 1, propertyId: 10, address: 'Calle 1', city: 'Quilmes', propertyType: 'HOUSE',
  listedPrice: 1000, listedDate: '2026-01-01', available: true, agencyId: 1, agencyName: 'ritondo_propiedades',
}
const sale: Purchase = {
  id: 1, agencyId: 1, propertyAddress: 'Calle 1', agencyName: 'ritondo_propiedades',
  purchasePrice: 1000, purchaseDate: '2026-01-01', buyerId: 7, buyerUsername: 'buyer1', buyerEmail: 'buyer1@test.com',
}
const client: AgencyClient = { agencyId: 1, userId: 7, username: 'buyer1', email: 'buyer1@test.com' }

let add: ReturnType<typeof vi.fn>
let edit: ReturnType<typeof vi.fn>
let remove: ReturnType<typeof vi.fn>

afterEach(() => {
  vi.mocked(useAgencyProperties).mockReset()
  vi.mocked(useAgencyPurchases).mockReset()
  vi.mocked(useAgencyClients).mockReset()
})

function setupMocks() {
  add = vi.fn().mockResolvedValue(undefined)
  edit = vi.fn().mockResolvedValue(undefined)
  remove = vi.fn().mockResolvedValue(undefined)
  vi.mocked(useAgencyProperties).mockReturnValue({ list: [listing], loading: false, error: null, add, edit, remove })
  vi.mocked(useAgencyPurchases).mockReturnValue({ list: [sale], loading: false, error: null })
  vi.mocked(useAgencyClients).mockReturnValue({ list: [client], loading: false, error: null })
}

describe('AgencyDashboardPage', () => {
  it('shows the properties tab by default', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    expect(screen.getByTestId('property-list')).toBeInTheDocument()
    expect(screen.getByText('Calle 1')).toBeInTheDocument()
  })

  it('switches to the sales tab', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('tab-sales'))

    expect(screen.getByTestId('sales-list')).toBeInTheDocument()
    expect(screen.getByText('buyer1')).toBeInTheDocument()
  })

  it('switches to the clients tab', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('tab-clients'))

    expect(screen.getByTestId('clients-list')).toBeInTheDocument()
    expect(screen.getByText('buyer1@test.com')).toBeInTheDocument()
  })

  it('creates a new property via the form', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('btn-new-property'))
    fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Calle 2' } })
    fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Berazategui' } })
    fireEvent.change(screen.getByTestId('input-province'), { target: { value: 'BA' } })
    fireEvent.click(screen.getByTestId('btn-submit-property'))

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ address: 'Calle 2', city: 'Berazategui' }))
  })

  it('edits an existing property, pre-filling the form', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('btn-edit-property'))

    expect(screen.getByTestId('input-address')).toHaveValue('Calle 1')
    // NOTE: AgencyProperty has no `province` field, so the edit form's
    // required Province input starts empty and blocks submission until the
    // user retypes it manually — a real UX gap, not a test artifact.
    fireEvent.change(screen.getByTestId('input-province'), { target: { value: 'BA' } })

    fireEvent.click(screen.getByTestId('btn-submit-property'))
    expect(edit).toHaveBeenCalledWith(listing, expect.objectContaining({ address: 'Calle 1' }))
  })

  it('deletes a property', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('btn-delete-property'))

    expect(remove).toHaveBeenCalledWith(listing.id)
  })

  it('cancels the form without adding a property', () => {
    setupMocks()
    render(<AgencyDashboardPage />)

    fireEvent.click(screen.getByTestId('btn-new-property'))
    fireEvent.click(screen.getByTestId('btn-cancel-property'))

    expect(screen.getByTestId('btn-new-property')).toBeInTheDocument()
    expect(add).not.toHaveBeenCalled()
  })
})
