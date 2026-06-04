import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
} from '../services/adminService'
import type { User, Agency, Favorite, Purchase } from '../models/types'
import './AdminPage.css'

type Tab = 'users' | 'agencies' | 'favorites' | 'purchases'

const TABS: { key: Tab; label: string }[] = [
  { key: 'users', label: 'Users' },
  { key: 'agencies', label: 'Agencies' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'purchases', label: 'Purchases' },
]

function useAdminData<T>(fetcher: (token: string) => Promise<T[]>, token: string, active: boolean) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!active || !token) return
    setLoading(true)
    setError(null)
    fetcher(token)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [active, token])

  return { data, loading, error }
}

export default function AdminPage() {
  const { token } = useAuthContext()
  const [tab, setTab] = useState<Tab>('users')

  const users = useAdminData(fetchAllUsers, token!, tab === 'users')
  const agencies = useAdminData(fetchAllAgencies, token!, tab === 'agencies')
  const favorites = useAdminData(fetchAllFavorites, token!, tab === 'favorites')
  const purchases = useAdminData(fetchAllPurchases, token!, tab === 'purchases')

  const current = { users, agencies, favorites, purchases }[tab]

  return (
    <div className="admin-page-wrapper">
    <div className="admin-page">
      <h2>Admin Panel</h2>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`admin-tab${tab === t.key ? ' admin-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {current.loading && <p className="admin-status">Loading...</p>}
        {current.error && <p className="admin-status admin-status--error">Error: {current.error}</p>}

        {!current.loading && !current.error && tab === 'users' && (
          <UsersTable rows={users.data as User[]} />
        )}
        {!current.loading && !current.error && tab === 'agencies' && (
          <AgenciesTable rows={agencies.data as Agency[]} />
        )}
        {!current.loading && !current.error && tab === 'favorites' && (
          <FavoritesTable rows={favorites.data as Favorite[]} />
        )}
        {!current.loading && !current.error && tab === 'purchases' && (
          <PurchasesTable rows={purchases.data as Purchase[]} />
        )}
      </div>
    </div>
    </div>
  )
}

function UsersTable({ rows }: { rows: User[] }) {
  if (rows.length === 0) return <p className="admin-status">No users found.</p>
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th><th>Username</th><th>Email</th><th>Profile</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((u) => (
          <tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td><span className={`admin-badge admin-badge--${u.profileType}`}>{u.profileType}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AgenciesTable({ rows }: { rows: Agency[] }) {
  if (rows.length === 0) return <p className="admin-status">No agencies found.</p>
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th><th>Username</th><th>Email</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.username}</td>
            <td>{a.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function FavoritesTable({ rows }: { rows: Favorite[] }) {
  if (rows.length === 0) return <p className="admin-status">No favorites found.</p>
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th><th>Property</th><th>Agency</th><th>Score</th><th>Comment</th><th>Date</th><th>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.id}>
            <td>{f.id}</td>
            <td>{f.propertyAddress}</td>
            <td>{f.agencyName}</td>
            <td>{'★'.repeat(f.score)}{'☆'.repeat(5 - f.score)}</td>
            <td>{f.comment || '—'}</td>
            <td>{f.savedDate}</td>
            <td>${f.savedPrice.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PurchasesTable({ rows }: { rows: Purchase[] }) {
  if (rows.length === 0) return <p className="admin-status">No purchases found.</p>
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>ID</th><th>Property</th><th>Agency</th><th>Price</th><th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.propertyAddress}</td>
            <td>{p.agencyName}</td>
            <td>${p.purchasePrice.toLocaleString()}</td>
            <td>{p.purchaseDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
