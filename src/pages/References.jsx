import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import PageWrapper from '../components/PageWrapper'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

const logos = [
  { src: '/images/worth-logonobg.png', alt: 'Worth' },
  { src: '/images/wchsolutions-logonobg.png', alt: 'WCHSolutions' },
  { src: '/images/capitec-logonobg.png', alt: 'Capitec' },
  { src: '/images/metaperformance-logonobg.png', alt: 'Metaperformance', scale: true },
  { src: '/images/gainmaker-logonobg.png', alt: 'Gainmaker' },
  { src: '/images/jec-logonobg.png', alt: 'JEC' },
]

export default function References() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()
  const trackRef = useRef(null)
  const carouselXRef = useRef(0)
  const targetRateRef = useRef(1)
  const currentRateRef = useRef(1)
  const lastScrollTopRef = useRef(0)

  useEffect(() => {
    document.title = 'Collaborations | CherryStone'
  }, [])

  useEffect(() => {
    let animFrame

    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop
      const diff = Math.abs(st - lastScrollTopRef.current)
      
      if (diff > 5) { // Add threshold to prevent jitter
        if (st > lastScrollTopRef.current) {
          targetRateRef.current = -1
        } else if (st < lastScrollTopRef.current) {
          targetRateRef.current = 1
        }
      }
      lastScrollTopRef.current = st <= 0 ? 0 : st
    }

    const animate = () => {
      const track = trackRef.current
      if (track) {
        currentRateRef.current += (targetRateRef.current - currentRateRef.current) * 0.05
        carouselXRef.current -= currentRateRef.current * 1.5

        let maxScroll = track.scrollWidth / 2
        if (track.children && track.children.length >= 12) {
          maxScroll = track.children[6].offsetLeft - track.children[0].offsetLeft
        }

        if (maxScroll > 0) {
          if (carouselXRef.current <= -maxScroll) {
            carouselXRef.current += maxScroll
          } else if (carouselXRef.current >= 0) {
            carouselXRef.current -= maxScroll
          }
        }

        track.style.transform = `translateX(${carouselXRef.current}px)`
      }
      animFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll)
    animate()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <PageWrapper theme="theme-blue">
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          <section className="container" style={{ marginBottom: '120px', alignItems: 'center' }}>
            <h1 className="hero-title reveal" style={{ marginBottom: '40px', textAlign: 'center' }}>COLLABORATIONS</h1>
            <div className="section-divider"></div>
            <p className="reveal" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', maxWidth: '700px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', transitionDelay: '0.15s', textAlign: 'center' }}>
              Trusted partnerships built on shared vision. We work alongside industry leaders and growing enterprises
              to structure, visualise, and elevate their operations.
            </p>
          </section>

          <div style={{ backgroundColor: '#3b82f6', position: 'relative', zIndex: 2, paddingTop: '20px' }}>
            <section className="logo-carousel reveal">
              <div className="logo-track" ref={trackRef}>
                {/* Original logos + duplicates for infinite scroll */}
                {[...logos, ...logos].map((logo, idx) => (
                  <div className="logo-item" key={idx}>
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      style={logo.scale ? { transform: 'scale(1.8)' } : {}}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="container" style={{ marginTop: '60px', paddingBottom: '60px', alignItems: 'center' }}>
              {/* Title */}
              <h2 className="reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '20px', textAlign: 'center' }}>
                Trust Earned. Complexity Visualized.
              </h2>
              <div className="section-divider"></div>
              <p className="reveal" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', maxWidth: '800px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '50px', textAlign: 'center' }}>
                The logos above represent organizations that chose to master their operational data rather than
                be managed by it. By documenting their internal "nervous system," we provided the objective
                visibility required to move from reactive troubleshooting to data-driven oversight.
              </p>

              {/* Exposing the Invisible Ceiling */}
              <h3 className="reveal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '20px', textAlign: 'center' }}>
                Exposing the Invisible Ceiling
              </h3>
              <p className="reveal" style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', textAlign: 'center' }}>
                Most businesses reach a point where adding more staff doesn't lead to more profit—it just adds
                more complexity. This is the "Invisible Ceiling" caused by undocumented "tribal knowledge" and
                manual data silos that have never been measured.
              </p>

              <p className="reveal" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                We help you expose these barriers by:
              </p>

              <ul className="reveal barriers-grid" style={{ listStyleType: 'none', paddingLeft: 0, maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px' }}>
                <li style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', marginBottom: '8px' }}><Icon name="search" size={22} color="var(--primary-blue)" /></span>
                  <span><strong style={{ color: 'white' }}>Decoding the Chaos:</strong> We "look under the hood" to
                    document the exact reality of how work moves through your company, creating a digital
                    twin of your current operations.</span>
                </li>
                <li style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', marginBottom: '8px' }}><Icon name="shield" size={22} color="var(--primary-blue)" /></span>
                  <span><strong style={{ color: 'white' }}>Quantifying Vulnerability:</strong> We pinpoint
                    high-risk repetitive tasks where manual entry and lack of oversight are silently
                    draining your resources.</span>
                </li>
                <li style={{ fontSize: '1.05rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', padding: '20px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <span style={{ display: 'inline-block', marginBottom: '8px' }}><Icon name="link" size={22} color="var(--primary-blue)" /></span>
                  <span><strong style={{ color: 'white' }}>Mapping the Disconnect:</strong> We visualize the gaps
                    between your isolated software systems, measuring the impact of fragmented data flow on
                    your overall efficiency.</span>
                </li>
              </ul>

              {/* The Outcome */}
              <h3 className="reveal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '20px', textAlign: 'center' }}>
                The Outcome: Total Operational Clarity
              </h3>
              <p className="reveal" style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', textAlign: 'center' }}>
                When your processes are mapped and measured, you transition from "guessing" to "knowing".
              </p>

              {/* Comparison Table */}
              <div className="reveal" style={{ maxWidth: '800px', marginBottom: '60px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '14px 18px', borderBottom: '2px solid var(--primary-blue)', color: 'white', fontWeight: '700', fontSize: '1.05rem' }}>
                        Current State (Opacity)
                      </th>
                      <th style={{ textAlign: 'left', padding: '14px 18px', borderBottom: '2px solid var(--primary-blue)', color: 'white', fontWeight: '700', fontSize: '1.05rem' }}>
                        Future State (Clarity)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Operational bottlenecks are felt but not seen.
                      </td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Every friction point is mapped, measured, and reported.
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Tribal knowledge leaves the business vulnerable.
                      </td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        Every workflow is documented as a permanent asset.
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.7)' }}>
                        Decisions are made based on "gut feelings" or anecdotes.
                      </td>
                      <td style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.85)' }}>
                        Strategy is built on objective process analytics.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Blockquote */}
              <blockquote className="reveal" style={{ maxWidth: '800px', borderLeft: '3px solid var(--primary-blue)', padding: '20px 30px', margin: '0 0 60px 0', fontSize: '1.15rem', lineHeight: '1.7', color: 'rgba(255,255,255,0.9)', fontStyle: 'italic' }}>
                "We don't just give you a map; we give you the truth. Our goal is to provide the technical
                clarity and reporting you need to reclaim your team's energy and lead with certainty."
              </blockquote>

              {/* CTA */}
              <h3 className="reveal" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', marginBottom: '20px', textAlign: 'center' }}>
                Ready to See Your Business Clearly?
              </h3>
              <p className="reveal" style={{ fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', marginBottom: '30px', textAlign: 'center' }}>
                If you suspect your growth has plateaued due to hidden operational friction, it's time for a
                professional Process Audit. We provide the analytical depth needed to ensure you understand your
                operations as well as you understand your ambition.
              </p>
              <Link to="/contact" className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', fontSize: '1.1rem', fontWeight: '700', padding: '14px 30px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', transition: 'all 0.4s ease', marginBottom: '20px' }}>
                Book a Process Audit →
              </Link>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
