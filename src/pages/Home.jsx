import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import ScrollFlowchart from '../components/ScrollFlowchart'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

export default function Home() {
  const canvasRef = useBgCanvas(true)
  const revealRef = useReveal()

  useEffect(() => {
    document.title = 'CherryStone | Turning chaos into calm'
  }, [])

  return (
    <PageWrapper isHomePage={true}>
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          <section className="container" style={{ alignItems: 'center' }}>
            <h1 className="hero-title reveal" style={{ textAlign: 'center', opacity: 0, visibility: 'hidden' }}>Turning chaos <br /> into calm.</h1>
            <div className="section-divider reveal" style={{ marginTop: '30px', opacity: 0, visibility: 'hidden' }}></div>
            <p className="reveal hero-subtitle" style={{ marginTop: '10px', fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'var(--text-grey)', maxWidth: '600px', lineHeight: '1.6', transitionDelay: '0.2s', textAlign: 'center', opacity: 0, visibility: 'hidden' }}>
              We map, measure, and master your business processes — so you can focus on growth, not guesswork.
            </p>
          </section>

          {/* Scroll-driven flowchart */}
          <ScrollFlowchart />

          {/* Closing section */}
          <section className="container reveal" style={{ alignItems: 'center', paddingTop: '100px', paddingBottom: '120px' }}>
            <h2 className="reveal" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px', color: 'white', textAlign: 'center' }}>
              Ready to See Clearly?
            </h2>
            <div className="section-divider"></div>
            <p className="reveal" style={{ fontSize: '1.15rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', textAlign: 'center', transitionDelay: '0.1s' }}>
              Every great transformation starts with understanding where you are. Let us map your operations and show you the path forward.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
