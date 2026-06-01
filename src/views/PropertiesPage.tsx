import { useState } from 'react'
import { useProperties } from '../controllers/useProperties'
import { useFavorites } from '../controllers/useFavorites'
import PropertyCard from '../components/PropertyCard'
import type { PropertyFilter, PropertyType } from '../models/types'
import './PropertiesPage.css'

const PROPERTY_TYPES: PropertyType[] = ['house', 'apartment']

export default function PropertiesPage() {
  const [filter, setFilter] = useState<PropertyFilter>({})
  const { list, loading, error } = useProperties(filter)
  const { addFavorite, isFavorite } = useFavorites()

  const set = (field: keyof PropertyFilter, value: string | number) =>
    setFilter((prev) => ({ ...prev, [field]: value === '' ? undefined : value }))

  return (
    <div className="properties-list-wrapper">
      <div className="properties-filter">
        <input
          className="filter-input"
          type="text"
          placeholder="City"
          value={filter.city ?? ''}
          onChange={(e) => set('city', e.target.value)}
        />
        <input
          className="filter-input"
          type="text"
          placeholder="Province"
          value={filter.province ?? ''}
          onChange={(e) => set('province', e.target.value)}
        />
        <select
          className="filter-input"
          value={filter.propertyType ?? ''}
          onChange={(e) => set('propertyType', e.target.value)}
        >
          <option value="">All types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          className="filter-input filter-input--short"
          type="number"
          placeholder="Min price"
          min={0}
          value={filter.minPrice ?? ''}
          onChange={(e) => set('minPrice', e.target.value === '' ? '' : Number(e.target.value))}
        />
        <input
          className="filter-input filter-input--short"
          type="number"
          placeholder="Max price"
          min={0}
          value={filter.maxPrice ?? ''}
          onChange={(e) => set('maxPrice', e.target.value === '' ? '' : Number(e.target.value))}
        />
        <input
          className="filter-input filter-input--short"
          type="number"
          placeholder="Min rooms"
          min={1}
          value={filter.minRooms ?? ''}
          onChange={(e) => set('minRooms', e.target.value === '' ? '' : Number(e.target.value))}
        />
        <button className="filter-clear" onClick={() => setFilter({})}>Clear</button>
      </div>

      {loading && <p className="properties-status">Loading...</p>}
      {error && <p className="properties-status">Error: {error}</p>}
      {!loading && !error && list.length === 0 && (
        <p className="properties-status">No properties found.</p>
      )}

      <div className="properties-list">
        {list.map((p) => (
          <PropertyCard
            key={p.propertyId}
            property={p}
            onFavorite={addFavorite}
            isFavorite={isFavorite(p.propertyId)}
          />
        ))}
      </div>
    </div>
  )
}
