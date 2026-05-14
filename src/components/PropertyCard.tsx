import { useState } from 'react'
import type { Property } from '../models/types'
import StarRating from './StarRating'
import './PropertyCard.css'

interface Props {
  property: Property
  onFavorite?: (propertyId: number, score: number, comment: string) => void
  isFavorite?: boolean
}

export default function PropertyCard({ property: p, onFavorite, isFavorite }: Props) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(3)
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFavorite?.(p.propertyId, score, comment)
    setOpen(false)
  }

  return (
    <div className="property-card">
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
          {onFavorite && (
            <button
              className={`fav-btn${isFavorite ? ' fav-btn--saved' : ''}`}
              onClick={() => !isFavorite && setOpen((v) => !v)}
              disabled={isFavorite}
            >
              {isFavorite ? '★ Saved' : '☆ Favorite'}
            </button>
          )}
        </div>
      </div>

      {open && (
        <form className="fav-form" onSubmit={handleSubmit}>
          <label>
            Score
            <StarRating value={score} onChange={setScore} />
          </label>
          <label>
            Comment
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
          </label>
          <div className="fav-form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  )
}
