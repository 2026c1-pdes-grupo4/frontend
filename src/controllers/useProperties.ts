import { useState, useEffect } from 'react'
import { fetchProperties } from '../services/propertyService'
import { useAuthContext } from '../context/AuthContext'
import { DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import type { AgencyProperty, PropertyFilter } from '../models/types'

export function useProperties(filter: PropertyFilter = {}, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const { token } = useAuthContext()
  const [list, setList] = useState<AgencyProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchProperties(filter, token, page, pageSize)
      .then(result => {
        setList(result.content)
        setTotalPages(result.totalPages)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filter), token, page, pageSize])

  return { list, loading, error, totalPages }
}
