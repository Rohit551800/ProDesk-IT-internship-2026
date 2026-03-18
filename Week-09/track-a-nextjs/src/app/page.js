// ✅ SERVER COMPONENT — no "use client" directive
// Data is fetched on the SERVER before sending HTML to the browser
// This is the core Next.js 15 / SSR concept

import { tmdb } from '@/lib/tmdb'
import MovieGrid   from '@/components/MovieGrid'
import SearchBar   from '@/components/SearchBar'
import GenreFilter from '@/components/GenreFilter'
import MoodMatcher from '@/components/MoodMatcher'
import { TrendingUp } from 'lucide-react'

export const revalidate = 3600

export default async function HomePage({ searchParams }) {
  // ── Next.js 15 FIX: searchParams is now a Promise — must await it ──
  const params  = await searchParams
  const query   = params?.q     || ''
  const genreId = params?.genre || ''
  const page    = Number(params?.page) || 1

  // ── FETCH ON SERVER (no useEffect, no loading spinner for initial data) ──
  let movies = []
  let total  = 0

  try {
    let data
    if (query)        data = await tmdb.search(query, page)
    else if (genreId) data = await tmdb.byGenre(Number(genreId), page)
    else              data = await tmdb.popular(page)

    movies = data.results || []
    total  = data.total_results || 0
  } catch {
    // graceful fallback
  }

  const genres = await tmdb.genres().then(d => d.genres).catch(() => [])

  const sectionTitle = query   ? `Results for "${query}"`
                     : genreId ? 'Genre Picks'
                     :           'Popular Right Now'

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">🎬 Discover · Explore · Stream</p>
        <h1 className="hero-title">
          FIND YOUR<br /><span>NEXT WATCH</span>
        </h1>
        <SearchBar initialQuery={query} />
        <MoodMatcher />
      </section>

      <GenreFilter genres={genres} activeGenre={genreId} />

      <div className="section-header">
        <h2 className="section-title">
          <TrendingUp size={20} strokeWidth={1.5} />
          {' '}{sectionTitle}
        </h2>
        {total > 0 && (
          <span className="section-count">{total.toLocaleString()} titles</span>
        )}
        <span className="ssr-badge">⚡ Server Rendered</span>
      </div>

      <MovieGrid movies={movies} />

      {/* Pagination */}
      {total > 20 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem 0 3rem' }}>
          {page > 1 && (
            <a
              href={`/?${new URLSearchParams({ ...(query && { q: query }), ...(genreId && { genre: genreId }), page: page - 1 })}`}
              className="action-btn outline"
            >
              ← Prev
            </a>
          )}
          <span style={{ display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: '0.85rem' }}>
            Page {page}
          </span>
          {movies.length === 20 && (
            <a
              href={`/?${new URLSearchParams({ ...(query && { q: query }), ...(genreId && { genre: genreId }), page: page + 1 })}`}
              className="action-btn outline"
            >
              Next →
            </a>
          )}
        </div>
      )}
    </>
  )
}