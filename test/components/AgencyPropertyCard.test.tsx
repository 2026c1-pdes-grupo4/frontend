import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AgencyPropertyCard from '../../src/components/AgencyPropertyCard'
import type { AgencyProperty } from '../../src/models/types'

const listing: AgencyProperty = {
  id: 1, propertyId: 10, address: 'Calle 1', city: 'Quilmes', propertyType: 'HOUSE',
  listedPrice: 1000, listedDate: '2026-01-01', available: true, agencyId: 1, agencyName: 'ritondo_propiedades',
}

describe('AgencyPropertyCard', () => {
  it('renders the listing details', () => {
    render(<AgencyPropertyCard property={listing} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Calle 1')).toBeInTheDocument()
    expect(screen.getByText('Quilmes')).toBeInTheDocument()
    expect(screen.getByText('USD 1,000')).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('shows "Sold" when the listing is not available', () => {
    render(<AgencyPropertyCard property={{ ...listing, available: false }} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Sold')).toBeInTheDocument()
  })

  it('calls onEdit with the listing when Edit is clicked', () => {
    const onEdit = vi.fn()
    render(<AgencyPropertyCard property={listing} onEdit={onEdit} onDelete={vi.fn()} />)

    fireEvent.click(screen.getByTestId('btn-edit-property'))

    expect(onEdit).toHaveBeenCalledWith(listing)
  })

  it('calls onDelete with the listing id when Delete is clicked', () => {
    const onDelete = vi.fn()
    render(<AgencyPropertyCard property={listing} onEdit={vi.fn()} onDelete={onDelete} />)

    fireEvent.click(screen.getByTestId('btn-delete-property'))

    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
