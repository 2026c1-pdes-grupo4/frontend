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
    onFavorite?.(p.id, score, comment)
    setOpen(false)
  }

  const handleFavClick = () => {
    if (!onFavorite) return
    if (isFavorite) return
    setOpen(v => !v)
  }

  return (
    <div className="property-card">
      <div className="property-card__image">
        {p.imageUrl
          ? <img src={p.imageUrl} alt={p.address} />
          : <span>no image</span>}
      </div>
      <div className="property-card__body">

        <div className="property-card__row">
          <span className="property-card__address">{p.address}</span>
          <div className="property-card__meta">
            <span>{p.areaSq} m²</span>
            <span>{p.rooms} rooms</span>
            <span className="property-card__type">{p.propertyType}</span>
            {onFavorite && (
              <button
                className="property-card__fav-btn"
                onClick={handleFavClick}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? '★' : '☆'}
              </button>
            )}
          </div>
        </div>

        <div className="property-card__row">
          <span className="property-card__city">{p.city}, {p.province}</span>
          <span className="property-card__price">${p.price.toLocaleString()}</span>
        </div>

        <div className="property-card__row">
          <p className="property-card__description">{p.description}</p>
          <span className={`property-card__status${p.available ? '' : ' property-card__status--sold'}`}>
            {p.available ? 'Available' : 'Sold'}
          </span>
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
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} />
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
