import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { usePagination } from '../../src/hooks/usePagination'

const data = Array.from({ length: 25 }, (_, i) => i + 1)

describe('usePagination', () => {
  it('returns the first page by default', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    expect(result.current.page).toBe(1)
    expect(result.current.pagedData).toEqual(data.slice(0, 10))
  })

  it('computes totalPages from data length and page size', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    expect(result.current.totalPages).toBe(3)
  })

  it('treats an empty list as a single page', () => {
    const { result } = renderHook(() => usePagination([], 10))
    expect(result.current.totalPages).toBe(1)
    expect(result.current.pagedData).toEqual([])
  })

  it('advances to the next page', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    act(() => result.current.next())
    expect(result.current.page).toBe(2)
    expect(result.current.pagedData).toEqual(data.slice(10, 20))
  })

  it('does not advance past the last page', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    act(() => result.current.next())
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.page).toBe(3)
  })

  it('does not go below page 1', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    act(() => result.current.prev())
    expect(result.current.page).toBe(1)
  })

  it('resets to page 1', () => {
    const { result } = renderHook(() => usePagination(data, 10))
    act(() => result.current.next())
    act(() => result.current.reset())
    expect(result.current.page).toBe(1)
  })

  it('resets to page 1 when the page size changes', () => {
    const { result, rerender } = renderHook(
      ({ pageSize }) => usePagination(data, pageSize),
      { initialProps: { pageSize: 10 } },
    )
    act(() => result.current.next())
    expect(result.current.page).toBe(2)

    rerender({ pageSize: 5 })
    expect(result.current.page).toBe(1)
  })
})
