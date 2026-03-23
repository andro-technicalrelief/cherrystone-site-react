import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './EasterOverlay.css'

/* ---- SVG Egg Generator (narrow top, wide bottom) ---- */
const EGG_STYLES = [
  { base: '#FF6B6B', pattern: '#FF4757', stripe: '#C44040', name: 'red' },
  { base: '#48DBFB', pattern: '#0ABDE3', stripe: '#2E86C5', name: 'blue' },
  { base: '#FECA57', pattern: '#FF9F43', stripe: '#E17C2A', name: 'gold' },
  { base: '#55E6C1', pattern: '#26D8A4', stripe: '#1B9B77', name: 'mint' },
  { base: '#C471ED', pattern: '#A55EEA', stripe: '#7B45B5', name: 'purple' },
  { base: '#FF9FF3', pattern: '#F368E0', stripe: '#C44DB7', name: 'pink' },
  { base: '#FFA502', pattern: '#E68A00', stripe: '#B36A00', name: 'orange' },
  { base: '#7BED9F', pattern: '#2ED573', stripe: '#1B9B54', name: 'green' },
]

const PATTERN_TYPES = ['chevrons', 'diamonds', 'hexgrid', 'triangles', 'crosshatch', 'circles']

function makeEggSVG(style, patternType) {
  const { base, pattern, stripe } = style
  let patternSVG = ''

  switch (patternType) {
    case 'chevrons':
      patternSVG = `
        <polyline points="10,14 20,10 30,14" fill="none" stroke="${stripe}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <polyline points="8,22 20,18 32,22" fill="none" stroke="${pattern}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
        <polyline points="10,30 20,26 30,30" fill="none" stroke="${stripe}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      `
      break
    case 'diamonds':
      patternSVG = `
        <polygon points="20,10 26,16 20,22 14,16" fill="none" stroke="${stripe}" stroke-width="1.5" opacity="0.7"/>
        <polygon points="12,22 16,26 12,30 8,26" fill="none" stroke="${pattern}" stroke-width="1.5" opacity="0.5"/>
        <polygon points="28,22 32,26 28,30 24,26" fill="none" stroke="${pattern}" stroke-width="1.5" opacity="0.5"/>
        <polygon points="20,28 24,32 20,36 16,32" fill="none" stroke="${stripe}" stroke-width="1.5" opacity="0.6"/>
      `
      break
    case 'hexgrid':
      patternSVG = `
        <polygon points="16,12 22,12 25,17 22,22 16,22 13,17" fill="none" stroke="${stripe}" stroke-width="1.2" opacity="0.6"/>
        <polygon points="22,22 28,22 31,27 28,32 22,32 19,27" fill="none" stroke="${pattern}" stroke-width="1.2" opacity="0.5"/>
        <polygon points="10,22 16,22 19,27 16,32 10,32 7,27" fill="none" stroke="${stripe}" stroke-width="1.2" opacity="0.5"/>
      `
      break
    case 'triangles':
      patternSVG = `
        <polygon points="14,12 20,6 26,12" fill="${stripe}" opacity="0.3"/>
        <polygon points="8,22 14,16 20,22" fill="${pattern}" opacity="0.25"/>
        <polygon points="20,22 26,16 32,22" fill="${stripe}" opacity="0.25"/>
        <polygon points="14,32 20,26 26,32" fill="${pattern}" opacity="0.3"/>
      `
      break
    case 'crosshatch':
      patternSVG = `
        <line x1="8" y1="12" x2="32" y2="12" stroke="${stripe}" stroke-width="1.5" opacity="0.5"/>
        <line x1="6" y1="20" x2="34" y2="20" stroke="${pattern}" stroke-width="1.5" opacity="0.4"/>
        <line x1="6" y1="28" x2="34" y2="28" stroke="${stripe}" stroke-width="1.5" opacity="0.5"/>
        <line x1="14" y1="6" x2="14" y2="40" stroke="${pattern}" stroke-width="1" opacity="0.3"/>
        <line x1="26" y1="6" x2="26" y2="40" stroke="${pattern}" stroke-width="1" opacity="0.3"/>
      `
      break
    case 'circles':
      patternSVG = `
        <circle cx="20" cy="14" r="4" fill="none" stroke="${stripe}" stroke-width="1.5" opacity="0.6"/>
        <circle cx="12" cy="24" r="3" fill="none" stroke="${pattern}" stroke-width="1.5" opacity="0.5"/>
        <circle cx="28" cy="24" r="3" fill="none" stroke="${pattern}" stroke-width="1.5" opacity="0.5"/>
        <circle cx="20" cy="33" r="3.5" fill="none" stroke="${stripe}" stroke-width="1.5" opacity="0.5"/>
      `
      break
  }

  // Egg shape: narrow top, wide bottom (egg-like path)
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="${base}" />
        <stop offset="100%" stop-color="${pattern}" />
      </linearGradient>
      <clipPath id="eggClip">
        <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z"/>
      </clipPath>
    </defs>
    <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z" fill="url(#g)"/>
    <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <g clip-path="url(#eggClip)">
      <ellipse cx="15" cy="12" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20 15 12)"/>
      ${patternSVG}
    </g>
  </svg>`)}`
}

