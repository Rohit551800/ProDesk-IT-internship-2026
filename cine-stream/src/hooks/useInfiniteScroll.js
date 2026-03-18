import { useEffect, useRef, useCallback } from 'react'

/**
 * Calls `onLoadMore` when the sentinel element enters the viewport.
 * Returns a ref to attach to your sentinel div.
 */
export function useInfiniteScroll({ onLoadMore, hasMore, loading }) {
  const sentinelRef = useRef(null)

  const handleIntersect = useCallback(
    (entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        onLoadMore()
      }
    },
    [onLoadMore, hasMore, loading]
  )

  useEffect(() => {
    const el  = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(handleIntersect, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [handleIntersect])

  return sentinelRef
}
