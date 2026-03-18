'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader, Wand2, ChevronDown, ChevronUp } from 'lucide-react'

const MOOD_MAP = [
  { moods: ['sad', 'cry', 'emotional', 'grief', 'heartbreak'],           genre: 18    },
  { moods: ['happy', 'fun', 'laugh', 'comedy', 'cheer'],                 genre: 35    },
  { moods: ['horror', 'scared', 'dark', 'creepy', 'nightmare'],          genre: 27    },
  { moods: ['action', 'adventure', 'excited', 'fight', 'hero'],          genre: 28    },
  { moods: ['romantic', 'love', 'romance', 'date', 'sweet'],             genre: 10749 },
  { moods: ['sci-fi', 'space', 'future', 'robot', 'alien'],              genre: 878   },
  { moods: ['mystery', 'detective', 'crime', 'suspense', 'spy'],         genre: 9648  },
  { moods: ['fantasy', 'magic', 'dragon', 'wizard'],                     genre: 14    },
  { moods: ['animated', 'cartoon', 'kids', 'family'],                    genre: 16    },
  { moods: ['war', 'history', 'historical', 'epic', 'battle'],           genre: 10752 },
  { moods: ['chill', 'relax', 'easy', 'casual', 'light'],               genre: 35    },
  { moods: ['inspire', 'motivated', 'uplifting', 'dream', 'hope'],       genre: 18    },
  { moods: ['documentary', 'real', 'true story'],                        genre: 99    },
  { moods: ['music', 'musical', 'dance', 'singing'],                     genre: 10402 },
  { moods: ['thriller', 'suspense', 'mind', 'twist', 'psychological'],   genre: 53    },
]

const CHIPS = ['Sad', 'Action', 'Romantic', 'Horror', 'Comedy', 'Inspired', 'Chill', 'Mystery']

export default function MoodMatcher() {
  const [open,    setOpen]    = useState(false)
  const [mood,    setMood]    = useState('')
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const router                = useRouter()

  const handleMatch = () => {
    if (!mood.trim()) return
    setLoading(true)
    setResult(null)
    const lower = mood.toLowerCase()
    const match = MOOD_MAP.find(e => e.moods.some(m => lower.includes(m)))
    const genre = match?.genre || 28
    setTimeout(() => {
      setLoading(false)
      setResult(true)
      router.push(`/?genre=${genre}`)
    }, 600)
  }

  return (
    <div style={{ maxWidth: '620px', margin: '0 auto 0.5rem' }}>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          margin: '0 auto', background: 'none',
          border: '1px dashed rgba(76,201,240,0.4)',
          color: '#4cc9f0', padding: '0.5rem 1.2rem',
          borderRadius: '99px', fontSize: '0.82rem',
          fontFamily: 'var(--font-body)', fontWeight: '500',
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <Sparkles size={14} />
        Mood Matcher
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div style={{
          background: '#1a1a26', border: '1px solid rgba(76,201,240,0.2)',
          borderRadius: '12px', padding: '1.2rem', marginTop: '0.75rem',
        }}>
          {/* Label */}
          <p style={{
            fontSize: '0.72rem', textTransform: 'uppercase',
            letterSpacing: '2px', color: '#4cc9f0',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            marginBottom: '0.75rem',
          }}>
            <Wand2 size={12} />
            Describe your mood — we'll find the perfect film
          </p>

          {/* Mood chips */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {CHIPS.map(chip => (
              <button
                key={chip}
                onClick={() => setMood(chip.toLowerCase())}
                style={{
                  padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem',
                  background: mood === chip.toLowerCase() ? '#f5c518' : '#111119',
                  color:      mood === chip.toLowerCase() ? '#000'     : '#6b6b88',
                  border: `1px solid ${mood === chip.toLowerCase() ? '#f5c518' : '#232333'}`,
                  cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontWeight: mood === chip.toLowerCase() ? '700' : '400',
                  transition: 'all 0.15s',
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input + button row */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input
              value={mood}
              onChange={e => setMood(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMatch()}
              placeholder="e.g. sad, action, romantic, horror…"
              style={{
                flex: 1, padding: '0.7rem 1rem',
                background: '#111119', border: '1px solid #232333',
                borderRadius: '8px', color: '#f2f0ea',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                outline: 'none', transition: 'border-color 0.2s',
              }}
            />
            <button
              onClick={handleMatch}
              disabled={loading || !mood.trim()}
              style={{
                padding: '0.7rem 1.2rem',
                background: loading || !mood.trim() ? '#1a1a26' : '#4cc9f0',
                color: loading || !mood.trim() ? '#6b6b88' : '#000',
                border: `1px solid ${loading || !mood.trim() ? '#232333' : '#4cc9f0'}`,
                borderRadius: '8px', fontFamily: 'var(--font-body)',
                fontWeight: '700', fontSize: '0.85rem',
                cursor: loading || !mood.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              {loading
                ? <><Loader size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Finding…</>
                : <><Sparkles size={14} /> Match</>
              }
            </button>
          </div>

          {/* Result banner */}
          {result && (
            <div style={{
              marginTop: '0.75rem', padding: '0.7rem 1rem',
              background: 'rgba(76,201,240,0.08)',
              border: '1px solid rgba(76,201,240,0.25)',
              borderRadius: '8px', fontSize: '0.85rem',
              color: '#4cc9f0', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <Sparkles size={14} />
              Perfect match for your mood! Showing results below ✨
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}