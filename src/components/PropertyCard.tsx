import type { PropertyListing } from '../models/types'
import './PropertyCard.css'

interface Props {
  listing: PropertyListing
}

export default function PropertyCard({ listing }: Props) {
  const { property: p, listedPrice, pictures } = listing
  const firstPicture = pictures[0]?.url

  return (
    <div className="property-card">
      <div className="property-image">
        {firstPicture
          ? <img src={firstPicture} alt={p.address} />
          : 'no image'}
      </div>

      <div className="property-body">
        <div className="property-info">
          <h2>{p.address}</h2>
          <h3 className="location">{p.city}, {p.province}</h3>
          <p className="description">{p.description}</p>
          <div className="property-meta">
            <span>{p.areaSq} m²</span>
            <span>{p.rooms} rooms</span>
          </div>
        </div>

        <div className="property-price-box">
          <span className="type">{p.propertyType}</span>
          <span className="price">${listedPrice.toLocaleString()}</span>
          <span className={p.available ? 'availability' : 'availability unavailable'}>
            {p.available ? 'Available' : 'Sold'}
          </span>
        </div>
      </div>
    </div>
  )
}
