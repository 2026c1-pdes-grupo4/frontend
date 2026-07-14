import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuthContext } from '../context/AuthContext'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import { Pager } from '../components/Pager'
import {
  useAdminData,
  fetchAllUsers,
  fetchAllAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
  createUser,
  createAgency,
} from '../controllers/useAdmin'
import UserForm from '../components/UserForm'
import AgencyForm from '../components/AgencyForm'
import type { User, Agency, Favorite, Purchase, TopBuyer, TopRankedProperty, TopAgencySales } from '../models/types'
import './AdminPage.css'

type Tab = 'users' | 'agencies' | 'favorites' | 'purchases' | 'reports'

const TABS: { key: Tab; label: string; testId: string }[] = [
  { key: 'users', label: 'Users', testId: 'tab-users' },
  { key: 'agencies', label: 'Agencies', testId: 'tab-agencies' },
  { key: 'favorites', label: 'Favorites', testId: 'tab-favorites' },
  { key: 'purchases', label: 'Purchases', testId: 'tab-purchases' },
  { key: 'reports', label: 'Reports', testId: 'tab-reports' },
]

function TabStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="admin-status">Loading...</p>
  if (error) return <p className="admin-status admin-status--error">Error: {error}</p>
  return null
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

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [newUsers, setNewUsers] = useState<User[]>([])
  const [newAgencies, setNewAgencies] = useState<Agency[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [showAgencyForm, setShowAgencyForm] = useState(false)

  const allUsers = [...newUsers, ...users.data]
  const allAgencies = [...newAgencies, ...agencies.data]

  const usersPagination = usePagination(allUsers, pageSize)
  const agenciesPagination = usePagination(allAgencies, pageSize)
  const favoritesPagination = usePagination(favorites.data, pageSize)
  const purchasesPagination = usePagination(purchases.data, pageSize)

  const handleCreateUser = async (data: Parameters<typeof createUser>[1]) => {
    const created = await createUser(token!, data)
    setNewUsers(prev => [created, ...prev])
    setShowUserForm(false)
  }

  const handleCreateAgency = async (data: Parameters<typeof createAgency>[1]) => {
    const created = await createAgency(token!, data)
    setNewAgencies(prev => [created, ...prev])
    setShowAgencyForm(false)
  }

  return (
    <div className="admin-page-wrapper">
      <div className="admin-page">
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
            <>
              {showUserForm && (
                <UserForm onSubmit={handleCreateUser} onCancel={() => setShowUserForm(false)} />
              )}
              <UsersTable rows={usersPagination.pagedData as User[]} />
              <div className="admin-toolbar">
                <Pager p={usersPagination} pageSize={pageSize} onPageSize={setPageSize} />
                {!showUserForm && (
                  <button
                    className="admin-fab"
                    data-testid="btn-new-user"
                    title="New Buyer"
                    onClick={() => setShowUserForm(true)}
                  >
                    <Plus size={22} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </>
          )}
          {!current.loading && !current.error && tab === 'agencies' && (
            <>
              {showAgencyForm && (
                <AgencyForm onSubmit={handleCreateAgency} onCancel={() => setShowAgencyForm(false)} />
              )}
              <AgenciesTable rows={agenciesPagination.pagedData as Agency[]} />
              <div className="admin-toolbar">
                <Pager p={agenciesPagination} pageSize={pageSize} onPageSize={setPageSize} />
                {!showAgencyForm && (
                  <button
                    className="admin-fab"
                    data-testid="btn-new-agency"
                    title="New Agency"
                    onClick={() => setShowAgencyForm(true)}
                  >
                    <Plus size={22} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </>
          )}
          {!current.loading && !current.error && tab === 'favorites' && (
            <>
              <FavoritesTable rows={favoritesPagination.pagedData as Favorite[]} />
              <Pager p={favoritesPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
          )}
          {!current.loading && !current.error && tab === 'purchases' && (
            <>
              <PurchasesTable rows={purchasesPagination.pagedData as Purchase[]} />
              <Pager p={purchasesPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
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
    <table className="admin-table" data-testid="users-table">
      <thead>
        <tr>
          <th>Username</th><th>Email</th><th>Profile</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((u) => (
          <tr key={u.id} data-testid="user-row">
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
          <th>Username</th><th>Email</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((a) => (
          <tr key={a.id}>
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
          <th>Property</th><th>Agency</th><th>Score</th><th>Comment</th><th>Date</th><th>Price</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.id}>
            <td>{f.propertyAddress}</td>
            <td>{f.agencyName}</td>
            <td>{'★'.repeat(Math.min(f.score, 5))}{'☆'.repeat(Math.max(0, 5 - f.score))}</td>
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
          <th>Property</th><th>Agency</th><th>Price</th><th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p) => (
          <tr key={p.id}>
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
      <h3>Top 5 sellings agencies</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Agency</th><th>Qty sales</th>
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
      <h3>Top 5 ranked properties</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Adress</th><th>Avg score</th><th>Reviews</th>
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
      <h3>Top 5 buyers</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th><th>Purchases</th>
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

