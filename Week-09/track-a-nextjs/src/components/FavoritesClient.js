'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Star, Film } from 'lucide-react'
import { IMG_BASE, GENRE_MAP } from '@/lib/tmdb'
import { toggleFavorite, isFavorite } from '@/lib/favorites'

function MovieCard({ movie }) {
  const [mounted, setMounted] = useState(false)
  const [fav,     setFav]     = useState(false)

  useEffect(() => {
    setMounted(true)
    setFav(isFavorite(movie.id))
  }, [movie.id])

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { added } = toggleFavorite(movie)
    setFav(added)
    window.dispatchEvent(new Event('favoritesChanged'))
  }

  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null
  const year   = movie.release_date?.slice(0, 4) || '—'
  const rating = movie.vote_average?.toFixed(1)
  const genres = (movie.genre_ids || []).slice(0, 2).map(id => GENRE_MAP[id]).filter(Boolean)

  return (
    <Link href={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster-wrap">
        {poster
          ? <img className="movie-poster" src={poster} alt={movie.title} loading="lazy" decoding="async" />
          : <div className="poster-placeholder"><Film size={28} strokeWidth={1} /><span>{movie.title}</span></div>
        }
        {rating && rating !== '0.0' && (
          <div className="rating-badge"><Star size={9} fill="currentColor" />{rating}</div>
        )}
        {/* Only render fav button after mount — avoids server/client mismatch */}
        {mounted && (
          <button
            className={`fav-btn ${fav ? 'active' : ''}`}
            onClick={handleFav}
            aria-label="Toggle favorite"
          >
            <Heart size={14} strokeWidth={2} fill={fav ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
      <div className="movie-info">
        <p className="movie-title" title={movie.title}>{movie.title}</p>
        <p className="movie-meta">{year}</p>
        {genres.length > 0 && (
          <div className="genre-tags">
            {genres.map(g => <span key={g} className="genre-tag">{g}</span>)}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <Film size={56} className="empty-icon" />
        <p className="empty-title">No Results</p>
        <p className="empty-subtitle">Try a different search or genre.</p>
      </div>
    )
  }

  return (
    <div className="movie-grid">
      {movies.map((movie, i) => (
        <div key={movie.id} style={{ animationDelay: `${(i % 20) * 30}ms` }}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  )
}