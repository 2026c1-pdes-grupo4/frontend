import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from '../../src/components/StarRating'

describe('StarRating', () => {
  it('renders 5 stars, filling up to the given value', () => {
    render(<StarRating value={3} onChange={vi.fn()} />)
    const stars = screen.getAllByText('★')

    expect(stars).toHaveLength(5)
    expect(stars[0]).toHaveClass('star--filled')
    expect(stars[2]).toHaveClass('star--filled')
    expect(stars[3]).not.toHaveClass('star--filled')
  })

  it('calls onChange with the clicked star number', () => {
    const onChange = vi.fn()
    render(<StarRating value={1} onChange={onChange} />)

    fireEvent.click(screen.getAllByText('★')[3])

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('previews the hovered rating without calling onChange', () => {
    render(<StarRating value={1} onChange={vi.fn()} />)
    const stars = screen.getAllByText('★')

    fireEvent.mouseEnter(stars[4])
    expect(stars[4]).toHaveClass('star--filled')

    fireEvent.mouseLeave(stars[4])
    expect(stars[4]).not.toHaveClass('star--filled')
  })
})
