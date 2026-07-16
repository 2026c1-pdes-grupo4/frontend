import { useState, useEffect } from 'react'
import {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
  createUser,
  updateUser,
  deleteUser,
  createAgency,
  updateAgency,
  deleteAgency,
} from '../services/adminService'
import type { User, Agency, UserInput, AgencyInput } from '../models/types'

export {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
}

export function useAdminData<T>(fetcher: (token: string) => Promise<T[]>, token: string, active: boolean) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prevActive, setPrevActive] = useState(active)
  const [prevToken, setPrevToken] = useState(token)

  if (active !== prevActive || token !== prevToken) {
    setPrevActive(active)
    setPrevToken(token)
    if (active && token) {
      setLoading(true)
      setError(null)
    }
  }

  useEffect(() => {
    if (!active || !token) return
    fetcher(token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false))
  }, [active, token, fetcher])

  return { data, loading, error }
}

export function useAdminUsers(token: string, active: boolean) {
  const [list, setList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prevActive, setPrevActive] = useState(active)
  const [prevToken, setPrevToken] = useState(token)

  if (active !== prevActive || token !== prevToken) {
    setPrevActive(active)
    setPrevToken(token)
    if (active && token) {
      setLoading(true)
      setError(null)
    }
  }

  useEffect(() => {
    if (!active || !token) return
    fetchAllUsers(token)
      .then(setList)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false))
  }, [active, token])

  const create = async (data: UserInput) => {
    const created = await createUser(token, data)
    setList(prev => [...prev, created])
  }

  const update = async (id: number, data: UserInput) => {
    const updated = await updateUser(token, id, data)
    setList(prev => prev.map(u => u.id === id ? updated : u))
  }

  const remove = async (id: number) => {
    await deleteUser(token, id)
    setList(prev => prev.filter(u => u.id !== id))
  }

  return { list, loading, error, create, update, remove }
}

export function useAdminAgencies(token: string, active: boolean) {
  const [list, setList] = useState<Agency[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prevActive, setPrevActive] = useState(active)
  const [prevToken, setPrevToken] = useState(token)

  if (active !== prevActive || token !== prevToken) {
    setPrevActive(active)
    setPrevToken(token)
    if (active && token) {
      setLoading(true)
      setError(null)
    }
  }

  useEffect(() => {
    if (!active || !token) return
    fetchAllAgencies(token)
      .then(setList)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false))
  }, [active, token])

  const create = async (data: AgencyInput) => {
    const created = await createAgency(token, data)
    setList(prev => [...prev, created])
  }

  const update = async (id: number, data: AgencyInput) => {
    const updated = await updateAgency(token, id, data)
    setList(prev => prev.map(a => a.id === id ? updated : a))
  }

  const remove = async (id: number) => {
    await deleteAgency(token, id)
    setList(prev => prev.filter(a => a.id !== id))
  }

  return { list, loading, error, create, update, remove }
}
