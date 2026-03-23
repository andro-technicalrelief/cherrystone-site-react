import { useEffect, useRef, useCallback } from 'react'

export default function useBgCanvas(isHomePage = false) {
  const canvasRef = useRef(null)
  const dotsRef = useRef([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const scrollProgressRef = useRef(isHomePage ? 0 : 1)
  const isStructuredRef = useRef(!isHomePage)
  const structureHoldRef = useRef(0)
  const dimRef = useRef({ width: 0, height: 0 })
  const animFrameRef = useRef(null)

  const GRID_SIZE = 40

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    dimRef.current = { width, height }
    const dots = []

    for (let x = 0; x < width; x += GRID_SIZE) {
      for (let y = 0; y < height; y += GRID_SIZE) {
        const speed = 0.3 + Math.random() * 2.2 // varied speeds for trackable balls
        const angle = Math.random() * Math.PI * 2
        dots.push({
          ox: x,
          oy: y,
          x: (isHomePage && !isStructuredRef.current) ? Math.random() * width : x,
          y: (isHomePage && !isStructuredRef.current) ? Math.random() * height : y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        })
      }
    }

    dotsRef.current = dots
  }, [isHomePage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isHomePage && !isStructuredRef.current) {
      document.documentElement.classList.add('unstructured')
      document.body.classList.add('home-page')
    } else {
      document.documentElement.classList.remove('unstructured')
      document.documentElement.classList.add('structured')
    }

    init()

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    let touchStart = 0

    const handleScrollEvent = (e) => {
      if (!isStructuredRef.current) {
        e.preventDefault()
        let delta = e.deltaY || 0
        if (e.type === 'touchmove') {
          delta = touchStart - e.touches[0].clientY
          touchStart = e.touches[0].clientY
        }
        scrollProgressRef.current = Math.min(scrollProgressRef.current + Math.abs(delta) / 150, 1)
        if (scrollProgressRef.current >= 1) {
          if (structureHoldRef.current < 5) {
            structureHoldRef.current++
            e.preventDefault()
          } else {
            isStructuredRef.current = true
            document.documentElement.classList.remove('unstructured')
            document.documentElement.classList.add('structured')
          }
        }
      }
    }

    const handleTouchStart = (e) => {
      touchStart = e.touches[0].clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', init)

    if (isHomePage) {
      window.addEventListener('wheel', handleScrollEvent, { passive: false })
      window.addEventListener('touchstart', handleTouchStart)
      window.addEventListener('touchmove', handleScrollEvent, { passive: false })
    }

    // Animation loop
    const animate = () => {
      const ctx = canvas.getContext('2d')
      const { width, height } = dimRef.current
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'

      const pageContent = document.querySelector('.page-content')
      let pageBottom = height
      if (pageContent) {
        pageBottom = pageContent.getBoundingClientRect().bottom
      }

      const scrollProgress = scrollProgressRef.current
      const mouse = mouseRef.current

      dotsRef.current.forEach(dot => {
        if (isHomePage && scrollProgress < 1) {
          dot.x += dot.vx
          dot.y += dot.vy
          if (dot.x < 0 || dot.x > width) dot.vx *= -1
          if (dot.y < 0 || dot.y > height) dot.vy *= -1
        }

        let finalX, finalY
        if (isHomePage) {
          finalX = dot.x + (dot.ox - dot.x) * scrollProgress
          finalY = dot.y + (dot.oy - dot.y) * scrollProgress
        } else {
          finalX = dot.ox
          finalY = dot.oy
        }

        if (scrollProgress >= 1) {
          const dx = mouse.x - dot.ox
          const dy = mouse.y - dot.oy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const influence = Math.max(0, 100 - dist) * 0.5
          const angle = Math.atan2(dy, dx)
          finalX = dot.ox - Math.cos(angle) * influence
          finalY = dot.oy - Math.sin(angle) * influence
        }

        if (finalY > pageBottom) return

        ctx.beginPath()
        ctx.arc(finalX, finalY, 1.2, 0, Math.PI * 2)
        ctx.fill()
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', init)
      if (isHomePage) {
        window.removeEventListener('wheel', handleScrollEvent)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchmove', handleScrollEvent)
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      // Clean up body/html classes
      document.documentElement.classList.remove('unstructured', 'structured')
      document.body.classList.remove('home-page')
    }
  }, [isHomePage, init])

  return canvasRef
}
