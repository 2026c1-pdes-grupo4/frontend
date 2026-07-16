import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PropertiesPage from '../../src/views/PropertiesPage'
import { useProperties } from '../../src/controllers/useProperties'
import { useFavorites } from '../../src/controllers/useFavorites'
import { usePurchases } from '../../src/controllers/usePurchases'
import type { AgencyProperty } from '../../src/models/types'

vi.mock('../../src/controllers/useProperties', () => ({ useProperties: vi.fn() }))
vi.mock('../../src/controllers/useFavorites', () => ({ useFavorites: vi.fn() }))
vi.mock('../../src/controllers/usePurchases', () => ({ usePurchases: vi.fn() }))

const property: AgencyProperty = {
  id: 1, propertyId: 1, propertyType: 'HOUSE', listedPrice: 1000, listedDate: '2026-01-01', address: 'Calle 1', city: 'Quilmes',
  province: 'BA', areaSq: 50, rooms: 3, description: 'desc', available: true,
  agencyId: 2, agencyName: 'ritondo_propiedades',
}

afterEach(() => {
  vi.mocked(useProperties).mockReset()
  vi.mocked(useFavorites).mockReset()
  vi.mocked(usePurchases).mockReset()
})

function setupMocks(overrides: Partial<ReturnType<typeof useProperties>> = {}) {
  vi.mocked(useProperties).mockReturnValue({ list: [property], loading: false, error: null, ...overrides })
  vi.mocked(useFavorites).mockReturnValue({
    list: [], loading: false, error: null, addFavorite: vi.fn(), isFavorite: vi.fn().mockReturnValue(false),
    editFavorite: vi.fn(), removeFavorite: vi.fn(),
  })
  vi.mocked(usePurchases).mockReturnValue({ buyProperty: vi.fn() })
}

describe('PropertiesPage', () => {
  it('renders the property list', () => {
    setupMocks()
    render(<PropertiesPage />)

    expect(screen.getByTestId('properties-page')).toBeInTheDocument()
    expect(screen.getByText('Calle 1')).toBeInTheDocument()
  })

  it('shows a loading message', () => {
    setupMocks({ loading: true, list: [] })
    render(<PropertiesPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows an error message', () => {
    setupMocks({ error: 'Server error - please try again later.', list: [] })
    render(<PropertiesPage />)
    expect(screen.getByText('Server error - please try again later.')).toBeInTheDocument()
  })

  it('shows an empty state when there are no properties', () => {
    setupMocks({ list: [] })
    render(<PropertiesPage />)
    expect(screen.getByText('No properties found.')).toBeInTheDocument()
  })

  it('re-fetches with the updated filter when the city input changes', async () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Quilmes' } })

    await waitFor(() => {
      expect(useProperties).toHaveBeenLastCalledWith({ city: 'Quilmes' }, 1, 10)
    })
  })

  it('clears the filter when Clear is clicked', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Quilmes' } })
    fireEvent.click(screen.getByText('Clear'))

    expect(useProperties).toHaveBeenLastCalledWith({}, 1, 10)
  })

  it('re-fetches with the updated filter when the province input changes', async () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Province'), { target: { value: 'BA' } })

    await waitFor(() => {
      expect(useProperties).toHaveBeenLastCalledWith({ province: 'BA' }, 1, 10)
    })
  })

  it('re-fetches with the updated filter when the property type changes', async () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByDisplayValue('All types'), { target: { value: 'house' } })

    await waitFor(() => {
      expect(useProperties).toHaveBeenLastCalledWith({ propertyType: 'house' }, 1, 10)
    })
  })

  it('re-fetches page 1 with the new page size when it changes', () => {
    setupMocks({ totalPages: 3 })
    render(<PropertiesPage />)

    fireEvent.change(screen.getByDisplayValue('10 per page'), { target: { value: '20' } })

    expect(useProperties).toHaveBeenLastCalledWith({}, 1, 20)
  it('filters by province', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Province'), { target: { value: 'Buenos Aires' } })

    expect(useProperties).toHaveBeenLastCalledWith({ province: 'Buenos Aires' }, 1, 10)
  })

  it('filters by property type', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'house' } })

    expect(useProperties).toHaveBeenLastCalledWith({ propertyType: 'house' }, 1, 10)
  })

  it('filters by min price', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Min price'), { target: { value: '100000' } })

    expect(useProperties).toHaveBeenLastCalledWith({ minPrice: 100000 }, 1, 10)
  })

  it('filters by max price', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Max price'), { target: { value: '500000' } })

    expect(useProperties).toHaveBeenLastCalledWith({ maxPrice: 500000 }, 1, 10)
  })

  it('filters by min rooms', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Min rooms'), { target: { value: '2' } })

    expect(useProperties).toHaveBeenLastCalledWith({ minRooms: 2 }, 1, 10)
  })

  it('filters by max rooms', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Max rooms'), { target: { value: '4' } })

    expect(useProperties).toHaveBeenLastCalledWith({ maxRooms: 4 }, 1, 10)
  })

  it('clears a numeric filter when input is emptied', () => {
    setupMocks()
    render(<PropertiesPage />)

    fireEvent.change(screen.getByPlaceholderText('Min price'), { target: { value: '100000' } })
    fireEvent.change(screen.getByPlaceholderText('Min price'), { target: { value: '' } })

    expect(useProperties).toHaveBeenLastCalledWith({}, 1, 10)
  })

  it('removes a favorite when the star is clicked on a favorited property', () => {
    const removeFavorite = vi.fn()
    const favoriteList = [{ id: 99, agencyPropertyId: 1, propertyAddress: '', city: '', agencyName: '', score: 5, comment: '', savedPrice: 0, savedDate: '' }]
    vi.mocked(useProperties).mockReturnValue({ list: [property], loading: false, error: null, totalPages: 1 })
    vi.mocked(useFavorites).mockReturnValue({
      list: favoriteList, loading: false, error: null,
      addFavorite: vi.fn(), isFavorite: vi.fn().mockReturnValue(true),
      editFavorite: vi.fn(), removeFavorite,
    })
    vi.mocked(usePurchases).mockReturnValue({ buyProperty: vi.fn() })
    render(<PropertiesPage />)

    fireEvent.click(screen.getByTitle('Remove from favorites'))

    expect(removeFavorite).toHaveBeenCalledWith(99)
  })
})
