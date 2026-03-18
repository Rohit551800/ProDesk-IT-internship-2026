import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: {
    default: 'CineStream — Movie Explorer',
    template: '%s | CineStream',
  },
  description: 'Discover popular movies, search titles, and save your favourites. Powered by TMDB.',
  keywords: ['movies', 'films', 'TMDB', 'cinema', 'streaming'],
  openGraph: {
    title: 'CineStream — Movie Explorer',
    description: 'Discover and explore thousands of movies.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
