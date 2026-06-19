import { useState } from 'react'

export const PAGE_SIZE = 10

export function usePagination<T>(data: T[]) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))
  const pagedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const next = () => setPage(p => Math.min(p + 1, totalPages))
  const prev = () => setPage(p => Math.max(p - 1, 1))
  const reset = () => setPage(1)

  return { pagedData, page, totalPages, next, prev, reset }
}
