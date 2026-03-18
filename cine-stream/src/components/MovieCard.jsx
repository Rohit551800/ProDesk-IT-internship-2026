import { Heart, Star, Film } from 'lucide-react'
import { IMG_BASE, GENRE_MAP } from '../lib/tmdb'

export default function MovieCard({ movie, isFav, onFavToggle, onCardClick, style }) {
  const year   = movie.release_date?.slice(0, 4) || '—'
  const rating = movie.vote_average?.toFixed(1)
  const poster = movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : null
  const genres = (movie.genre_ids || []).slice(0, 2).map((id) => GENRE_MAP[id]).filter(Boolean)

  const handleFav = (e) => {
    e.stopPropagation()
    onFavToggle(movie)
  }

  return (
    <div className="movie-card" style={style} onClick={() => onCardClick(movie)}>
      {/* Poster */}
      <div className="movie-poster-wrap">
        {poster ? (
          <img
            className="movie-poster"
            src={poster}
            alt={movie.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="poster-placeholder">
            <Film size={32} strokeWidth={1} />
            <span>{movie.title}</span>
          </div>
        )}

        {/* Rating badge */}
        {rating && rating !== '0.0' && (
          <div className="rating-badge">
            <Star size={9} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Fav button */}
        <button
          className={`fav-btn ${isFav ? 'active' : ''}`}
          onClick={handleFav}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={14} strokeWidth={2} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Hover overlay */}
        <div className="poster-overlay">
          {movie.overview && (
            <p className="overlay-overview">{movie.overview}</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="movie-info">
        <p className="movie-title" title={movie.title}>{movie.title}</p>
        <div className="movie-meta">
          <span className="movie-year">{year}</span>
        </div>
        {genres.length > 0 && (
          <div className="genre-tags">
            {genres.map((g) => (
              <span key={g} className="genre-tag">{g}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
