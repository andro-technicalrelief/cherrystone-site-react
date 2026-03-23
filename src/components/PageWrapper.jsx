import { useEffect } from 'react'

export default function PageWrapper({ theme, isHomePage, children }) {
  useEffect(() => {
    // Set body class for theme
    if (theme) {
      document.body.className = theme
    } else if (isHomePage) {
      document.body.className = 'home-page'
    } else {
      document.body.className = ''
    }

    return () => {
      document.body.className = ''
    }
  }, [theme, isHomePage])

  // Measure footer height and set CSS variable for the reveal gap
  useEffect(() => {
    const updateFooterHeight = () => {
      const footer = document.querySelector('.footer-high')
      if (footer) {
        const h = footer.offsetHeight
        document.documentElement.style.setProperty('--footer-height', `${h}px`)
      }
    }

    // Initial measurement after DOM paint
    const raf = requestAnimationFrame(updateFooterHeight)

    // Re-measure on resize
    window.addEventListener('resize', updateFooterHeight)

    // Also observe the footer itself for size changes
    const footer = document.querySelector('.footer-high')
    let ro
    if (footer && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(updateFooterHeight)
      ro.observe(footer)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', updateFooterHeight)
      if (ro) ro.disconnect()
    }
  }, [])

  return <>{children}</>
}
