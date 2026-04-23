import { useProperties } from '../controllers/useProperties'
import './PropertiesPage.css'

export default function PropertiesPage() {
  const { list, loading, error } = useProperties()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="properties-list">
      {list.map((p) => (
        <div key={p.propertyId} className="property-card">
          <div className="property-image">no image</div>

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
              <span className="price">${p.price.toLocaleString()}</span>
              <span className={p.available ? 'availability' : 'availability unavailable'}>
                {p.available ? 'Available' : 'Sold'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
