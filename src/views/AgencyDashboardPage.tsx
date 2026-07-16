import { useState } from 'react'
import { useAgencyProperties } from '../controllers/useAgencyProperties'
import { useAgencyPurchases } from '../controllers/useAgencyPurchases'
import { useAgencyClients } from '../controllers/useAgencyClients'
import AgencyPropertyCard from '../components/AgencyPropertyCard'
import PropertyForm from '../components/PropertyForm'
import { Pager } from '../components/Pager'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import ErrorBanner from '../components/ErrorBanner'
import type { AgencyProperty, PropertyInput, PropertySummary } from '../models/types'
import './AgencyDashboardPage.css'

type Tab = 'properties' | 'sales' | 'clients'

function TabStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="loading">Loading...</p>
  if (error) return <ErrorBanner message={error} />
  return null
}

export default function AgencyDashboardPage() {
  const [tab, setTab] = useState<Tab>('properties')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AgencyProperty | null>(null)
  const [duplicateMatch, setDuplicateMatch] = useState<{ found: PropertySummary; pendingPrice: number } | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { list: properties, loading: propLoading, error: propError, add, edit, remove, linkExisting, checkDuplicate } = useAgencyProperties()
  const { list: purchases, loading: salesLoading, error: salesError } = useAgencyPurchases()
  const { list: clients, loading: clientsLoading, error: clientsError } = useAgencyClients()

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const propertiesPagination = usePagination(properties, pageSize)
  const salesPagination = usePagination(purchases, pageSize)
  const clientsPagination = usePagination(clients, pageSize)

  const handleSubmit = async (data: PropertyInput) => {
    setFormError(null)
    try {
      if (editing) {
        await edit(editing, data)
        setShowForm(false)
        setEditing(null)
        return
      }

      const { circumscription, section, block, parcel } = data
      if (circumscription && section && block && parcel) {
        const found = await checkDuplicate({ circumscription, section, block, parcel })
        if (found) {
          setDuplicateMatch({ found, pendingPrice: data.price })
          return
        }
      }

      await add(data)
      setShowForm(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unexpected error.')
    }
  }

  const handleConfirmListExisting = async () => {
    if (!duplicateMatch) return
    setFormError(null)
    try {
      await linkExisting(duplicateMatch.found.id, duplicateMatch.pendingPrice)
      setDuplicateMatch(null)
      setShowForm(false)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Unexpected error.')
    }
  }

  const handleCancelListExisting = () => {
    setDuplicateMatch(null)
  }

  const handleEdit = (property: AgencyProperty) => {
    setEditing(property)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormError(null)
  }

  const openNewForm = () => {
    setEditing(null)
    setShowForm(true)
    setFormError(null)
  }

  return (
    <div className="agency-dashboard-wrapper">
    <div className="agency-dashboard">
      <nav className="agency-tabs" data-testid="agency-tabs">
        <button
          className={tab === 'properties' ? 'active' : ''}
          onClick={() => setTab('properties')}
          data-testid="tab-properties"
        >
          Properties
        </button>
        <button
          className={tab === 'sales' ? 'active' : ''}
          onClick={() => setTab('sales')}
          data-testid="tab-sales"
        >
          Sales
        </button>
        <button
          className={tab === 'clients' ? 'active' : ''}
          onClick={() => setTab('clients')}
          data-testid="tab-clients"
        >
          Clients
        </button>
      </nav>

      {tab === 'properties' && (
        <section className="tab-section">
          {!showForm && (
            <button className="btn-primary" onClick={openNewForm} data-testid="btn-new-property">
              + New property
            </button>
          )}
          {showForm && (
            <PropertyForm
              key={editing?.id ?? 'new'}
              initial={editing ? {
                propertyType: editing.propertyType,
                price: editing.listedPrice,
                address: editing.address,
                city: editing.city,
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
          {formError && <ErrorBanner message={formError} />}
          {duplicateMatch && (
            <div className="duplicate-confirm-dialog" data-testid="duplicate-confirm-dialog">
              <p>A property already exists: <strong>{duplicateMatch.found.address}</strong> ({duplicateMatch.found.city}).</p>
              <p>List it under your agency instead?</p>
              <div className="form-actions">
                <button data-testid="btn-confirm-list-existing" onClick={handleConfirmListExisting}>
                  List existing property
                </button>
                <button data-testid="btn-cancel-list-existing" onClick={handleCancelListExisting}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          <TabStatus loading={propLoading} error={propError} />
          <div className="property-list" data-testid="property-list">
            {propertiesPagination.pagedData.map(p => (
              <AgencyPropertyCard key={p.id} property={p} onEdit={handleEdit} onDelete={remove} />
            ))}
          </div>
          <Pager p={propertiesPagination} pageSize={pageSize} onPageSize={setPageSize} />
        </section>
      )}

      {tab === 'sales' && (
        <section className="tab-section">
          <h2>Sales</h2>
          <TabStatus loading={salesLoading} error={salesError} />
          <table className="data-table" data-testid="sales-list">
            <thead>
              <tr>
                <th>#</th>
                <th>Property</th>
                <th>Buyer</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesPagination.pagedData.map(s => (
                <tr key={s.id} data-testid="sale-row">
                  <td>{s.id}</td>
                  <td>{s.propertyAddress}</td>
                  <td>{s.buyerUsername}</td>
                  <td>USD {s.purchasePrice.toLocaleString()}</td>
                  <td>{s.purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pager p={salesPagination} pageSize={pageSize} onPageSize={setPageSize} />
        </section>
      )}

      {tab === 'clients' && (
        <section className="tab-section">
          <h2>Clients</h2>
          <TabStatus loading={clientsLoading} error={clientsError} />
          <table className="data-table" data-testid="clients-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {clientsPagination.pagedData.map(c => (
                <tr key={c.userId} data-testid="client-row">
                  <td>{c.userId}</td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pager p={clientsPagination} pageSize={pageSize} onPageSize={setPageSize} />
        </section>
      )}
    </div>
    </div>
  )
}
