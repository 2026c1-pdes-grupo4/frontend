import { useState } from 'react'
import { useAgencyProperties } from '../controllers/useAgencyProperties'
import { useAgencyPurchases } from '../controllers/useAgencyPurchases'
import { useAgencyClients } from '../controllers/useAgencyClients'
import AgencyPropertyCard from '../components/AgencyPropertyCard'
import PropertyForm from '../components/PropertyForm'
import type { AgencyProperty, PropertyInput } from '../models/types'
import './AgencyDashboardPage.css'

type Tab = 'properties' | 'sales' | 'clients'

function TabStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="loading">Loading...</p>
  if (error) return <p className="error">{error}</p>
  return null
}

export default function AgencyDashboardPage() {
  const [tab, setTab] = useState<Tab>('properties')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AgencyProperty | null>(null)

  const { list: properties, loading: propLoading, error: propError, add, edit, remove } = useAgencyProperties()
  const { list: purchases, loading: salesLoading, error: salesError } = useAgencyPurchases()
  const { list: clients, loading: clientsLoading, error: clientsError } = useAgencyClients()

  const handleSubmit = async (data: PropertyInput) => {
    if (editing) {
      await edit(editing, data)
    } else {
      await add(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (property: AgencyProperty) => {
    setEditing(property)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
  }

  const openNewForm = () => {
    setEditing(null)
    setShowForm(true)
  }

  return (
    <div className="agency-dashboard-wrapper">
    <div className="agency-dashboard">
      <h1>Agency Panel</h1>

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
          <TabStatus loading={propLoading} error={propError} />
          <div className="property-list" data-testid="property-list">
            {properties.map(p => (
              <AgencyPropertyCard key={p.id} property={p} onEdit={handleEdit} onDelete={remove} />
            ))}
          </div>
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
                <th>Agency</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(s => (
                <tr key={s.id} data-testid="sale-row">
                  <td>{s.id}</td>
                  <td>{s.propertyAddress}</td>
                  <td>{s.agencyName}</td>
                  <td>USD {s.purchasePrice.toLocaleString()}</td>
                  <td>{s.purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
              {clients.map(c => (
                <tr key={c.userId} data-testid="client-row">
                  <td>{c.userId}</td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
    </div>
  )
}
