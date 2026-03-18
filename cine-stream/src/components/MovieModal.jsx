import { useEffect, useState } from 'react'
import { X, Star, Calendar, Clock, Heart, ExternalLink, Globe } from 'lucide-react'
import { tmdb, IMG_BASE, IMG_LARGE, GENRE_MAP } from '../lib/tmdb'

export default function MovieModal({ movie, isFav, onFavToggle, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch full movie details (runtime, tagline, homepage etc.)
  useEffect(() => {
    if (!movie) return
    setLoading(true)
    tmdb.details(movie.id)
      .then(setDetails)
      .catch(() => setDetails(null))
      .finally(() => setLoading(false))
  }, [movie?.id])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!movie) return null

  const data     = details || movie
  const poster   = data.poster_path   ? `${IMG_BASE}${data.poster_path}`   : null
  const backdrop = data.backdrop_path ? `${IMG_LARGE}${data.backdrop_path}` : null
  const year     = data.release_date?.slice(0, 4) || '—'
  const rating   = data.vote_average?.toFixed(1)
  const runtime  = details?.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null
  const genres   = details?.genres?.map(g => g.name) || (movie.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean)

  return (
    <>
      {/* Backdrop overlay */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Modal panel */}
      <div className="modal-panel">
        {/* Backdrop image at top */}
        {backdrop && (
          <div className="modal-backdrop">
            <img src={backdrop} alt="" loading="lazy" />
            <div className="modal-backdrop-gradient" />
          </div>
        )}

        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-body">
          {/* Left: poster */}
          <div className="modal-poster-wrap">
            {poster
              ? <img src={poster} alt={data.title} className="modal-poster" loading="lazy" />
              : <div className="modal-poster-placeholder">No Poster</div>
            }
          </div>

          {/* Right: info */}
          <div className="modal-info">
            {/* Tagline */}
            {details?.tagline && (
              <p className="modal-tagline">"{details.tagline}"</p>
            )}

            <h2 className="modal-title">{data.title}</h2>

            {/* Meta row */}
            <div className="modal-meta-row">
              {rating && rating !== '0.0' && (
                <span className="modal-meta-badge gold">
                  <Star size={12} fill="currentColor" /> {rating}
                  <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>/ 10</span>
                </span>
              )}
              {year && (
                <span className="modal-meta-badge">
                  <Calendar size={12} /> {year}
                </span>
              )}
              {runtime && (
                <span className="modal-meta-badge">
                  <Clock size={12} /> {runtime}
                </span>
              )}
              {details?.vote_count > 0 && (
                <span className="modal-meta-badge muted">
                  {details.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="modal-genres">
                {genres.map(g => (
                  <span key={g} className="modal-genre-pill">{g}</span>
                ))}
              </div>
            )}

            {/* Overview */}
            {data.overview && (
              <p className="modal-overview">{data.overview}</p>
            )}

            {/* Extra details from full fetch */}
            {details && (
              <div className="modal-extra">
                {details.production_countries?.length > 0 && (
                  <div className="modal-extra-row">
                    <Globe size={13} />
                    <span>{details.production_countries.map(c => c.name).join(', ')}</span>
                  </div>
                )}
                {details.status && (
                  <div className="modal-extra-row">
                    <span className="modal-extra-label">Status</span>
                    <span className={`modal-status-dot ${details.status === 'Released' ? 'green' : 'orange'}`}>
                      {details.status}
                    </span>
                  </div>
                )}
                {details.budget > 0 && (
                  <div className="modal-extra-row">
                    <span className="modal-extra-label">Budget</span>
                    <span>${(details.budget / 1_000_000).toFixed(1)}M</span>
                  </div>
                )}
                {details.revenue > 0 && (
                  <div className="modal-extra-row">
                    <span className="modal-extra-label">Revenue</span>
                    <span>${(details.revenue / 1_000_000).toFixed(1)}M</span>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="modal-actions">
              <button
                className={`modal-fav-btn ${isFav ? 'active' : ''}`}
                onClick={() => onFavToggle(movie)}
              >
                <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                {isFav ? 'Saved' : 'Save to Favorites'}
              </button>

              {details?.homepage && (
                <a
                  href={details.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link-btn"
                >
                  <ExternalLink size={14} />
                  Official Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(6px);
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        .modal-panel {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(860px, 95vw);
          max-height: 90vh;
          background: #111119;
          border: 1px solid #232333;
          border-radius: 16px;
          overflow: hidden;
          overflow-y: auto;
          z-index: 1001;
          animation: modalIn 0.35s cubic-bezier(0.16,1,0.3,1);
          scrollbar-width: thin;
          scrollbar-color: #f5c518 #111119;
        }
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { opacity: 0; transform: translate(-50%,-48%) scale(0.96) } to { opacity:1; transform: translate(-50%,-50%) scale(1) } }

        .modal-backdrop {
          position: relative; width: 100%; height: 220px; overflow: hidden;
        }
        .modal-backdrop img {
          width: 100%; height: 100%; object-fit: cover; display: block;
          filter: brightness(0.6);
        }
        .modal-backdrop-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 40%, #111119 100%);
        }
        .modal-close {
          position: absolute; top: 1rem; right: 1rem;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(9,9,15,0.8); backdrop-filter: blur(8px);
          border: 1px solid #232333; color: #f2f0ea;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 10;
          transition: background 0.2s, border-color 0.2s;
        }
        .modal-close:hover { background: rgba(230,57,70,0.2); border-color: #e63946; color: #e63946; }

        .modal-body {
          display: flex; gap: 2rem; padding: 1.5rem 2rem 2rem;
        }
        .modal-poster-wrap {
          flex-shrink: 0; width: 160px;
          border-radius: 10px; overflow: hidden;
          border: 1px solid #232333;
          box-shadow: 0 8px 40px rgba(0,0,0,0.5);
          margin-top: ${`-60px`};
          position: relative; z-index: 2;
          align-self: flex-start;
        }
        .modal-poster { width: 100%; display: block; }
        .modal-poster-placeholder {
          width: 100%; aspect-ratio: 2/3;
          background: #1a1a26; display: flex;
          align-items: center; justify-content: center;
          color: #6b6b88; font-size: 0.8rem;
        }
        .modal-info { flex: 1; min-width: 0; padding-top: 0.5rem; }

        .modal-tagline {
          font-size: 0.8rem; color: #f5c518; font-style: italic;
          margin-bottom: 0.5rem; opacity: 0.8;
        }
        .modal-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          letter-spacing: 2px; color: #f2f0ea;
          line-height: 1.1; margin-bottom: 1rem;
        }
        .modal-meta-row {
          display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
        }
        .modal-meta-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 0.3rem 0.75rem; border-radius: 99px;
          background: #1a1a26; border: 1px solid #232333;
          font-size: 0.78rem; color: #f2f0ea; font-weight: 500;
        }
        .modal-meta-badge.gold { color: #f5c518; border-color: rgba(245,197,24,0.3); background: rgba(245,197,24,0.08); }
        .modal-meta-badge.muted { color: #6b6b88; }

        .modal-genres {
          display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem;
        }
        .modal-genre-pill {
          padding: 0.25rem 0.75rem; border-radius: 4px;
          background: rgba(245,197,24,0.08); border: 1px solid rgba(245,197,24,0.2);
          color: rgba(245,197,24,0.85); font-size: 0.72rem; letter-spacing: 0.5px;
        }
        .modal-overview {
          font-size: 0.9rem; color: #9a9ab8; line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .modal-extra {
          display: flex; flex-direction: column; gap: 0.5rem;
          padding: 1rem; background: #0d0d15;
          border: 1px solid #232333; border-radius: 10px;
          margin-bottom: 1.5rem;
        }
        .modal-extra-row {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.82rem; color: #9a9ab8;
        }
        .modal-extra-label { color: #6b6b88; min-width: 60px; font-size: 0.75rem; }
        .modal-status-dot {
          padding: 2px 10px; border-radius: 99px; font-size: 0.72rem; font-weight: 600;
        }
        .modal-status-dot.green  { background: rgba(46,201,122,0.12); color: #2ec97a; border: 1px solid rgba(46,201,122,0.3); }
        .modal-status-dot.orange { background: rgba(244,162,97,0.12);  color: #f4a261; border: 1px solid rgba(244,162,97,0.3); }

        .modal-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .modal-fav-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 8px;
          border: 1px solid #232333; background: #1a1a26;
          color: #f2f0ea; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .modal-fav-btn:hover { border-color: #e63946; color: #e63946; background: rgba(230,57,70,0.08); }
        .modal-fav-btn.active { background: rgba(230,57,70,0.12); border-color: #e63946; color: #e63946; }
        .modal-link-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 8px;
          border: 1px solid rgba(76,201,240,0.3); background: rgba(76,201,240,0.06);
          color: #4cc9f0; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 600; cursor: pointer;
          text-decoration: none; transition: all 0.2s;
        }
        .modal-link-btn:hover { background: rgba(76,201,240,0.12); }

        @media (max-width: 600px) {
          .modal-body { flex-direction: column; padding: 1rem; }
          .modal-poster-wrap { width: 120px; margin-top: -40px; }
          .modal-backdrop { height: 160px; }
        }
      `}</style>
    </>
  )
}
