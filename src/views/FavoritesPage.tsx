import { useState } from 'react'
import { useFavorites } from '../controllers/useFavorites'
import StarRating from '../components/StarRating'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const { list, loading, error, editFavorite, removeFavorite } = useFavorites()
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
      <ul className="fav-list">
        {list.map((f) => (
          <li key={f.id} className="fav-item">
            <div className="fav-item-header">
              <span className="fav-property-id">{f.propertyAddress} · {f.city}</span>
              <div className="fav-item-actions">
                <span className="fav-score">{'★'.repeat(f.score)}{'☆'.repeat(5 - f.score)}</span>
                <button
                  className="fav-action-btn"
                  onClick={() => openEdit(f.id, f.score, f.comment)}
                >
                  Edit
                </button>
                <button
                  className="fav-action-btn fav-action-btn--delete"
                  onClick={() => removeFavorite(f.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {editingId === f.id ? (
              <form className="fav-edit-form" onSubmit={(e) => handleEditSubmit(e, f.id)}>
                <label>
                  Score
                  <StarRating value={editScore} onChange={setEditScore} />
                </label>
                <label>
                  Comment
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={2}
                  />
                </label>
                <div className="fav-form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                {f.comment && <p className="fav-comment">{f.comment}</p>}
                <span className="fav-date">{f.savedDate} · ${f.savedPrice.toLocaleString()}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
