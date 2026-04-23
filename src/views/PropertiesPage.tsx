import { useProperties } from '../controllers/useProperties'
import PropertyCard from '../components/PropertyCard'
import './PropertiesPage.css'

export default function PropertiesPage() {
  const { list, loading, error } = useProperties()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="properties-list">
      {list.map((p) => (
        <PropertyCard key={p.propertyId} property={p} />
      ))}
    </div>
  )
}
