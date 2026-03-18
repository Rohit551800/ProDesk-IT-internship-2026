'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [focused, setFocused] = useState(false)
  const router      = useRouter()
  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      router.push(`/?${params.toString()}`)
    }, 500)
    return () => clearTimeout(debounceRef.current)
  }, [query, router])

  return (
    <div style={{ position: 'relative', maxWidth: '620px', margin: '0 auto 1rem' }}>
      {/* Search icon */}
      <Search
        size={18}
        style={{
          position: 'absolute', left: '1.2rem',
          top: '50%', transform: 'translateY(-50%)',
          color: '#6b6b88', pointerEvents: 'none',
        }}
      />

      <input
        type="text"
        placeholder="Search movies, actors, directors…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Search movies"
        style={{
          width: '100%',
          padding: '1rem 3.5rem 1rem 3.2rem',
          background: '#1a1a26',
          border: `1px solid ${focused ? '#f5c518' : '#232333'}`,
          borderRadius: '12px',
          color: '#f2f0ea',
          fontFamily: 'var(--font-body)',
          fontSize: '1rem',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(245,197,24,0.08)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      />

      {/* Clear button */}
      {query && (
        <button
          onClick={() => { setQuery(''); router.push('/') }}
          aria-label="Clear search"
          style={{
            position: 'absolute', right: '1rem',
            top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none',
            color: '#6b6b88', cursor: 'pointer',
            padding: '4px', display: 'flex',
            transition: 'color 0.2s',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}