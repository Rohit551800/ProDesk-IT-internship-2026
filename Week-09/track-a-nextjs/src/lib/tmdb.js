// ─── Used in SERVER COMPONENTS (uses TMDB_KEY, never exposed to browser) ──────
const BASE   = 'https://api.themoviedb.org/3'
const KEY    = process.env.TMDB_KEY || process.env.NEXT_PUBLIC_TMDB_KEY

export const IMG_BASE  = 'https://image.tmdb.org/t/p/w500'
export const IMG_LARGE = 'https://image.tmdb.org/t/p/original'

async function get(path, params = {}) {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  // Next.js 15 fetch — cache: 'no-store' = always fresh (SSR)
  // cache: 'force-cache' = static generation (SSG)
  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR: revalidate every 1 hour
  })

  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${path}`)
  return res.json()
}

export const tmdb = {
  popular:  (page = 1)          => get('/movie/popular',   { page }),
  search:   (query, page = 1)   => get('/search/movie',    { query, page }),
  byGenre:  (genreId, page = 1) => get('/discover/movie',  { with_genres: genreId, sort_by: 'popularity.desc', page }),
  genres:   ()                  => get('/genre/movie/list'),
  details:  (id)                => get(`/movie/${id}`),
  credits:  (id)                => get(`/movie/${id}/credits`),
  similar:  (id)                => get(`/movie/${id}/similar`),
}

export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
}
