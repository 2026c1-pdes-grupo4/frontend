import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PropertyCard from '../../src/components/PropertyCard'
import type { AgencyProperty } from '../../src/models/types'

const property: AgencyProperty = {
  id: 5, propertyId: 1, propertyType: 'HOUSE', listedPrice: 1000, listedDate: '2026-01-01', address: 'Calle 1',
  city: 'Quilmes', province: 'BA', areaSq: 50, rooms: 3, description: 'Nice house', available: true,
  agencyId: 2, agencyName: 'ritondo_propiedades',
}

describe('PropertyCard', () => {
  it('renders the property details', () => {
    render(<PropertyCard property={property} />)

    expect(screen.getByText('Calle 1')).toBeInTheDocument()
    expect(screen.getByText('Quilmes, BA')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('shows "Sold" and hides the buy button when unavailable', () => {
    render(<PropertyCard property={{ ...property, available: false }} onBuy={vi.fn()} />)

    expect(screen.getByText('Sold')).toBeInTheDocument()
    expect(screen.queryByTestId('btn-buy-property')).not.toBeInTheDocument()
  })

  it('does not render a favorite button when onFavorite is not provided', () => {
    render(<PropertyCard property={property} />)
    expect(screen.queryByTitle('Add to favorites')).not.toBeInTheDocument()
  })

  it('opens the favorite form and submits score/comment', () => {
    const onFavorite = vi.fn()
    render(<PropertyCard property={property} onFavorite={onFavorite} isFavorite={false} />)

    fireEvent.click(screen.getByTitle('Add to favorites'))
    fireEvent.change(screen.getByLabelText(/Comment/), { target: { value: 'great place' } })
    fireEvent.click(screen.getByText('Save'))

    expect(onFavorite).toHaveBeenCalledWith(5, 6, 'great place')
  })

  it('does not reopen the favorite form when already a favorite', () => {
    render(<PropertyCard property={property} onFavorite={vi.fn()} isFavorite={true} />)

    fireEvent.click(screen.getByTitle('Remove from favorites'))

    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })

  it('shows a confirmation dialog before buying, then confirms the purchase', async () => {
    const onBuy = vi.fn().mockResolvedValue(undefined)
    render(<PropertyCard property={property} onBuy={onBuy} />)

    fireEvent.click(screen.getByTestId('btn-buy-property'))
    expect(screen.getByTestId('buy-confirm-dialog')).toBeInTheDocument()

    await fireEvent.click(screen.getByTestId('btn-confirm-purchase'))

    expect(onBuy).toHaveBeenCalledWith(5)
    expect(await screen.findByTestId('purchase-success-message')).toBeInTheDocument()
    expect(screen.queryByTestId('buy-confirm-dialog')).not.toBeInTheDocument()
  })

  it('cancels the purchase confirmation without calling onBuy', () => {
    const onBuy = vi.fn()
    render(<PropertyCard property={property} onBuy={onBuy} />)

    fireEvent.click(screen.getByTestId('btn-buy-property'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(onBuy).not.toHaveBeenCalled()
    expect(screen.queryByTestId('buy-confirm-dialog')).not.toBeInTheDocument()
  })
})
