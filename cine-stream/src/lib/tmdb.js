// ─── API Keys ─────────────────────────────────────────────────────────
export const TMDB_KEY   = import.meta.env.VITE_TMDB_KEY   || '212f36e7626d0bd606662022533bc28c'
export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || 'AIzaSyBSH8zxby3gCoJ_duoB8ByIvqkTMy4MDUg'

const BASE = 'https://api.themoviedb.org/3'
export const IMG_BASE  = 'https://image.tmdb.org/t/p/w500'
export const IMG_LARGE = 'https://image.tmdb.org/t/p/original'

const get = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('api_key', TMDB_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB ${res.status}`)
  return res.json()
}

export const tmdb = {
  popular:  (page = 1)          => get('/movie/popular',   { page }),
  search:   (query, page = 1)   => get('/search/movie',    { query, page }),
  byGenre:  (genreId, page = 1) => get('/discover/movie',  { with_genres: genreId, sort_by: 'popularity.desc', page }),
  genres:   ()                  => get('/genre/movie/list'),
  details:  (id)                => get(`/movie/${id}`),
}

// ─── Genre map for display ────────────────────────────────────────────
export const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western',
}
