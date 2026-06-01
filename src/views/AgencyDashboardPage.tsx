import { useState } from 'react'
import { useAgencyProperties } from '../controllers/useAgencyProperties'
import { useAgencyPurchases } from '../controllers/useAgencyPurchases'
import { useAgencyClients } from '../controllers/useAgencyClients'
import AgencyPropertyCard from '../components/AgencyPropertyCard'
import PropertyForm from '../components/PropertyForm'
import type { Property } from '../models/types'
import './AgencyDashboardPage.css'

type Tab = 'properties' | 'sales' | 'clients'
type PropertyInput = Omit<Property, 'propertyId' | 'available' | 'agencyId'>

export default function AgencyDashboardPage() {
  const [tab, setTab] = useState<Tab>('properties')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)

  const { list: properties, loading: propLoading, error: propError, add, edit, remove } = useAgencyProperties()
  const { list: purchases, loading: salesLoading, error: salesError } = useAgencyPurchases()
  const { list: clients, loading: clientsLoading, error: clientsError } = useAgencyClients()

  const handleSubmit = async (data: PropertyInput) => {
    if (editing) {
      await edit(editing.propertyId, data)
    } else {
      await add(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  const handleEdit = (property: Property) => {
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
              key={editing?.propertyId ?? 'new'}
              initial={editing ? {
                propertyType: editing.propertyType,
                price: editing.price,
                address: editing.address,
                city: editing.city,
                province: editing.province,
                areaSq: editing.areaSq,
                rooms: editing.rooms,
                description: editing.description,
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
          {propLoading && <p className="loading">Cargando...</p>}
          {propError && <p className="error">{propError}</p>}
          <div className="property-list" data-testid="property-list">
            {properties.map(p => (
              <AgencyPropertyCard key={p.propertyId} property={p} onEdit={handleEdit} onDelete={remove} />
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
                <th>Comprador</th>
                <th>Precio</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(s => {
                const prop = properties.find(p => p.propertyId === s.propertyId)
                return (
                  <tr key={s.purchaseId} data-testid="sale-row">
                    <td>{s.purchaseId}</td>
                    <td>{prop?.address ?? `Propiedad #${s.propertyId}`}</td>
                    <td>{s.userId}</td>
                    <td>USD {s.purchasePrice.toLocaleString()}</td>
                    <td>{s.purchaseDate}</td>
                  </tr>
                )
              })}
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
