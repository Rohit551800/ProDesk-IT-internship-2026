'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getFavorites } from '@/lib/favorites'
import { Heart, Popcorn } from 'lucide-react'

function NavbarInner() {
  const pathname             = usePathname()
  const [mounted, setMounted]   = useState(false)
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    setMounted(true)
    const update = () => setFavCount(getFavorites().length)
    update()
    window.addEventListener('storage', update)
    window.addEventListener('favoritesChanged', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('favoritesChanged', update)
    }
  }, [])

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        CINE<span>.</span>STREAM
      </Link>
      <div className="navbar-nav">
        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
          <Popcorn size={15} /> Discover
        </Link>
        <Link href="/favorites" className={`nav-link ${pathname === '/favorites' ? 'active' : ''}`}>
          <Heart size={15} /> Favorites
          {mounted && favCount > 0 && (
            <span className="fav-badge">{favCount}</span>
          )}
        </Link>
      </div>
    </nav>
  )
}

// Wrap in Suspense so usePathname() never blocks rendering
import { Suspense } from 'react'

export default function Navbar() {
  return (
    <Suspense fallback={
      <nav className="navbar">
        <Link href="/" className="navbar-logo">
          CINE<span>.</span>STREAM
        </Link>
        <div className="navbar-nav">
          <Link href="/" className="nav-link"><Popcorn size={15} /> Discover</Link>
          <Link href="/favorites" className="nav-link"><Heart size={15} /> Favorites</Link>
        </div>
      </nav>
    }>
      <NavbarInner />
    </Suspense>
  )
}