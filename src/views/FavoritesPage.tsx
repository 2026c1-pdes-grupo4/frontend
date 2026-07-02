import { useState } from 'react'
import { useFavorites } from '../controllers/useFavorites'
import StarRating from '../components/StarRating'
import { Pager } from '../components/Pager'
import { usePagination, DEFAULT_PAGE_SIZE } from '../hooks/usePagination'
import '../components/PropertyCard.css'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const { list, loading, error, editFavorite, removeFavorite } = useFavorites()
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const pagination = usePagination(list, pageSize)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editScore, setEditScore] = useState(1)
  const [editComment, setEditComment] = useState('')

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (list.length === 0) return <p className="fav-empty">No favorites yet.</p>

  const openEdit = (favoriteId: number, score: number, comment: string) => {
    setEditingId(favoriteId)
    setEditScore(score)
    setEditComment(comment)
  }

  const handleEditSubmit = async (e: React.FormEvent, favoriteId: number) => {
    e.preventDefault()
    await editFavorite(favoriteId, editScore, editComment)
    setEditingId(null)
  }

  return (
    <div className="fav-page">
      <h2>My Favorites</h2>
      <div className="fav-list">
        {pagination.pagedData.map((f) => (
          <div key={f.id} className="property-card">
            <div className="property-card__body">
              <div className="property-card__row">
                <span className="property-card__address">{f.propertyAddress}</span>
                <div className="property-card__meta">
                  <span>{'★'.repeat(Math.min(f.score, 5))}{'☆'.repeat(Math.max(0, 5 - f.score))}</span>
                </div>
              </div>

              <div className="property-card__row">
                <span className="property-card__city">{f.city} · {f.agencyName}</span>
                <span className="property-card__price">${f.savedPrice.toLocaleString()}</span>
              </div>

              <div className="property-card__row">
                <span className="fav-comment">{f.comment || <em>No comment</em>}</span>
                <span className="fav-date">{f.savedDate}</span>
              </div>
            </div>

            <div className="fav-actions">
              <button className="fav-action-btn" onClick={() => openEdit(f.id, f.score, f.comment)}>Edit</button>
              <button className="fav-action-btn fav-action-btn--delete" onClick={() => removeFavorite(f.id)}>Delete</button>
            </div>

            {editingId === f.id && (
              <form className="fav-edit-form" onSubmit={(e) => handleEditSubmit(e, f.id)}>
                <label>
                  Score
                  <StarRating value={editScore} onChange={setEditScore} />
                </label>
                <label>
                  Comment
                  <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} rows={2} />
                </label>
                <div className="fav-form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
      <Pager p={pagination} pageSize={pageSize} onPageSize={setPageSize} />
    </div>
  )
}
