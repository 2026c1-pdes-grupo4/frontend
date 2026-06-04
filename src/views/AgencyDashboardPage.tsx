import { useState } from 'react'
import { useAgencyProperties } from '../controllers/useAgencyProperties'
import { useAgencyPurchases } from '../controllers/useAgencyPurchases'
import { useAgencyClients } from '../controllers/useAgencyClients'
import AgencyPropertyCard from '../components/AgencyPropertyCard'
import PropertyForm from '../components/PropertyForm'
import type { AgencyProperty, PropertyInput } from '../models/types'
import './AgencyDashboardPage.css'

type Tab = 'properties' | 'sales' | 'clients'

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
    <div className="agency-dashboard">
      <h1>Panel de Agencia</h1>

      <nav className="agency-tabs" data-testid="agency-tabs">
        <button
          className={tab === 'properties' ? 'active' : ''}
          onClick={() => setTab('properties')}
          data-testid="tab-properties"
        >
          Propiedades
        </button>
        <button
          className={tab === 'sales' ? 'active' : ''}
          onClick={() => setTab('sales')}
          data-testid="tab-sales"
        >
          Ventas
        </button>
        <button
          className={tab === 'clients' ? 'active' : ''}
          onClick={() => setTab('clients')}
          data-testid="tab-clients"
        >
          Clientes
        </button>
      </nav>

      {tab === 'properties' && (
        <section className="tab-section">
          {!showForm && (
            <button className="btn-primary" onClick={openNewForm} data-testid="btn-new-property">
              + Nueva propiedad
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
          {propLoading && <p className="loading">Cargando...</p>}
          {propError && <p className="error">{propError}</p>}
          <div className="property-list" data-testid="property-list">
            {properties.map(p => (
              <AgencyPropertyCard key={p.id} property={p} onEdit={handleEdit} onDelete={remove} />
            ))}
          </div>
        </section>
      )}

      {tab === 'sales' && (
        <section className="tab-section">
          <h2>Ventas</h2>
          {salesLoading && <p className="loading">Cargando...</p>}
          {salesError && <p className="error">{salesError}</p>}
          <table className="data-table" data-testid="sales-list">
            <thead>
              <tr>
                <th>#</th>
                <th>Propiedad</th>
                <th>Agencia</th>
                <th>Precio</th>
                <th>Fecha</th>
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
          <h2>Clientes</h2>
          {clientsLoading && <p className="loading">Cargando...</p>}
          {clientsError && <p className="error">{clientsError}</p>}
          <table className="data-table" data-testid="clients-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
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
  )
}
