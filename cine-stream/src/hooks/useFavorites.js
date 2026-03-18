import { useState, useCallback } from 'react'
import { getFavorites, toggleFavorite, isFavorite, clearFavorites } from '../lib/favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(getFavorites)

  const toggle = useCallback((movie) => {
    const { favorites: next } = toggleFavorite(movie)
    setFavorites(next)
    return next.some((m) => m.id === movie.id)
  }, [])

  const clear = useCallback(() => {
    clearFavorites()
    setFavorites([])
  }, [])

  const check = useCallback((id) => isFavorite(id), [])

  return { favorites, toggle, clear, check }
}
