import type { Property } from '../models/types'
import './AgencyPropertyCard.css'

interface Props {
  property: Property
  onEdit: (property: Property) => void
  onDelete: (id: number) => void
}

export default function AgencyPropertyCard({ property, onEdit, onDelete }: Props) {
  return (
    <div className="agency-property-card" data-testid="property-card">
      <div className="agency-card-info">
        <h3>{property.address}</h3>
        <p className="agency-card-location">{property.city}, {property.province}</p>
        <p className="agency-card-meta">
          {property.propertyType} · {property.areaSq} m² · {property.rooms} amb.
        </p>
        <p className="agency-card-price">USD {property.price.toLocaleString()}</p>
        <span className={`agency-card-status ${property.available ? 'available' : 'sold'}`}>
          {property.available ? 'Disponible' : 'Vendido'}
        </span>
      </div>
      <div className="agency-card-actions">
        <button onClick={() => onEdit(property)} data-testid="btn-edit-property">Editar</button>
        <button className="btn-danger" onClick={() => onDelete(property.propertyId)} data-testid="btn-delete-property">Eliminar</button>
      </div>
    </div>
  )
}
