import { useState } from 'react'
import type { Property } from '../models/types'
import StarRating from './StarRating'
import './PropertyCard.css'

interface Props {
  property: Property
  onFavorite?: (propertyId: number, score: number, comment: string) => void
  isFavorite?: boolean
  onBuy?: (agencyPropertyId: number) => Promise<void>
}

function badgeClass(type: string) {
  if (type === 'house' || type === 'HOUSE') return 'property-card__badge--house'
  if (type === 'apartment' || type === 'APARTMENT') return 'property-card__badge--apartment'
  return 'property-card__badge--other'
}

export default function PropertyCard({ property: p, onFavorite, isFavorite, onBuy }: Props) {
  const [open, setOpen] = useState(false)
  const [score, setScore] = useState(3)
  const [comment, setComment] = useState('')
  const [confirmBuy, setConfirmBuy] = useState(false)
  const [purchased, setPurchased] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFavorite?.(p.id, score, comment)
    setOpen(false)
  }

  const handleFavClick = () => {
    if (!onFavorite || isFavorite) return
    setOpen(v => !v)
  }

  const handleConfirmBuy = async () => {
    if (!onBuy || !p.agencyPropertyId) return
    try {
      await onBuy(p.agencyPropertyId)
      setPurchased(true)
    } finally {
      setConfirmBuy(false)
    }
  }

  return (
    <div className="property-card animate-in">
      <div className="property-card__image">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.address} />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        )}
      </div>

      <div className="property-card__body">
        <div className="property-card__row">
          <span className="property-card__address">{p.address}</span>
          <div className="property-card__meta">
            <span>{p.areaSq} m²</span>
            <span>{p.rooms} rooms</span>
            <span className={`property-card__badge ${badgeClass(p.propertyType)}`}>
              {p.propertyType}
            </span>
          </div>
        </div>

        <div className="property-card__row">
          <span className="property-card__city">{p.city}, {p.province}</span>
          <span className="property-card__price">${p.price.toLocaleString()}</span>
        </div>

        {p.description && (
          <p className="property-card__description">{p.description}</p>
        )}
      </div>

      <div className="property-card__actions">
        {onFavorite && (
          <button
            className={`property-card__fav-btn${isFavorite ? ' property-card__fav-btn--active' : ''}`}
            onClick={handleFavClick}
            aria-label={isFavorite ? 'Already in favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '♥' : '♡'} {isFavorite ? 'Saved' : 'Save'}
          </button>
        )}
        {onBuy && p.available && !purchased && (
          <button
            className="property-card__buy-btn"
            data-testid="btn-buy-property"
            onClick={() => setConfirmBuy(true)}
          >
            Buy
          </button>
        )}
        {purchased && (
          <span className="property-card__buy-btn property-card__buy-btn--purchased" data-testid="purchase-success-message">
            ✓ Purchased
          </span>
        )}
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
          <div className="fav-form__actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      )}

      {confirmBuy && (
        <div className="buy-dialog-backdrop" data-testid="buy-confirm-dialog" role="dialog" aria-modal="true">
          <div className="buy-dialog">
            <h3>Confirm Purchase</h3>
            <p>{p.address} · ${p.price.toLocaleString()}</p>
            <div className="buy-dialog__actions">
              <button className="btn-primary" data-testid="btn-confirm-purchase" onClick={handleConfirmBuy}>
                Confirm
              </button>
              <button className="btn-ghost" onClick={() => setConfirmBuy(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
