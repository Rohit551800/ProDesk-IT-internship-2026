import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar              from './components/Navbar'
import MovieModal          from './components/MovieModal'
import { Toast, useToast } from './components/Toast'
import { useFavorites }    from './hooks/useFavorites'
import Home                from './pages/Home'
import Favorites           from './pages/Favorites'

export default function App() {
  const favs                   = useFavorites()
  const { toast, show: showToast } = useToast()
  const [selectedMovie, setSelectedMovie] = useState(null)

  const handleCardClick = (movie) => setSelectedMovie(movie)
  const handleClose     = ()      => setSelectedMovie(null)

  const handleFavToggle = (movie) => {
    const added = favs.toggle(movie)
    showToast(
      added ? `Added "${movie.title}" to favorites` : `Removed "${movie.title}"`,
      added ? '❤️' : '🗑'
    )
  }

  return (
    <>
      <Navbar favCount={favs.favorites.length} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              favs={favs}
              onFavToggle={handleFavToggle}
              onCardClick={handleCardClick}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              favs={favs}
              onFavToggle={handleFavToggle}
              onCardClick={handleCardClick}
              showToast={showToast}
            />
          }
        />
      </Routes>

      {/* Movie detail modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isFav={favs.check(selectedMovie.id)}
          onFavToggle={(m) => {
            handleFavToggle(m)
          }}
          onClose={handleClose}
        />
      )}

      <Toast toast={toast} />
    </>
  )
}
