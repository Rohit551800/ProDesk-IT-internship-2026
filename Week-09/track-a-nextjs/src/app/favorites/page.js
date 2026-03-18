// Favorites page - uses client component for localStorage access
import FavoritesClient from '@/components/FavoritesClient'

export const metadata = {
  title: 'My Favorites',
  description: 'Your saved movies on CineStream.',
}

export default function FavoritesPage() {
  return <FavoritesClient />
}