function randomEgg() {
  const style = EGG_STYLES[Math.floor(Math.random() * EGG_STYLES.length)]
  const patternType = PATTERN_TYPES[Math.floor(Math.random() * PATTERN_TYPES.length)]
  return { svg: makeEggSVG(style, patternType), name: `${style.name}-${patternType}`, rotten: false }
}

function makeRottenEgg() {
  const svg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
    <defs>
      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#6B7B3A" />
        <stop offset="100%" stop-color="#4A3B2A" />
      </linearGradient>
      <clipPath id="rotClip">
        <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z"/>
      </clipPath>
    </defs>
    <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z" fill="url(#rg)"/>
    <path d="M20 2 C 10 2, 2 18, 2 28 C 2 38, 10 46, 20 46 C 30 46, 38 38, 38 28 C 38 18, 30 2, 20 2 Z" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1"/>
    <g clip-path="url(#rotClip)">
      <path d="M12 14 L16 20 L14 26" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M24 10 L26 18 L22 20" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M18 30 L22 34" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="1" stroke-linecap="round"/>
      <ellipse cx="16" cy="20" rx="4" ry="3" fill="rgba(80,90,40,0.3)" transform="rotate(-10 16 20)"/>
    </g>
  </svg>`)}`
  return { svg, name: 'rotten', rotten: true }
}

const CONFETTI_COLORS = ['#FFB7C5', '#FFD700', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB', '#FF9AA2', '#F0E68C']
const CELEBRATION_EMOJIS = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🥳', '💛']

export default function EasterOverlay() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [eggCount, setEggCount] = useState(0)
  const [showMilestone, setShowMilestone] = useState(false)
  const [rabbits, setRabbits] = useState([])
  const [eggs, setEggs] = useState([])
  const [celebrations, setCelebrations] = useState([])
  const [rings, setRings] = useState([])
  const [basketBounce, setBasketBounce] = useState(false)
  const [basketShake, setBasketShake] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState(false)
  const [basketPos, setBasketPos] = useState({ x: 20, y: null })
  const [isDragging, setIsDragging] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [giftEmail, setGiftEmail] = useState('')
  const gameOverRef = useRef(false)
  const basketRef = useRef(null)
  const pointerStartRef = useRef(null)
  const rottenStreakRef = useRef(0)

  // Dynamic cursor: basket fills with eggs as count increases
  useEffect(() => {
    const eggColors = ['%23FF6B6B','%23FECA57','%2348DBFB','%2355E6C1','%23C471ED',
                       '%23FF9FF3','%23FFA502','%237BED9F','%23FF4757','%230ABDE3']
    // Build tiny egg circles inside basket
    let eggsSvg = ''
    const count = Math.min(eggCount, 10)
    const positions = [
      [11,19],[16,19],[21,19],  // row 1 (bottom)
      [13,16],[18,16],[23,16],  // row 2
      [11,13],[16,13],[21,13],  // row 3
      [16,10],                   // row 4 (top, overflowing)
    ]
    for (let i = 0; i < count; i++) {
      const [cx, cy] = positions[i]
      eggsSvg += `<ellipse cx='${cx}' cy='${cy}' rx='2.2' ry='2.8' fill='${eggColors[i]}' stroke='rgba(0,0,0,0.2)' stroke-width='0.5'/>`
    }

    const svg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M6 14h20v2H6z' fill='%238B6914'/%3E%3Cpath d='M7 16c0 6 3 10 9 10s9-4 9-10' fill='%23C4A24E' stroke='%238B6914' stroke-width='1.5'/%3E%3Cpath d='M9 19h14M8 22h16' stroke='%238B6914' stroke-width='1' opacity='0.5'/%3E%3Cpath d='M16 6c-5 0-6 4-6 8h12c0-4-1-8-6-8z' fill='none' stroke='%238B6914' stroke-width='1.5'/%3E${eggsSvg}%3C/svg%3E`

    document.documentElement.style.cursor = `url("${svg}") 16 16, auto`

    return () => {
      // Don't reset if game is over — keep full basket
      if (!gameOverRef.current) {
        document.documentElement.style.cursor = ''
      }
    }
  }, [eggCount])

  // Show tutorial only on home page — wait for dot animation to finish
  useEffect(() => {
    if (!isHomePage) return
    if (localStorage.getItem('easter-game-won')) return // don't show after game won

    // Wait for the 'structured' class (dot animation done)
    const checkStructured = () => {
      if (document.documentElement.classList.contains('structured')) {
        setTimeout(() => setShowTutorial(true), 800)
      } else {
        // Keep checking
        const observer = new MutationObserver(() => {
          if (document.documentElement.classList.contains('structured')) {
            observer.disconnect()
            setTimeout(() => setShowTutorial(true), 800)
          }
        })
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
      }
    }
    const timer = setTimeout(checkStructured, 500)
    return () => clearTimeout(timer)
  }, [isHomePage])

  // ---- NEW MECHANIC: Chicks drop eggs, Rabbits steal them ----
  const [chicks, setChicks] = useState([])
  const stolenEggsRef = useRef(new Set()) // egg IDs a rabbit is targeting/stealing

  // Spawn chicks that walk in, drop an egg, and leave
  useEffect(() => {
    const MAX_EGGS = 6
    let chickTimer = null

    const scheduleChick = () => {
      chickTimer = setTimeout(spawnChick, 3000 + Math.random() * 3000)
    }

    const spawnChick = () => {
      if (gameOverRef.current) return

      const id = Date.now() + Math.random()
      const fromLeft = Math.random() > 0.5
      const dropPoint = 15 + Math.random() * 70
      const yPos = 15 + Math.random() * 55
      const walkDuration = 2000 + Math.random() * 1500

      setChicks(prev => [...prev, {
        id, fromLeft, yPos, dropPoint,
        approachDuration: walkDuration,
        scamperDuration: 1200,
        phase: 'approaching',
      }])

      // Chick drops egg when it reaches target
      setTimeout(() => {
        let isRotten = Math.random() < 0.2
        if (rottenStreakRef.current >= 2) isRotten = false
        if (isRotten) rottenStreakRef.current++
        else rottenStreakRef.current = 0

        const egg = isRotten ? makeRottenEgg() : randomEgg()

        setEggs(prev => {
          let next = [...prev]
          if (next.length >= MAX_EGGS) {
            next.sort((a, b) => a.createdAt - b.createdAt)
            next = next.slice(1)
          }
          return [...next, {
            id: `egg-${id}`,
            svg: egg.svg, name: egg.name, rotten: egg.rotten,
            x: dropPoint, y: yPos, createdAt: Date.now(),
            stolen: false,
          }]
        })

        // Chick walks away after dropping
        setTimeout(() => {
          setChicks(prev => prev.map(c =>
            c.id === id ? { ...c, phase: 'scampering' } : c
          ))
        }, 300)
      }, walkDuration)

      // Remove chick after it leaves the screen
      setTimeout(() => {
        setChicks(prev => prev.filter(c => c.id !== id))
      }, walkDuration + 1500)

      scheduleChick()
    }

    const firstTimer = setTimeout(spawnChick, 2000)
    return () => {
      clearTimeout(firstTimer)
      clearTimeout(chickTimer)
    }
  }, [])

  // Spawn rabbits that target and steal existing eggs
  useEffect(() => {
    let rabbitTimer = null

    const scheduleRabbit = () => {
      rabbitTimer = setTimeout(trySpawnRabbit, 5000 + Math.random() * 4000)
    }

    const trySpawnRabbit = () => {
      if (gameOverRef.current) return

      setEggs(currentEggs => {
        const available = currentEggs.filter(e => !e.stolen && !stolenEggsRef.current.has(e.id))
        if (available.length === 0) {
          scheduleRabbit()
          return currentEggs
        }

        const targetEgg = available[Math.floor(Math.random() * available.length)]
        stolenEggsRef.current.add(targetEgg.id)

        const id = Date.now() + Math.random()
        const fromLeft = Math.random() > 0.5
        const approachDuration = 1500 + Math.random() * 1500
        const scamperDuration = 600 + Math.random() * 400

        setRabbits(prev => [...prev, {
          id, fromLeft,
          yPos: targetEgg.y,
          dropPoint: targetEgg.x,
          approachDuration, scamperDuration,
          phase: 'approaching',
          targetEggId: targetEgg.id,
        }])

        // Rabbit reaches egg — grab it (remove from board, attach to rabbit)
        setTimeout(() => {
          // Grab the egg SVG before removing
          setEggs(prev => {
            const theEgg = prev.find(e => e.id === targetEgg.id)
            if (theEgg) {
              // Attach egg SVG to rabbit for visual carry
              setRabbits(rPrev => rPrev.map(r =>
                r.id === id ? { ...r, stolenEggSvg: theEgg.svg } : r
              ))
            }
            return prev.filter(e => e.id !== targetEgg.id)
          })

          // Brief pause on egg, then scamper away with it
          setTimeout(() => {
            setRabbits(prev => prev.map(r =>
              r.id === id ? { ...r, phase: 'scampering' } : r
            ))

            // Remove rabbit after scamper
            setTimeout(() => {
              setRabbits(prev => prev.filter(r => r.id !== id))
              stolenEggsRef.current.delete(targetEgg.id)
            }, scamperDuration + 200)
          }, 400)
        }, approachDuration)

        scheduleRabbit()
        return currentEggs
      })
    }

    const firstTimer = setTimeout(trySpawnRabbit, 7000)
    return () => {
      clearTimeout(firstTimer)
      clearTimeout(rabbitTimer)
    }
  }, [])

  // Auto-remove eggs after 8 seconds
  useEffect(() => {
    if (eggs.length === 0) return
    const timer = setInterval(() => {
      setEggs(prev => prev.filter(e => Date.now() - e.createdAt < 8000))
    }, 500)
    return () => clearInterval(timer)
  }, [eggs.length])

  // Egg fade-out in last 2 seconds
  const getEggOpacity = (createdAt) => {
    const age = Date.now() - createdAt
    if (age > 6000) return Math.max(0, 1 - (age - 6000) / 2000)
    return 1
  }

  const [, setTick] = useState(0)
  useEffect(() => {
    const hasFading = eggs.some(e => Date.now() - e.createdAt > 6000)
    if (!hasFading) return
    const raf = setInterval(() => setTick(t => t + 1), 50)
    return () => clearInterval(raf)
  }, [eggs])

  // Basket drag
  const handleBasketPointerDown = useCallback((e) => {
    e.preventDefault()
    const clientX = e.clientX || (e.touches && e.touches[0].clientX)
    const clientY = e.clientY || (e.touches && e.touches[0].clientY)
    pointerStartRef.current = { x: clientX, y: clientY, time: Date.now() }
  }, [])

  const handleBasketPointerUp = useCallback(() => {
    if (isDragging) setIsDragging(false)
    pointerStartRef.current = null
  }, [isDragging])

  useEffect(() => {
    const handleMove = (e) => {
      if (!pointerStartRef.current) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const dist = Math.sqrt((clientX - pointerStartRef.current.x) ** 2 + (clientY - pointerStartRef.current.y) ** 2)
      if (dist > 5) {
        setIsDragging(true)
        setBasketPos({ x: clientX - 30, y: clientY - 20 })
      }
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleBasketPointerUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleBasketPointerUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleBasketPointerUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleBasketPointerUp)
    }
  }, [handleBasketPointerUp])

  // Celebration burst
  const spawnCelebration = useCallback((x, y) => {
    const burstId = Date.now()
    const particles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const radius = 80 + Math.random() * 50
      return {
        id: `${burstId}-p-${i}`, originX: x, originY: y,
        dx: Math.cos(angle) * radius, dy: Math.sin(angle) * radius,
        emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
        size: 8 + Math.random() * 10, delay: Math.random() * 0.1,
      }
    })
    const flyers = Array.from({ length: 4 }, (_, i) => ({
      id: `${burstId}-f-${i}`, originX: x + (Math.random() - 0.5) * 30, originY: y,
      dx: (Math.random() - 0.5) * 150, dy: -(100 + Math.random() * 120),
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      size: 18 + Math.random() * 12, delay: Math.random() * 0.15, isFlyer: true,
    }))
    setCelebrations(prev => [...prev, ...particles, ...flyers])
    setRings(prev => [...prev, { id: `${burstId}-ring`, x, y }])
    setTimeout(() => {
      setCelebrations(prev => prev.filter(p => !p.id.startsWith(`${burstId}-`)))
      setRings(prev => prev.filter(r => r.id !== `${burstId}-ring`))
    }, 1200)
  }, [])

  // Click egg — blocked if stolen by rabbit
  const handleEggClick = useCallback((eggId, e) => {
    const clickedEgg = eggs.find(egg => egg.id === eggId)
    if (!clickedEgg || clickedEgg.stolen) return // can't click stolen eggs

    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const isRotten = clickedEgg.rotten

    setEggs(prev => prev.filter(egg => egg.id !== eggId))

    if (isRotten) {
      setEggCount(prev => Math.max(0, prev - 1))
      setBasketShake(true)
      setTimeout(() => setBasketShake(false), 800)
    } else {
      setEggCount(prev => {
        const newCount = prev + 1
        if (newCount >= 10 && !milestoneReached) {
          setShowMilestone(true)
          setMilestoneReached(true)
          gameOverRef.current = true
          localStorage.setItem('easter-game-won', '1')
          setRabbits([])
          setChicks([])
          setEggs([])
        }
        return newCount
      })
      spawnCelebration(cx, cy)
      setBasketBounce(true)
      setTimeout(() => setBasketBounce(false), 500)
    }
  }, [milestoneReached, spawnCelebration, eggs])

  const dismissMilestone = useCallback(() => setShowMilestone(false), [])

  // Rabbit CSS style helper — always use LEFT positioning for consistency
  const getRabbitStyle = (rabbit) => {
    const { fromLeft, yPos, dropPoint, phase, approachDuration, scamperDuration } = rabbit
    const base = {
      top: `${yPos}%`,
      position: 'fixed',
      zIndex: 10000,
      '--approach-dur': `${approachDuration}ms`,
      '--scamper-dur': `${scamperDuration}ms`,
    }

    if (phase === 'approaching') {
      if (fromLeft) {
        return { ...base, left: '-60px', '--target-x': `${dropPoint}vw` }
      } else {
        return { ...base, left: '100vw', '--target-x': `${dropPoint}vw` }
      }
    } else if (phase === 'scampering') {
      if (fromLeft) {
        return { ...base, left: `${dropPoint}vw`, '--current-x': `${dropPoint}vw` }
      } else {
        return { ...base, left: `${dropPoint}vw`, '--current-x': `${dropPoint}vw` }
      }
    }
    return base
  }

  return (
    <div className="easter-overlay">
      {/* Chicks */}
      {chicks.map(chick => (
        <div
          key={chick.id}
          className={`hopping-rabbit ${chick.fromLeft ? 'face-right' : 'face-left'} phase-${chick.phase}`}
          style={getRabbitStyle(chick)}
        >
          🐥
        </div>
      ))}

      {/* Rabbits */}
      {rabbits.map(rabbit => (
        <div
          key={rabbit.id}
          className={`hopping-rabbit ${rabbit.fromLeft ? 'face-right' : 'face-left'} phase-${rabbit.phase}`}
          style={{...getRabbitStyle(rabbit), zIndex: 10001}}
        >
          🐰
          {rabbit.stolenEggSvg && (
            <img src={rabbit.stolenEggSvg} alt="stolen egg" width="24" height="28"
              style={{ position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
              draggable={false} />
          )}
        </div>
      ))}

      {/* Eggs */}
      {eggs.map(egg => (
        <div
          key={egg.id}
          className={`dropped-egg${egg.rotten ? ' rotten-egg' : ''}${egg.stolen ? ' egg-stolen' : ''}`}
          style={{
            left: `${egg.x}%`,
            top: `${egg.y}%`,
            opacity: egg.stolen ? 0.5 : getEggOpacity(egg.createdAt),
            pointerEvents: egg.stolen ? 'none' : 'auto',
          }}
          onClick={(e) => handleEggClick(egg.id, e)}
          title={egg.stolen ? 'Stolen by rabbit!' : egg.rotten ? 'Rotten egg! Beware!' : 'Click to collect!'}
        >
          <img src={egg.svg} alt={egg.rotten ? 'Rotten egg' : 'Easter egg'} width="40" height="48" draggable={false} />
        </div>
      ))}

      {/* Basket — hidden after game won */}
      {!milestoneReached && (
        <div
          ref={basketRef}
          className={`egg-basket${basketBounce ? ' found-new' : ''}${basketShake ? ' being-robbed' : ''}${isDragging ? ' dragging' : ''}`}
          style={basketPos.y !== null ? {
            left: `${basketPos.x}px`,
            top: `${basketPos.y}px`,
            bottom: 'auto',
          } : {
            left: `${basketPos.x}px`,
          }}
          onPointerDown={handleBasketPointerDown}
          onPointerUp={handleBasketPointerUp}
        >
          <span className="basket-icon">🧺</span>
          <span className="egg-count">{eggCount}</span>
          {eggCount > 0 && <span className="egg-progress">/ 10</span>}
          <span className="basket-label">Collect the eggs!</span>
        </div>
      )}

      {/* Celebrations */}
      {celebrations.length > 0 && (
        <div className="confetti-container">
          {celebrations.map(p => (
            p.isFlyer ? (
              <div key={p.id} className="celebration-flyer"
                style={{ left: `${p.originX}px`, top: `${p.originY}px`, fontSize: `${p.size}px`,
                  '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.delay}s` }}>
                {p.emoji}
              </div>
            ) : (
              <div key={p.id} className="celebration-ring-particle"
                style={{ left: `${p.originX}px`, top: `${p.originY}px`, fontSize: `${p.size}px`,
                  '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animationDelay: `${p.delay}s` }}>
                {p.emoji}
              </div>
            )
          ))}
        </div>
      )}

      {rings.map(ring => (
        <div key={ring.id} className="celebration-ring-pulse"
          style={{ left: `${ring.x}px`, top: `${ring.y}px` }} />
      ))}

      {/* Milestone */}
      {showMilestone && (
        <div className="milestone-backdrop">
          <div className="milestone-popup" onClick={(e) => e.stopPropagation()}>
            <div className="milestone-emoji">🎁</div>
            <h2 className="milestone-title">You Found Them All!</h2>
            <p className="milestone-message">10 eggs collected! You've earned a special gift 🎉</p>
            <div className="milestone-count">{eggCount} eggs in your basket</div>
            <div className="gift-email-section">
              <label className="gift-email-label">Who are we sending the gift to?</label>
              <input type="email" className="gift-email-input" placeholder="your@email.com"
                value={giftEmail} onChange={(e) => setGiftEmail(e.target.value)} autoFocus />
            </div>
            <button className="milestone-close"
              onClick={() => { if (giftEmail.trim()) dismissMilestone() }}
              style={{ opacity: giftEmail.trim() ? 1 : 0.5 }}>
              Send My Gift 🎁
            </button>
          </div>
        </div>
      )}

      {/* Tutorial */}
      {showTutorial && (
        <div className="milestone-backdrop" onClick={() => setShowTutorial(false)}>
          <div className="tutorial-popup" onClick={(e) => e.stopPropagation()}>
            <div className="tutorial-emoji">🐥🥚🐰</div>
            <h2 className="tutorial-title">Easter Egg Hunt!</h2>
            <div className="tutorial-rules">
              <div className="tutorial-rule">
                <span className="tutorial-rule-icon">🐥</span>
                <span>Chicks drop <strong>colourful eggs</strong> — click them to collect!</span>
              </div>
              <div className="tutorial-rule">
                <span className="tutorial-rule-icon">🐰</span>
                <span>Watch out for <strong>sneaky rabbits</strong> — they'll steal your eggs!</span>
              </div>
              <div className="tutorial-rule">
                <span className="tutorial-rule-icon">🤢</span>
                <span>Avoid <strong>rotten eggs</strong> — they'll remove one from your basket!</span>
              </div>
              <div className="tutorial-rule">
                <span className="tutorial-rule-icon">🎁</span>
                <span>Collect <strong>10 eggs</strong> to receive a special gift!</span>
              </div>
            </div>
            <button className="milestone-close" onClick={() => setShowTutorial(false)}>
              Let's Go! 🐰
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
