import { NavLink } from 'react-router-dom'
import { Clapperboard, Heart, Popcorn } from 'lucide-react'

export default function Navbar({ favCount }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        CINE<span>.</span>STREAM
      </NavLink>
      <div className="navbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Popcorn size={15} />
          Discover
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Heart size={15} />
          Favorites
          {favCount > 0 && <span className="fav-badge">{favCount}</span>}
        </NavLink>
      </div>
    </nav>
  )
}
