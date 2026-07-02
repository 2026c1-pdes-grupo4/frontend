import { useState } from 'react'

export const PAGE_SIZE_OPTIONS = [5, 10, 20] as const
export const DEFAULT_PAGE_SIZE = 10

export function usePagination<T>(data: T[], pageSize: number = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1)
  const [prevPageSize, setPrevPageSize] = useState(pageSize)

  if (pageSize !== prevPageSize) {
    setPrevPageSize(pageSize)
    setPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize)

  const next = () => setPage(p => Math.min(p + 1, totalPages))
  const prev = () => setPage(p => Math.max(p - 1, 1))
  const reset = () => setPage(1)

  return { pagedData, page, totalPages, next, prev, reset }
}
