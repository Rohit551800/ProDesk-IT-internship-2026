// ✅ SERVER COMPONENT — dynamic route /movie/[id]
// generateMetadata fetches movie data on server to set SEO title/description

import { tmdb, IMG_BASE, IMG_LARGE } from '@/lib/tmdb'
import Link      from 'next/link'
import FavButton from '@/components/FavButton'
import { Star, Clock, Calendar, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

// ── LEVEL 3: generateMetadata — dynamic SEO per movie ─────────────
export async function generateMetadata({ params }) {
  // Next.js 15 FIX: params is a Promise — must await
  const { id } = await params
  try {
    const movie  = await tmdb.details(id)
    const year   = movie.release_date?.slice(0, 4)
    const rating = movie.vote_average?.toFixed(1)
    return {
      title: `${movie.title}${year ? ` (${year})` : ''}`,
      description: movie.overview
        ? movie.overview.slice(0, 155) + '…'
        : `Watch ${movie.title} on CineStream.`,
      openGraph: {
        title: `${movie.title} | CineStream`,
        description: movie.overview?.slice(0, 155),
        images: movie.backdrop_path ? [`${IMG_LARGE}${movie.backdrop_path}`] : [],
        type: 'website',
      },
    }
  } catch {
    return { title: 'Movie Not Found' }
  }
}

export default async function MovieDetailPage({ params }) {
  // Next.js 15 FIX: params is a Promise — must await
  const { id } = await params

  let movie, credits
  try {
    [movie, credits] = await Promise.all([
      tmdb.details(id),
      tmdb.credits(id),
    ])
  } catch {
    notFound()
  }

  const year     = movie.release_date?.slice(0, 4)
  const rating   = movie.vote_average?.toFixed(1)
  const runtime  = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const poster   = movie.poster_path   ? `${IMG_BASE}${movie.poster_path}`   : null
  const backdrop = movie.backdrop_path ? `${IMG_LARGE}${movie.backdrop_path}` : null
  const cast     = credits?.cast?.slice(0, 10) || []
  const director = credits?.crew?.find(c => c.job === 'Director')

  return (
    <>
      <Link href="/" className="back-btn">
        <ArrowLeft size={15} /> Back to Discover
      </Link>

      {/* HERO with backdrop */}
      <div className="movie-detail-hero">
        {backdrop && (
          <div className="movie-detail-backdrop">
            <img src={backdrop} alt="" />
            <div className="movie-detail-backdrop-grad" />
          </div>
        )}

        <div className="movie-detail-content">
          {poster && (
            <div className="movie-detail-poster">
              <img src={poster} alt={movie.title} />
            </div>
          )}

          <div className="movie-detail-info">
            <span className="ssr-badge" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
              ⚡ Server Rendered — SEO Ready
            </span>

            {movie.tagline && (
              <p className="movie-detail-tagline">"{movie.tagline}"</p>
            )}
            <h1 className="movie-detail-title">{movie.title}</h1>

            <div className="movie-detail-meta">
              {rating && rating !== '0.0' && (
                <span className="meta-badge gold">
                  <Star size={12} fill="currentColor" /> {rating} / 10
                </span>
              )}
              {year && (
                <span className="meta-badge">
                  <Calendar size={12} /> {year}
                </span>
              )}
              {runtime && (
                <span className="meta-badge">
                  <Clock size={12} /> {runtime}
                </span>
              )}
              {movie.vote_count > 0 && (
                <span className="meta-badge" style={{ color: 'var(--muted)' }}>
                  {movie.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>

            {movie.genres?.length > 0 && (
              <div className="movie-detail-genres">
                {movie.genres.map(g => (
                  <span key={g.id} className="detail-genre-pill">{g.name}</span>
                ))}
              </div>
            )}

            <FavButton movie={movie} />
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="movie-detail-body">
        <div>
          {movie.overview && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="movie-overview-title">Overview</h2>
              <p className="movie-overview-text">{movie.overview}</p>
            </div>
          )}

          {cast.length > 0 && (
            <div>
              <h2 className="movie-overview-title" style={{ marginBottom: '1rem' }}>Cast</h2>
              <div className="cast-grid">
                {cast.map(person => (
                  <div key={person.id} className="cast-card">
                    <img
                      src={person.profile_path
                        ? `${IMG_BASE}${person.profile_path}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1a1a26&color=6b6b88&size=80`
                      }
                      alt={person.name}
                      className="cast-photo"
                      loading="lazy"
                    />
                    <p className="cast-name">{person.name}</p>
                    <p className="cast-role">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="movie-detail-sidebar">
          <div className="sidebar-card">
            <p className="sidebar-card-title">Details</p>
            {director && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Director</span>
                <span className="sidebar-row-value">{director.name}</span>
              </div>
            )}
            {movie.status && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Status</span>
                <span className="sidebar-row-value">{movie.status}</span>
              </div>
            )}
            {movie.original_language && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Language</span>
                <span className="sidebar-row-value">{movie.original_language.toUpperCase()}</span>
              </div>
            )}
            {movie.budget > 0 && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Budget</span>
                <span className="sidebar-row-value">${(movie.budget / 1_000_000).toFixed(1)}M</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Revenue</span>
                <span className="sidebar-row-value">${(movie.revenue / 1_000_000).toFixed(1)}M</span>
              </div>
            )}
            {movie.production_countries?.length > 0 && (
              <div className="sidebar-row">
                <span className="sidebar-row-label">Country</span>
                <span className="sidebar-row-value">{movie.production_countries[0].name}</span>
              </div>
            )}
          </div>

          {/* SEO metadata preview card */}
          <div className="sidebar-card">
            <p className="sidebar-card-title">SEO Metadata (generateMetadata)</p>
            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
              <div style={{ color: 'var(--green)' }}>{'<title>'}</div>
              <div style={{ paddingLeft: '0.75rem', color: 'var(--white)' }}>
                {movie.title} ({year}) | CineStream
              </div>
              <div style={{ color: 'var(--green)' }}>{'</title>'}</div>
              <br />
              <div style={{ color: 'var(--gold)' }}>{'<meta name="description"'}</div>
              <div style={{ paddingLeft: '0.75rem', color: 'var(--blue)', wordBreak: 'break-word' }}>
                content="{movie.overview?.slice(0, 80)}…"
              </div>
              <div style={{ color: 'var(--gold)' }}>{'/>'}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}