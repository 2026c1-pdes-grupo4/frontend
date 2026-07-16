import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import { Pager } from '../components/Pager'
import {
  useAdminData,
  useAdminUsers,
  useAdminAgencies,
  fetchAllFavorites,
  fetchAllPurchases,
  fetchTopBuyers,
  fetchTopRankedProperties,
  fetchTopAgenciesSales,
} from '../controllers/useAdmin'
import type { Favorite, Purchase, TopBuyer, TopRankedProperty, TopAgencySales, UserInput, AgencyInput } from '../models/types'
import './AdminPage.css'

type Tab = 'users' | 'agencies' | 'favorites' | 'purchases' | 'reports'

const TABS: { key: Tab; label: string; testId: string }[] = [
  { key: 'users',     label: 'Users',     testId: 'tab-users' },
  { key: 'agencies',  label: 'Agencies',  testId: 'tab-agencies' },
  { key: 'favorites', label: 'Favorites', testId: 'tab-favorites' },
  { key: 'purchases', label: 'Purchases', testId: 'tab-purchases' },
  { key: 'reports',   label: 'Reports',   testId: 'tab-reports' },
]

const PROFILE_TYPES = ['BUYER', 'ADMIN']

function TabStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="admin-status" role="status">Loading...</p>
  if (error)   return <p className="admin-status admin-status--error" role="alert">Error: {error}</p>
  return null
}

