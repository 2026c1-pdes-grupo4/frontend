import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pager } from '../../src/components/Pager'
import type { usePagination } from '../../src/hooks/usePagination'

type PaginationState = ReturnType<typeof usePagination>

function paginationState(overrides: Partial<PaginationState> = {}): PaginationState {
  return {
    pagedData: [],
    page: 1,
    totalPages: 3,
    next: vi.fn(),
    prev: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  }
}

describe('Pager', () => {
  it('shows the current page and total pages', () => {
    render(<Pager p={paginationState({ page: 2, totalPages: 5 })} pageSize={10} onPageSize={vi.fn()} />)
    expect(screen.getByTestId('page-indicator')).toHaveTextContent('2 / 5')
  })

  it('disables "prev" on the first page and "next" on the last page', () => {
    render(<Pager p={paginationState({ page: 1, totalPages: 1 })} pageSize={10} onPageSize={vi.fn()} />)

    expect(screen.getByTestId('btn-prev-page')).toBeDisabled()
    expect(screen.getByTestId('btn-next-page')).toBeDisabled()
  })

  it('enables navigation buttons on a middle page and wires them to next/prev', () => {
    const p = paginationState({ page: 2, totalPages: 3 })
    render(<Pager p={p} pageSize={10} onPageSize={vi.fn()} />)

    expect(screen.getByTestId('btn-prev-page')).toBeEnabled()
    expect(screen.getByTestId('btn-next-page')).toBeEnabled()

    fireEvent.click(screen.getByTestId('btn-next-page'))
    expect(p.next).toHaveBeenCalled()

    fireEvent.click(screen.getByTestId('btn-prev-page'))
    expect(p.prev).toHaveBeenCalled()
  })

  it('calls onPageSize when the page size selector changes', () => {
    const onPageSize = vi.fn()
    render(<Pager p={paginationState()} pageSize={10} onPageSize={onPageSize} />)

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '20' } })

    expect(onPageSize).toHaveBeenCalledWith(20)
  })
})
