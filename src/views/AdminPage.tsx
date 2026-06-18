import { useState, useEffect } from 'react'
import { useAuthContext } from '../context/AuthContext'
import {
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
} from '../services/adminService'
import type { User, Agency, Favorite, Purchase, TopBuyer, TopRankedProperty, TopAgencySales } from '../models/types'
import './AdminPage.css'

type Tab = 'users' | 'agencies' | 'favorites' | 'purchases' | 'reports'

const TABS: { key: Tab; label: string; testId: string }[] = [
  { key: 'users', label: 'Users', testId: 'tab-users' },
  { key: 'agencies', label: 'Agencies', testId: 'tab-agencies' },
  { key: 'favorites', label: 'Favorites', testId: 'tab-favorites' },
  { key: 'purchases', label: 'Purchases', testId: 'tab-purchases' },
  { key: 'reports', label: 'Reportes', testId: 'tab-reports' },
]

function TabStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="admin-status">Loading...</p>
  if (error) return <p className="admin-status admin-status--error">Error: {error}</p>
  return null
}

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
  const topBuyersData = useAdminData(fetchTopBuyers, token!, tab === 'reports')
  const topPropertiesData = useAdminData(fetchTopRankedProperties, token!, tab === 'reports')
  const topAgenciesData = useAdminData(fetchTopAgenciesSales, token!, tab === 'reports')

  const current = { users, agencies, favorites, purchases, reports: topBuyersData }[tab]

  return (
    <div className="admin-page-wrapper">
    <div className="admin-page">
      <h2>Admin Panel</h2>

      <div className="admin-tabs" data-testid="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            data-testid={t.testId}
            className={`admin-tab${tab === t.key ? ' admin-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        <TabStatus loading={current.loading} error={current.error} />

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
        {!current.loading && !current.error && tab === 'reports' && (
          <div data-testid="reports-section">
            <TopBuyersTable rows={topBuyersData.data as TopBuyer[]} />
            <TopRankedPropertiesTable rows={topPropertiesData.data as TopRankedProperty[]} />
            <TopAgenciesSalesTable rows={topAgenciesData.data as TopAgencySales[]} />
          </div>
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
            <td>{f.comment || '-'}</td>
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

function TopAgenciesSalesTable({ rows }: { rows: TopAgencySales[] }) {
  if (rows.length === 0) return <p className="admin-status">No data.</p>
  return (
    <>
      <h3>Top 5 inmobiliarias por ventas</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Inmobiliaria</th><th>Ventas</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.agencyId} data-testid="top-agency-row">
              <td>{a.username}</td>
              <td>{a.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TopRankedPropertiesTable({ rows }: { rows: TopRankedProperty[] }) {
  if (rows.length === 0) return <p className="admin-status">No data.</p>
  return (
    <>
      <h3>Top 5 propiedades mejor puntuadas</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Dirección</th><th>Puntaje promedio</th><th>Valoraciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.propertyId} data-testid="top-property-row">
              <td>{p.address}</td>
              <td>{p.averageScore.toFixed(1)}</td>
              <td>{p.ratings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TopBuyersTable({ rows }: { rows: TopBuyer[] }) {
  if (rows.length === 0) return <p className="admin-status">No data.</p>
  return (
    <>
      <h3>Top 5 compradores</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuario</th><th>Compras</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.userId} data-testid="top-buyer-row">
              <td>{b.username}</td>
              <td>{b.purchases}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
