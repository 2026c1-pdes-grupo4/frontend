import type { AgencyProperty } from '../models/types'
import './PropertyCard.css'
import './AgencyPropertyCard.css'

interface Props {
  property: AgencyProperty
  onEdit: (property: AgencyProperty) => void
  onDelete: (id: number) => void
}

export default function AgencyPropertyCard({ property: p, onEdit, onDelete }: Props) {
  return (
    <div className="property-card" data-testid="property-card">
      <div className="property-card__image">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.address} />
          : <span>no image</span>}
      </div>

      <div className="property-card__body">
        <div className="property-card__row">
          <span className="property-card__address">{p.address}</span>
          <span className="property-card__type">{p.propertyType}</span>
        </div>

        <div className="property-card__row">
          <span className="property-card__city">{p.city}</span>
          <span className="property-card__price">USD {p.listedPrice.toLocaleString()}</span>
        </div>

        <div className="property-card__row">
          <span className="agency-card__date">Listed {p.listedDate}</span>
          <span className={`property-card__status${p.available ? '' : ' property-card__status--sold'}`}>
            {p.available ? 'Available' : 'Sold'}
          </span>
        </div>
      </div>

      <div className="agency-card-actions">
        <button onClick={() => onEdit(p)} data-testid="btn-edit-property">Edit</button>
        <button className="btn-danger" onClick={() => onDelete(p.id)} data-testid="btn-delete-property">Delete</button>
      </div>
    </div>
  )
}
