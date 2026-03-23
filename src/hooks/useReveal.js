import { useEffect, useRef } from 'react'

export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Wait until the page is in 'structured' mode before observing reveals
    // This prevents the home page hero text from flashing before the scroll animation
    const startObserving = () => {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              requestAnimationFrame(() => {
                setTimeout(() => {
                  entry.target.classList.add('active')
                }, 80)
              })
              obs.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )

      const revealElements = el.querySelectorAll('.reveal')
      revealElements.forEach(child => observer.observe(child))
      if (el.classList.contains('reveal')) {
        observer.observe(el)
      }

      return observer
    }

    // If html has 'unstructured' class, wait for it to become 'structured'
    let observer = null
    if (document.documentElement.classList.contains('unstructured')) {
      const mutObs = new MutationObserver(() => {
        if (document.documentElement.classList.contains('structured')) {
          mutObs.disconnect()
          // Small delay to let the main opacity transition start
          setTimeout(() => {
            observer = startObserving()
          }, 100)
        }
      })
      mutObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

      return () => {
        mutObs.disconnect()
        if (observer) observer.disconnect()
      }
    } else {
      observer = startObserving()
      return () => observer.disconnect()
    }
  }, [])

  return ref
}