/* ── User inline form ── */
function UserForm({ initial, onSave, onCancel }: {
  initial?: UserInput & { id?: number }
  onSave: (data: UserInput) => Promise<void>
  onCancel: () => void
}) {
  const [username, setUsername] = useState(initial?.username ?? '')
  const [email,    setEmail]    = useState(initial?.email    ?? '')
  const [password, setPassword] = useState('')
  const [profile,  setProfile]  = useState(initial?.profileType ?? 'BUYER')
  const [busy,     setBusy]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try { await onSave({ username, email, password, profileType: profile }) }
    finally { setBusy(false) }
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit} data-testid="user-form">
      <div className="form-field">
        <label htmlFor="uf-username">Username</label>
        <input id="uf-username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="username" />
      </div>
      <div className="form-field">
        <label htmlFor="uf-email">Email</label>
        <input id="uf-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" />
      </div>
      <div className="form-field">
        <label htmlFor="uf-password">Password</label>
        <input id="uf-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required={!initial?.id} placeholder={initial?.id ? '(leave blank to keep)' : 'password'} />
      </div>
      <div className="form-field">
        <label htmlFor="uf-profile">Profile</label>
        <select id="uf-profile" value={profile} onChange={e => setProfile(e.target.value)}>
          {PROFILE_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Agency inline form ── */
function AgencyForm({ initial, onSave, onCancel }: {
  initial?: AgencyInput & { id?: number }
  onSave: (data: AgencyInput) => Promise<void>
  onCancel: () => void
}) {
  const [username, setUsername] = useState(initial?.username ?? '')
  const [email,    setEmail]    = useState(initial?.email    ?? '')
  const [password, setPassword] = useState('')
  const [busy,     setBusy]     = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try { await onSave({ username, email, password }) }
    finally { setBusy(false) }
  }

  return (
    <form className="admin-inline-form" onSubmit={handleSubmit} data-testid="agency-form">
      <div className="form-field">
        <label htmlFor="af-username">Username</label>
        <input id="af-username" value={username} onChange={e => setUsername(e.target.value)} required placeholder="agency name" />
      </div>
      <div className="form-field">
        <label htmlFor="af-email">Email</label>
        <input id="af-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" />
      </div>
      <div className="form-field">
        <label htmlFor="af-password">Password</label>
        <input id="af-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required={!initial?.id} placeholder={initial?.id ? '(leave blank to keep)' : 'password'} />
      </div>
      <div className="admin-form-actions">
        <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

/* ── Main page ── */
export default function AdminPage() {
  const { token } = useAuthContext()
  const [tab, setTab] = useState<Tab>('users')

  const usersHook    = useAdminUsers(token!, tab === 'users')
  const agenciesHook = useAdminAgencies(token!, tab === 'agencies')
  const favorites    = useAdminData(fetchAllFavorites,        token!, tab === 'favorites')
  const purchases    = useAdminData(fetchAllPurchases,        token!, tab === 'purchases')
  const topBuyersData    = useAdminData(fetchTopBuyers,           token!, tab === 'reports')
  const topPropertiesData = useAdminData(fetchTopRankedProperties, token!, tab === 'reports')
  const topAgenciesData  = useAdminData(fetchTopAgenciesSales,    token!, tab === 'reports')

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const usersPagination     = usePagination(usersHook.list,    pageSize)
  const agenciesPagination  = usePagination(agenciesHook.list, pageSize)
  const favoritesPagination = usePagination(favorites.data,    pageSize)
  const purchasesPagination = usePagination(purchases.data,    pageSize)

  /* CRUD state for users */
  const [showUserForm,   setShowUserForm]   = useState(false)
  const [editingUser,    setEditingUser]    = useState<(UserInput & { id: number }) | null>(null)
  const [confirmDelUser, setConfirmDelUser] = useState<number | null>(null)

  /* CRUD state for agencies */
  const [showAgencyForm,   setShowAgencyForm]   = useState(false)
  const [editingAgency,    setEditingAgency]    = useState<(AgencyInput & { id: number }) | null>(null)
  const [confirmDelAgency, setConfirmDelAgency] = useState<number | null>(null)

  const currentLoading = {
    users:     usersHook.loading,
    agencies:  agenciesHook.loading,
    favorites: favorites.loading,
    purchases: purchases.loading,
    reports:   topBuyersData.loading,
  }[tab]

  const currentError = {
    users:     usersHook.error,
    agencies:  agenciesHook.error,
    favorites: favorites.error,
    purchases: purchases.error,
    reports:   topBuyersData.error,
  }[tab]

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
          <TabStatus loading={currentLoading} error={currentError} />

          {/* ── Users ── */}
          {tab === 'users' && !currentLoading && !currentError && (
            <>
              {!showUserForm && !editingUser && (
                <div style={{ marginBottom: 16 }}>
                  <button className="btn-primary" onClick={() => setShowUserForm(true)} data-testid="btn-new-user">
                    + New User
                  </button>
                </div>
              )}
              {(showUserForm || editingUser) && (
                <UserForm
                  key={editingUser?.id ?? 'new-user'}
                  initial={editingUser ?? undefined}
                  onSave={async (data) => {
                    if (editingUser) { await usersHook.update(editingUser.id, data); setEditingUser(null) }
                    else             { await usersHook.create(data); setShowUserForm(false) }
                  }}
                  onCancel={() => { setShowUserForm(false); setEditingUser(null) }}
                />
              )}
              <table className="admin-table" data-testid="users-table">
                <thead>
                  <tr><th>ID</th><th>Username</th><th>Email</th><th>Profile</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {usersPagination.pagedData.map((u) => (
                    <tr key={u.id} data-testid="user-row">
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td><span className={`admin-badge admin-badge--${u.profileType.toLowerCase()}`}>{u.profileType}</span></td>
                      <td>
                        {confirmDelUser === u.id ? (
                          <span className="admin-table-actions">
                            <button className="admin-table-btn admin-table-btn--danger" onClick={async () => { await usersHook.remove(u.id); setConfirmDelUser(null) }}>Confirm</button>
                            <button className="admin-table-btn" onClick={() => setConfirmDelUser(null)}>Cancel</button>
                          </span>
                        ) : (
                          <span className="admin-table-actions">
                            <button className="admin-table-btn" data-testid="btn-edit-user" onClick={() => { setEditingUser({ id: u.id, username: u.username, email: u.email, password: '', profileType: u.profileType }); setShowUserForm(false) }}>Edit</button>
                            <button className="admin-table-btn admin-table-btn--danger" data-testid="btn-delete-user" onClick={() => setConfirmDelUser(u.id)}>Delete</button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pager p={usersPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
          )}

          {/* ── Agencies ── */}
          {tab === 'agencies' && !currentLoading && !currentError && (
            <>
              {!showAgencyForm && !editingAgency && (
                <div style={{ marginBottom: 16 }}>
                  <button className="btn-primary" onClick={() => setShowAgencyForm(true)} data-testid="btn-new-agency">
                    + New Agency
                  </button>
                </div>
              )}
              {(showAgencyForm || editingAgency) && (
                <AgencyForm
                  key={editingAgency?.id ?? 'new-agency'}
                  initial={editingAgency ?? undefined}
                  onSave={async (data) => {
                    if (editingAgency) { await agenciesHook.update(editingAgency.id, data); setEditingAgency(null) }
                    else               { await agenciesHook.create(data); setShowAgencyForm(false) }
                  }}
                  onCancel={() => { setShowAgencyForm(false); setEditingAgency(null) }}
                />
              )}
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {agenciesPagination.pagedData.map((a) => (
                    <tr key={a.id} data-testid="agency-row">
                      <td>{a.id}</td>
                      <td>{a.username}</td>
                      <td>{a.email}</td>
                      <td>
                        {confirmDelAgency === a.id ? (
                          <span className="admin-table-actions">
                            <button className="admin-table-btn admin-table-btn--danger" onClick={async () => { await agenciesHook.remove(a.id); setConfirmDelAgency(null) }}>Confirm</button>
                            <button className="admin-table-btn" onClick={() => setConfirmDelAgency(null)}>Cancel</button>
                          </span>
                        ) : (
                          <span className="admin-table-actions">
                            <button className="admin-table-btn" data-testid="btn-edit-agency" onClick={() => { setEditingAgency({ id: a.id, username: a.username, email: a.email, password: '' }); setShowAgencyForm(false) }}>Edit</button>
                            <button className="admin-table-btn admin-table-btn--danger" data-testid="btn-delete-agency" onClick={() => setConfirmDelAgency(a.id)}>Delete</button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pager p={agenciesPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
          )}

          {/* ── Favorites ── */}
          {tab === 'favorites' && !currentLoading && !currentError && (
            <>
              {favoritesPagination.pagedData.length === 0
                ? <p className="admin-status">No favorites found.</p>
                : (
                  <table className="admin-table">
                    <thead><tr><th>ID</th><th>Property</th><th>Agency</th><th>Score</th><th>Comment</th><th>Date</th><th>Price</th></tr></thead>
                    <tbody>
                      {favoritesPagination.pagedData.map((f: Favorite) => (
                        <tr key={f.id}>
                          <td>{f.id}</td><td>{f.propertyAddress}</td><td>{f.agencyName}</td>
                          <td>{'★'.repeat(Math.min(f.score, 5))}{'☆'.repeat(Math.max(0, 5 - f.score))}</td>
                          <td>{f.comment || '-'}</td><td>{f.savedDate}</td><td>${f.savedPrice.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              <Pager p={favoritesPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
          )}

          {/* ── Purchases ── */}
          {tab === 'purchases' && !currentLoading && !currentError && (
            <>
              {purchasesPagination.pagedData.length === 0
                ? <p className="admin-status">No purchases found.</p>
                : (
                  <table className="admin-table">
                    <thead><tr><th>ID</th><th>Property</th><th>Agency</th><th>Price</th><th>Date</th></tr></thead>
                    <tbody>
                      {purchasesPagination.pagedData.map((p: Purchase) => (
                        <tr key={p.id}>
                          <td>{p.id}</td><td>{p.propertyAddress}</td><td>{p.agencyName}</td>
                          <td>${p.purchasePrice.toLocaleString()}</td><td>{p.purchaseDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              <Pager p={purchasesPagination} pageSize={pageSize} onPageSize={setPageSize} />
            </>
          )}

          {/* ── Reports ── */}
          {tab === 'reports' && !currentLoading && !currentError && (
            <div className="reports-grid" data-testid="reports-section">
              <ReportCard title="Top Buyers" rows={topBuyersData.data as TopBuyer[]} labelKey="username" valueKey="purchases" />
              <ReportCard title="Top Properties" rows={topPropertiesData.data as TopRankedProperty[]} labelKey="address" valueKey="averageScore" />
              <ReportCard title="Top Agencies" rows={topAgenciesData.data as TopAgencySales[]} labelKey="username" valueKey="sales" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Report card with bars ── */
function ReportCard<T extends Record<string, unknown>>({ title, rows, labelKey, valueKey }: {
  title: string
  rows: T[]
  labelKey: keyof T
  valueKey: keyof T
}) {
  const values = rows.map(r => Number(r[valueKey]))
  const max = Math.max(...values, 1)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bars = barRef.current?.querySelectorAll<HTMLElement>('.report-bar')
    bars?.forEach(bar => {
      const target = bar.dataset.width ?? '0'
      requestAnimationFrame(() => { bar.style.width = target })
    })
  }, [rows])

  const rankClass = (i: number) => i === 0 ? 'report-rank--1' : i === 1 ? 'report-rank--2' : i === 2 ? 'report-rank--3' : 'report-rank--n'
  const testIdMap: Record<string, string> = { 'Top Buyers': 'top-buyer-row', 'Top Properties': 'top-property-row', 'Top Agencies': 'top-agency-row' }

  return (
    <div className="report-card" ref={barRef}>
      <h3>{title}</h3>
      {rows.length === 0 && <p className="admin-status">No data.</p>}
      {rows.map((row, i) => (
        <div key={i} className="report-row" data-testid={testIdMap[title]}>
          <span className={`report-rank ${rankClass(i)}`}>{i + 1}</span>
          <span className="report-label" title={String(row[labelKey])}>{String(row[labelKey])}</span>
          <div className="report-bar-wrap">
            <div className="report-bar" data-width={`${(values[i] / max) * 100}%`} style={{ width: 0 }} />
          </div>
          <span className="report-value">{typeof row[valueKey] === 'number' ? (Number(row[valueKey]) % 1 !== 0 ? Number(row[valueKey]).toFixed(1) : row[valueKey]) : row[valueKey]}</span>
        </div>
      ))}
    </div>
  )
}
