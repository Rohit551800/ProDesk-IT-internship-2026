import { useState, useEffect, useCallback, useRef } from 'react'
import { tmdb } from '../lib/tmdb'

/**
 * Central data hook.
 * Handles: popular / search / genre fetching + infinite scroll pagination.
 */
export function useMovies({ query, genreId }) {
  const [movies,  setMovies]  = useState([])
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [hasMore, setHasMore] = useState(true)

  // Track the current "session" to avoid race conditions
  const sessionRef = useRef(0)

  // Reset on query/genre change
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotal(0)
    setHasMore(true)
    setError(null)
  }, [query, genreId])

  // Fetch whenever page changes (after reset, page goes back to 1)
  useEffect(() => {
    const session = ++sessionRef.current
    let cancelled = false

    const fetchPage = async () => {
      setLoading(true)
      try {
        let data
        if (query)        data = await tmdb.search(query, page)
        else if (genreId) data = await tmdb.byGenre(genreId, page)
        else              data = await tmdb.popular(page)

        if (cancelled || session !== sessionRef.current) return

        setMovies((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        )
        setTotal(data.total_results || 0)
        setHasMore(page < data.total_pages)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPage()
    return () => { cancelled = true }
  }, [query, genreId, page])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) setPage((p) => p + 1)
  }, [loading, hasMore])

  return { movies, loading, error, hasMore, total, loadMore }
}
