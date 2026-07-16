import { useState } from 'react'
import './StarRating.css'

interface Props {
  value: number
  onChange: (value: number) => void
}

export default function StarRating({ value, onChange }: Props) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'star--filled' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          data-testid={`star-${star}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}
