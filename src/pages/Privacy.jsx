import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageWrapper from '../components/PageWrapper'
import useBgCanvas from '../hooks/useBgCanvas'
import useReveal from '../hooks/useReveal'

export default function Privacy() {
  const canvasRef = useBgCanvas(false)
  const revealRef = useReveal()

  useEffect(() => {
    document.title = 'Privacy Policy | CherryStone'
  }, [])

  return (
    <PageWrapper>
      <div className="page-content">
        <canvas id="bg-canvas" ref={canvasRef}></canvas>
        <Navbar />
        <main ref={revealRef}>
          <section className="container" style={{ paddingTop: '120px' }}>
            <h1 className="reveal" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', lineHeight: '1.1', marginBottom: '40px', wordBreak: 'break-word', hyphens: 'auto' }}>
              PRIVACY<br />POLICY
            </h1>
            <div className="reveal" style={{ color: 'var(--text-grey)', lineHeight: '1.8', maxWidth: '800px' }}>
              <p>Last updated: February 21, 2026</p>
              <br />
              <h3>1. Information We Collect</h3>
              <p>We collect information that you provide directly to us, such as when you send us an email or contact
                us through our website. This may include your name, email address, and any other information you
                choose to provide.</p>
              <br />
              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, to communicate with
                you, and to respond to your inquiries.</p>
              <br />
              <h3>3. Information Sharing</h3>
              <p>We do not share your personal information with third parties except as required by law or with your
                explicit consent.</p>
              <br />
              <h3>4. Security</h3>
              <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and
                unauthorized access.</p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </PageWrapper>
  )
}
