import { useEffect, useState } from 'react'
import { tmdb } from '../lib/tmdb'

const POPULAR_GENRES = [28, 12, 35, 18, 27, 878, 53, 10749, 16, 80]

export default function GenrePills({ selectedGenre, onSelect }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    tmdb.genres()
      .then((d) => setGenres(d.genres.filter((g) => POPULAR_GENRES.includes(g.id))))
      .catch(() => {})
  }, [])

  if (!genres.length) return null

  return (
    <div className="genre-strip">
      <button
        className={`genre-pill ${!selectedGenre ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {genres.map((g) => (
        <button
          key={g.id}
          className={`genre-pill ${selectedGenre === g.id ? 'active' : ''}`}
          onClick={() => onSelect(selectedGenre === g.id ? null : g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
