import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

export default function Terms() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()

  useEffect(() => {
    document.title = 'Terms & Conditions | CherryStone'
  }, [])

  return (
    <PageWrapper>
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          <section className="container" style={{ paddingTop: '120px' }}>
            <h1 className="reveal" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: '1.1', marginBottom: '40px', wordBreak: 'break-word', hyphens: 'auto' }}>
              TERMS &amp;<br />CONDITIONS
            </h1>
            <div className="reveal" style={{ color: 'var(--text-grey)', lineHeight: '1.8', maxWidth: '800px' }}>
              <p>Last updated: February 21, 2026</p>
              <br />
              <h3>1. Terms</h3>
              <p>By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use,
                all applicable laws and regulations, and agree that you are responsible for compliance with any
                applicable local laws.</p>
              <br />
              <h3>2. Use License</h3>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on
                CherryStone's website for personal, non-commercial transitory viewing only.</p>
              <br />
              <h3>3. Disclaimer</h3>
              <p>The materials on CherryStone's website are provided "as is". CherryStone makes no warranties,
                expressed or implied, and hereby disclaims and negates all other warranties, including without
                limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation of rights.</p>
              <br />
              <h3>4. Limitations</h3>
              <p>In no event shall CherryStone or its suppliers be liable for any damages (including, without
                limitation, damages for loss of data or profit, or due to business interruption) arising out of the
                use or inability to use the materials on CherryStone's Internet site.</p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
