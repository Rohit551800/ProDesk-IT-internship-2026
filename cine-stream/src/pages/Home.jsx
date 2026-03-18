import { useState, useCallback } from 'react'
import { Search, X, Film, TrendingUp } from 'lucide-react'
import { useDebounce }       from '../hooks/useDebounce'
import { useMovies }         from '../hooks/useMovies'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import MovieCard             from '../components/MovieCard'
import SkeletonGrid          from '../components/SkeletonGrid'
import MoodMatcher           from '../components/MoodMatcher'
import GenrePills            from '../components/GenrePills'

export default function Home({ favs, onFavToggle, onCardClick, showToast }) {
  const [query,        setQuery]        = useState('')
  const [selectedGenre, setGenre]       = useState(null)
  const [highlighted,  setHighlighted]  = useState(null)  // from mood matcher

  // Debounce the search query — waits 500ms after user stops typing
  const debouncedQuery = useDebounce(query, 500)

  // When genre changes, clear search
  const handleGenre = useCallback((id) => {
    setGenre(id)
    setQuery('')
  }, [])

  // When search changes, clear genre
  const handleSearch = useCallback((val) => {
    setQuery(val)
    setGenre(null)
  }, [])

  const { movies, loading, error, hasMore, total, loadMore } = useMovies({
    query:   debouncedQuery,
    genreId: selectedGenre,
  })

  const sentinelRef = useInfiniteScroll({ onLoadMore: loadMore, hasMore, loading })

  // Mood matcher result — highlight matched movie
  const handleMoodResult = useCallback((movie) => {
    setHighlighted(movie.id)
    setQuery('')       // show popular results (movie will appear via re-fetch or in current list)
    setTimeout(() => setHighlighted(null), 6000)
  }, [])

  const isSearching = debouncedQuery.trim().length > 0

  const sectionTitle = isSearching
    ? `Results for "${debouncedQuery}"`
    : selectedGenre
    ? 'Genre Picks'
    : 'Popular Right Now'

  return (
    <>
      {/* ── HERO ──────────────────────────────────────── */}
      <section className="hero">
        <p className="hero-eyebrow">🎬 Discover · Explore · Stream</p>
        <h1 className="hero-title">
          FIND YOUR<br /><span>NEXT WATCH</span>
        </h1>

        {/* Search bar */}
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="Search movies, actors, directors…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search movies"
          />
          {query && (
            <button className="search-clear" onClick={() => handleSearch('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>

        {/* AI Mood Matcher */}
        <MoodMatcher onResult={handleMoodResult} />
      </section>

      {/* ── GENRE PILLS ───────────────────────────────── */}
      {!isSearching && (
        <GenrePills selectedGenre={selectedGenre} onSelect={handleGenre} />
      )}

      {/* ── SECTION HEADER ────────────────────────────── */}
      <div className="section-header">
        <h2 className="section-title">
          {isSearching ? <Search size={20} strokeWidth={1.5} /> : <TrendingUp size={20} strokeWidth={1.5} />}
          {' '}{sectionTitle}
        </h2>
        {total > 0 && (
          <span className="section-count">{total.toLocaleString()} titles</span>
        )}
      </div>

      {/* ── INITIAL SKELETON ──────────────────────────── */}
      {loading && movies.length === 0 && <SkeletonGrid count={16} />}

      {/* ── ERROR ─────────────────────────────────────── */}
      {error && (
        <div className="empty-state">
          <Film size={56} className="empty-icon" />
          <p className="empty-title">API Error</p>
          <p className="empty-subtitle">
            {error.includes('401') || error.includes('7')
              ? 'Invalid TMDB API key. Add your key to src/lib/tmdb.js'
              : error}
          </p>
        </div>
      )}

      {/* ── MOVIE GRID ────────────────────────────────── */}
      {movies.length > 0 && (
        <div className="movie-grid">
          {movies.map((movie, i) => (
            <MovieCard
              key={`${movie.id}-${i}`}
              movie={movie}
              isFav={favs.check(movie.id)}
              onCardClick={onCardClick}
              onFavToggle={(m) => {
                const added = favs.toggle(m)
                showToast(
                  added ? `Added "${m.title}" to favorites` : `Removed "${m.title}"`,
                  added ? '❤️' : '🗑'
                )
              }}
              style={{
                // Highlight mood-matched movie with a golden glow
                ...(highlighted === movie.id ? {
                  borderColor: 'var(--gold)',
                  boxShadow: '0 0 0 2px var(--gold), 0 0 60px rgba(245,197,24,0.25)',
                  animation: 'cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
                } : {
                  animationDelay: `${(i % 20) * 30}ms`,
                }),
              }}
            />
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ───────────────────────────────── */}
      {!loading && !error && movies.length === 0 && (
        <div className="empty-state">
          <Film size={56} className="empty-icon" />
          <p className="empty-title">No Results</p>
          <p className="empty-subtitle">
            Try a different search term or browse by genre.
          </p>
        </div>
      )}

      {/* ── LOAD MORE SPINNER (pagination) ────────────── */}
      {loading && movies.length > 0 && (
        <div className="loader-wrap">
          <div className="spinner" />
        </div>
      )}

      {/* ── INFINITE SCROLL SENTINEL ──────────────────── */}
      <div ref={sentinelRef} className="scroll-sentinel" />
    </>
  )
}
