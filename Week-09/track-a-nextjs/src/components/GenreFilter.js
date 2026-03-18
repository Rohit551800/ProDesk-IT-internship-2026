'use client'

import { useRouter } from 'next/navigation'

// ✅ CLIENT COMPONENT — needs useRouter for navigation on genre click

export default function GenreFilter({ genres, activeGenre }) {
  const router = useRouter()
  const SHOW   = [28, 12, 35, 18, 27, 878, 53, 10749, 16, 80]
  const list   = genres.filter(g => SHOW.includes(g.id))

  const select = (id) => {
    if (String(id) === String(activeGenre)) {
      router.push('/')
    } else {
      router.push(`/?genre=${id}`)
    }
  }

  return (
    <div className="genre-strip">
      <button className={`genre-pill ${!activeGenre ? 'active' : ''}`} onClick={() => router.push('/')}>All</button>
      {list.map(g => (
        <button
          key={g.id}
          className={`genre-pill ${String(g.id) === String(activeGenre) ? 'active' : ''}`}
          onClick={() => select(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
