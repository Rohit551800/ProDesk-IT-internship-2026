import { Heart, Trash2, Film } from 'lucide-react'
import MovieCard from '../components/MovieCard'

export default function Favorites({ favs, onFavToggle, onCardClick, showToast }) {
  const { favorites, clear, check } = favs

  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">❤ Your Collection</p>
        <h1 className="page-title">MY FAVORITES</h1>
        <p className="page-subtitle">
          {favorites.length === 0
            ? 'Heart a movie to save it here for later.'
            : `${favorites.length} film${favorites.length !== 1 ? 's' : ''} saved to your collection.`}
        </p>
        {favorites.length > 0 && (
          <button
            className="clear-fav-btn"
            onClick={() => {
              clear()
              showToast('Favorites cleared', '🗑')
            }}
          >
            <Trash2 size={13} />
            Clear all
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={56} className="empty-icon" />
          <p className="empty-title">Nothing Here Yet</p>
          <p className="empty-subtitle">
            Go to Discover and tap the heart on any movie to save it.
          </p>
        </div>
      ) : (
        <>
          <div className="section-header">
            <h2 className="section-title">
              <Heart size={18} strokeWidth={1.5} /> Saved Films
            </h2>
            <span className="section-count">{favorites.length} saved</span>
          </div>

          <div className="movie-grid">
            {favorites.map((movie, i) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFav={check(movie.id)}
                onCardClick={onCardClick}
              onFavToggle={(m) => {
                  const added = favs.toggle(m)
                  showToast(
                    added ? `Added "${m.title}"` : `Removed "${m.title}"`,
                    added ? '❤️' : '🗑'
                  )
                }}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}
