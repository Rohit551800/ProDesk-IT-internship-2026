const KEY = 'cinestream_favorites'

export const getFavorites = () => {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export const toggleFavorite = (movie) => {
  const favs = getFavorites()
  const idx  = favs.findIndex((m) => m.id === movie.id)
  const next = idx === -1 ? [...favs, movie] : favs.filter((m) => m.id !== movie.id)
  localStorage.setItem(KEY, JSON.stringify(next))
  return { added: idx === -1, favorites: next }
}

export const isFavorite = (id) => getFavorites().some((m) => m.id === id)
export const clearFavorites = () => localStorage.removeItem(KEY)
