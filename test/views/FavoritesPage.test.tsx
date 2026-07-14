import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FavoritesPage from '../../src/views/FavoritesPage'
import { useFavorites } from '../../src/controllers/useFavorites'
import type { Favorite } from '../../src/models/types'

vi.mock('../../src/controllers/useFavorites', () => ({ useFavorites: vi.fn() }))

const favorite: Favorite = {
  id: 1, agencyPropertyId: 5, propertyAddress: 'Calle 1', city: 'Quilmes',
  agencyName: 'ritondo_propiedades', score: 4, comment: 'nice', savedPrice: 1000, savedDate: '2026-01-01',
}

afterEach(() => {
  vi.mocked(useFavorites).mockReset()
})

function setupMocks(overrides: Partial<ReturnType<typeof useFavorites>> = {}) {
  vi.mocked(useFavorites).mockReturnValue({
    list: [favorite], loading: false, error: null,
    addFavorite: vi.fn(), isFavorite: vi.fn(), editFavorite: vi.fn(), removeFavorite: vi.fn(),
    ...overrides,
  })
}

describe('FavoritesPage', () => {
  it('shows a loading message', () => {
    setupMocks({ loading: true, list: [] })
    render(<FavoritesPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('shows an error message', () => {
    setupMocks({ error: 'Access denied.', list: [] })
    render(<FavoritesPage />)
    expect(screen.getByText('Error: Access denied.')).toBeInTheDocument()
  })

  it('shows an empty state when there are no favorites', () => {
    setupMocks({ list: [] })
    render(<FavoritesPage />)
    expect(screen.getByText('No favorites yet.')).toBeInTheDocument()
  })

  it('renders the favorite list', () => {
    setupMocks()
    render(<FavoritesPage />)

    expect(screen.getByText('Calle 1')).toBeInTheDocument()
    expect(screen.getByText('Quilmes · ritondo_propiedades')).toBeInTheDocument()
  })

  it('deletes a favorite', () => {
    const removeFavorite = vi.fn()
    setupMocks({ removeFavorite })
    render(<FavoritesPage />)

    fireEvent.click(screen.getByText('Delete'))

    expect(removeFavorite).toHaveBeenCalledWith(1)
  })

  it('edits a favorite score and comment', async () => {
    const editFavorite = vi.fn().mockResolvedValue(undefined)
    setupMocks({ editFavorite })
    render(<FavoritesPage />)

    fireEvent.click(screen.getByText('Edit'))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'updated comment' } })
    fireEvent.click(screen.getByText('Save'))

    expect(editFavorite).toHaveBeenCalledWith(1, 4, 'updated comment')
  })

  it('cancels editing without calling editFavorite', () => {
    const editFavorite = vi.fn()
    setupMocks({ editFavorite })
    render(<FavoritesPage />)

    fireEvent.click(screen.getByText('Edit'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(editFavorite).not.toHaveBeenCalled()
    expect(screen.queryByText('Save')).not.toBeInTheDocument()
  })
})
