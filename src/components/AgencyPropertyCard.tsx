import type { AgencyProperty } from '../models/types'
import './AgencyPropertyCard.css'

interface Props {
  property: AgencyProperty
  onEdit: (property: AgencyProperty) => void
  onDelete: (id: number) => void
}

export default function AgencyPropertyCard({ property, onEdit, onDelete }: Props) {
  return (
    <div className="agency-property-card" data-testid="property-card">
      <div className="agency-card-info">
        <h3>{property.address}</h3>
        <p className="agency-card-location">{property.city}</p>
        <p className="agency-card-meta">{property.propertyType}</p>
        <p className="agency-card-price">USD {property.listedPrice.toLocaleString()}</p>
        <span className={`agency-card-status ${property.available ? 'available' : 'sold'}`}>
          {property.available ? 'Available' : 'Sold'}
        </span>
      </div>
      <div className="agency-card-actions">
        <button onClick={() => onEdit(property)} data-testid="btn-edit-property">Edit</button>
        <button className="btn-danger" onClick={() => onDelete(property.id)} data-testid="btn-delete-property">Delete</button>
      </div>
    </div>
  )
}
