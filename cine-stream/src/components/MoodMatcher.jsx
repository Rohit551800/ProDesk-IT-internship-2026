import { useState } from 'react'
import { Sparkles, Loader, Wand2, ChevronDown, ChevronUp } from 'lucide-react'
import { tmdb } from '../lib/tmdb'

// ── Mood → Genre/Keyword mapping (no external API needed) ─────────
const MOOD_MAP = [
  { moods: ['sad', 'cry', 'emotional', 'depressed', 'heartbreak', 'grief'],         genres: [18, 10749],  query: 'emotional drama'            },
  { moods: ['happy', 'fun', 'laugh', 'cheer', 'joyful', 'comedy'],                  genres: [35],         query: 'feel good comedy'           },
  { moods: ['scared', 'horror', 'thrill', 'nightmare', 'dark', 'creepy'],           genres: [27, 53],     query: 'horror thriller'            },
  { moods: ['action', 'adventure', 'excited', 'adrenaline', 'fight', 'hero'],       genres: [28, 12],     query: 'action adventure'           },
  { moods: ['romantic', 'love', 'date', 'romance', 'sweet', 'crush'],               genres: [10749, 35],  query: 'romantic movie'             },
  { moods: ['sci-fi', 'space', 'future', 'robot', 'alien', 'science'],              genres: [878, 12],    query: 'science fiction space'      },
  { moods: ['mystery', 'detective', 'crime', 'suspense', 'whodunit', 'spy'],        genres: [9648, 80],   query: 'mystery thriller crime'     },
  { moods: ['fantasy', 'magic', 'dragon', 'wizard', 'fairy', 'mythical'],           genres: [14, 12],     query: 'fantasy adventure magic'    },
  { moods: ['animated', 'cartoon', 'kids', 'family', 'disney', 'pixar'],            genres: [16, 10751],  query: 'animation family'           },
  { moods: ['war', 'history', 'historical', 'soldier', 'battle', 'epic'],           genres: [10752, 36],  query: 'war historical epic'        },
  { moods: ['mind', 'twist', 'complex', 'intelligent', 'psychological', 'deep'],    genres: [9648, 878],  query: 'mind bending psychological' },
  { moods: ['chill', 'relax', 'light', 'easy', 'casual', 'simple'],                genres: [35, 10751],  query: 'lighthearted feel good'     },
  { moods: ['inspire', 'motivated', 'uplifting', 'success', 'dream', 'hope'],       genres: [18, 36],     query: 'inspirational motivational' },
  { moods: ['bored', 'boring', 'entertain', 'something good', 'anything'],          genres: [28, 12, 35], query: 'popular blockbuster'        },
  { moods: ['anime', 'japanese', 'manga'],                                           genres: [16],         query: 'anime movie'                },
  { moods: ['documentary', 'real', 'true story', 'based on', 'reality'],            genres: [99],         query: 'documentary true story'     },
  { moods: ['music', 'musical', 'singing', 'dance', 'concert'],                     genres: [10402],      query: 'musical movie'              },
]

const getMoodConfig = (text) => {
  const lower = text.toLowerCase()
  for (const entry of MOOD_MAP) {
    if (entry.moods.some((m) => lower.includes(m))) return entry
  }
  return null
}

const MOOD_CHIPS = ['sad', 'action', 'romantic', 'horror', 'comedy', 'inspired', 'chill', 'mystery']

export default function MoodMatcher({ onResult }) {
  const [open,    setOpen]    = useState(false)
  const [mood,    setMood]    = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  const handleMatch = async () => {
    if (!mood.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const config = getMoodConfig(mood)
      let movie = null

      if (config) {
        const page = Math.floor(Math.random() * 5) + 1
        const genreData = await tmdb.byGenre(config.genres[0], page)
        const picks = genreData.results?.filter(m => m.vote_average >= 6.5 && m.poster_path)
        movie = picks?.[Math.floor(Math.random() * Math.min(picks.length, 8))]
      }

      if (!movie) {
        const cleaned = mood.replace(/i (am|feel|want|need|m|feeling)/gi, '').trim()
        const searchData = await tmdb.search(cleaned, 1)
        movie = searchData.results?.find(m => m.poster_path) || searchData.results?.[0]
      }

      if (!movie) throw new Error('No movies found for that mood. Try different keywords!')

      setResult({ aiTitle: movie.title, movie })
      onResult(movie)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleMatch() }

  return (
    <div className="mood-section">
      <button className="mood-toggle-btn" onClick={() => setOpen((o) => !o)}>
        <Sparkles size={14} />
        Mood Matcher
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div className="mood-box">
          <p className="mood-label">
            <Wand2 size={12} />
            Describe your mood — we'll find the perfect film
          </p>

          {/* Quick-select mood chips */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {MOOD_CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setMood(chip)}
                style={{
                  padding: '3px 10px', borderRadius: '99px', fontSize: '0.72rem',
                  background: mood === chip ? 'var(--gold)' : 'var(--bg2)',
                  color: mood === chip ? '#000' : 'var(--muted)',
                  border: `1px solid ${mood === chip ? 'var(--gold)' : 'var(--border)'}`,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s', fontWeight: mood === chip ? '700' : '400',
                  textTransform: 'capitalize',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mood-row">
            <input
              className="mood-input"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. sad, action, romantic, horror…"
            />
            <button
              className="mood-btn"
              onClick={handleMatch}
              disabled={loading || !mood.trim()}
            >
              {loading
                ? <><Loader size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Searching…</>
                : <><Sparkles size={14} /> Match</>
              }
            </button>
          </div>

          {result && (
            <div className="mood-result-banner">
              <Sparkles size={14} />
              <span>
                Perfect match for your mood: <strong>"{result.aiTitle}"</strong> — scroll down to see it! ✨
              </span>
            </div>
          )}

          {error && (
            <div className="mood-result-banner" style={{
              borderColor: 'rgba(230,57,70,0.3)',
              color: 'var(--red)',
              background: 'rgba(230,57,70,0.06)'
            }}>
              ⚠ {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}